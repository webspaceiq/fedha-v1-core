// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../libraries/Errors.sol";
import "../../interfaces/ITreasury.sol";
import "../../interfaces/IPriceOracle.sol";
import "../tokens/FERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Treasury is AccessControl, ITreasury, ReentrancyGuard {
    using SafeMath for uint256;
    FERC20 internal _tokenInstance; 
    IPriceOracle internal _oracleInstance;
    bool internal _paused;
    bytes32 public constant TREASURY_ADMIN_ROLE = keccak256("TREASURY_ADMIN_ROLE");

    constructor(address tokenAddr_, address oracleAddr_) {
        require(tokenAddr_ != address(0), Errors.ZERO_ASSET_ADDRESS_NOT_VALID);
        require(
            oracleAddr_ != address(0),
            Errors.ZERO_ORACLE_ADDRESS_NOT_VALID
        );
        _paused = true;
        _tokenInstance = FERC20(tokenAddr_);
        _oracleInstance = IPriceOracle(oracleAddr_);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        mint(msg.sender, msg.value);
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        mint(msg.sender, msg.value);
    }

    function getOracleAddr() public view override returns (address) {
        return address(_oracleInstance);
    }

    function setOracleAddr(address oracleAddr_) public override onlyRole(TREASURY_ADMIN_ROLE) {
        require(
            oracleAddr_ != address(0),
            Errors.ZERO_ORACLE_ADDRESS_NOT_VALID
        );
        _oracleInstance = IPriceOracle(oracleAddr_);
    }

    function getTokenAddr() public view override returns (address) {
        return address(_tokenInstance);
    }

    function setTokenAddr(address tokenAddr_) public override onlyRole(TREASURY_ADMIN_ROLE) {
        require(tokenAddr_ != address(0), Errors.ZERO_ASSET_ADDRESS_NOT_VALID);
        _tokenInstance = FERC20(tokenAddr_);
    }

    function pause() public onlyRole(TREASURY_ADMIN_ROLE) {
        _paused = true;
    }

    function unpause() public onlyRole(TREASURY_ADMIN_ROLE) {
        _paused = false;
    }

    function mint(
        address reciepientAddr_,
        uint256 amount_
    ) public payable override nonReentrant {
        require(amount_ > 0, Errors.ZERO_ASSET_AMOUNT_NOT_VALID);
        require(
            reciepientAddr_ != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );
        require(
            _tokenInstance.balanceOf(address(this)) >= amount_,
            Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE
        );
        // Get price of asset
        uint256 price = _oracleInstance.getPrice();
        require(price > 0, Errors.ZERO_ASSET_PRICE_NOT_VALID);

        uint256 mintValue = amount_.div(price);
        require(mintValue > 0, Errors.INSUFFICIENT_MINT_FUNDS);
        emit Mint(msg.sender, reciepientAddr_, amount_);
    }

    function burn(uint256 amount_) external override  onlyRole(TREASURY_ADMIN_ROLE) nonReentrant {

        require(amount_ > 0, Errors.ZERO_TOKEN_AMOUNT_NOT_VALID);
        require(
            _tokenInstance.balanceOf(address(this)) >= amount_,
            Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE
        );
        require(
            msg.sender != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );
        _burn(amount_);

        emit Burn(msg.sender, amount_);
    }

    function _mint(address reciepientAddr_, uint256 amount_) internal virtual {
        // Transfer tokens to vault
        _tokenInstance.transfer(reciepientAddr_, amount_);
    }

    function _burn(uint256 amount_) internal virtual {
        _tokenInstance.burn(amount_);
    }

    function disburse(
        address[] calldata recieptients_,
        uint256[] calldata amounts_
    ) public override onlyRole(TREASURY_ADMIN_ROLE) {}
}
