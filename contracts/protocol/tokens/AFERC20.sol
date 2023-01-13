// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FERC20.sol";
import "../libraries/Errors.sol";
import "../../interfaces/IAFERC20.sol";
import "../../interfaces/IPriceOracle.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AFERC20 is IAFERC20, FERC20, ReentrancyGuard {
    using SafeMath for uint256;

    IPriceOracle _priceOracle;
    IERC20 public immutable _token;

    constructor(
        string memory name_,
        string memory symbol_,
        address priceOracle_,
        address token_
    ) FERC20(name_, symbol_) {
        require(
            priceOracle_ != address(0),
            Errors.ZERO_ORACLE_ADDRESS_NOT_VALID
        );
        require(token_ != address(0), Errors.ZERO_ASSET_ADDRESS_NOT_VALID);
        _token = IERC20(token_);
        _priceOracle = IPriceOracle(priceOracle_);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }

    /**
     * @notice Mints a certain amount of the specified asset
     * @param beneficiary_ The addresses of the asset
     * @param amount_ The addresses of the asset
     */
    function mintToken(
        address beneficiary_,
        uint256 amount_
    ) public payable override nonReentrant {
        require(amount_ > 0, Errors.ZERO_ASSET_AMOUNT_NOT_VALID);
        require(
            beneficiary_ != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );
        require(
            _token.balanceOf(msg.sender) >= amount_,
            Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE
        );
        // Get price of asset
        uint256 price = _priceOracle.getPrice();
        require(price > 0, Errors.ZERO_ASSET_PRICE_NOT_VALID);

        uint256 mintValue = amount_.div(price);
        require(mintValue > 0, Errors.INSUFFICIENT_MINT_FUNDS);

        // Transfer tokens to vault
        _token.transferFrom(msg.sender, address(this), amount_);

        // Mint amount of tokens to beneficiary
        _mint(beneficiary_, mintValue);

        emit Mint(msg.sender, beneficiary_, amount_);
    }

    /**
     * @dev Destroys `amount_` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount_) public override {
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
        // Calculate the amount of asset to transfer after burning token
        uint256 underlyingAmount = amount_.mul(price);
        require(underlyingAmount > 0, Errors.INSUFFICIENT_BURN_FUNDS);
        require(
            _token.balanceOf(address(this)) >= underlyingAmount,
            Errors.INSUFFICIENT_FUNDS
        );

        _burn(msg.sender, amount_);

        _token.transfer(msg.sender, underlyingAmount);

        emit Burn(_msgSender(), msg.sender, amount_);
    }
}
