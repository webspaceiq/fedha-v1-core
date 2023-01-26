// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FERC20.sol";
import "../libraries/Errors.sol";
import "../../interfaces/IAFERC20.sol";
import "../../interfaces/ITokenOracle.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NAFERC20 is FERC20, ReentrancyGuard {
    using SafeMath for uint256;
    event Mint(
        address indexed caller,
        uint256 value
    );

    event Burn(
        address indexed caller,
        uint256 value
    );

    ITokenOracle _priceOracle;

    constructor(
        string memory name_,
        string memory symbol_,
        address priceOracle_
    ) FERC20(name_, symbol_) {
        require(
            priceOracle_ != address(0),
            Errors.ZERO_ORACLE_ADDRESS_NOT_VALID
        );
        _priceOracle = ITokenOracle(priceOracle_);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        _mintToken(msg.sender, msg.value);
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        _mintToken(msg.sender, msg.value);
    }

    /**
     * @notice Mints a certain amount of the specified asset
     * @param amount_ The amount of the asset to burn
     */
    function _mintToken(address beneficiary_, uint256 amount_) internal nonReentrant {
        require(amount_ > 0, Errors.ZERO_ASSET_AMOUNT_NOT_VALID);
        require(
            beneficiary_ != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );
        // Get price of asset relative to ether
        uint256 price = _priceOracle.getPrice();
        require(price > 0, Errors.ZERO_ASSET_PRICE_NOT_VALID);

        uint256 amount = amount_.div(price);
        require(amount > 0, Errors.INSUFFICIENT_MINT_FUNDS);

        // Transfer ether to vault
        /* (bool success, ) = address(this).call{value: msg.value}("");
        require(success, Errors.TRANSFER_FUNDS_TO_VAULT_FAILURE); */

        // Mint amount of tokens to beneficiary
        _mint(beneficiary_, amount);

        emit Mint(msg.sender, amount);
    }

    /**
     * @notice Burns a certain amount of the specified asset
     * @param amount_ The amount of the asset to burn
     */
    function burn(uint256 amount_) public override nonReentrant {
        require(amount_ > 0, Errors.ZERO_TOKEN_AMOUNT_NOT_VALID);
        require(
            balanceOf(msg.sender) >= amount_,
            Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE
        );
        require(
            msg.sender != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );
        
        uint256 price = _priceOracle.getPrice();
        require(price > 0, Errors.ZERO_ASSET_PRICE_NOT_VALID);

        uint256 underlyingAmount = amount_.mul(price);
        require(underlyingAmount > 0, Errors.INSUFFICIENT_BURN_FUNDS);
        require(
            address(this).balance >= underlyingAmount,
            Errors.INSUFFICIENT_FUNDS
        );

        _burn(msg.sender, amount_);

        (bool success, ) = msg.sender.call{value: underlyingAmount}("");
        require(success, Errors.TRANSFER_FUNDS_FROM_VAULT_FAILURE);

        emit Burn(_msgSender(), amount_);
    }
}
