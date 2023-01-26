// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../libraries/Errors.sol";
import "../../interfaces/ITreasury.sol";
import "../../interfaces/ITokenOracle.sol";
import "../tokens/FERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Treasury is AccessControl, ITreasury, ReentrancyGuard {
    using SafeMath for uint256;
    FERC20 internal _tokenInstance;
    ITokenOracle internal _oracleInstance;
    bool internal _paused;
    bytes32 public constant TREASURY_ADMIN_ROLE =
        keccak256("TREASURY_ADMIN_ROLE");

    constructor(address tokenAddr_, address oracleAddr_) {
        require(tokenAddr_ != address(0), Errors.ZERO_ASSET_ADDRESS_NOT_VALID);
        require(
            oracleAddr_ != address(0),
            Errors.ZERO_ORACLE_ADDRESS_NOT_VALID
        );
        _paused = true;
        _tokenInstance = FERC20(tokenAddr_);
        _oracleInstance = ITokenOracle(oracleAddr_);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TREASURY_ADMIN_ROLE, msg.sender);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /**
     * @notice Returns the address of the price oracle
     * @return The address of the price oracle
     */
    function getOracleAddr() public view override returns (address) {
        return address(_oracleInstance);
    }

    /**
     * @notice Sets the address of the price oracle
     * @param oracleAddr_ The address of the price oracle
     */
    function setOracleAddr(
        address oracleAddr_
    ) public override onlyRole(TREASURY_ADMIN_ROLE) {
        require(
            oracleAddr_ != address(0),
            Errors.ZERO_ORACLE_ADDRESS_NOT_VALID
        );
        _oracleInstance = ITokenOracle(oracleAddr_);
    }

    /**
     * @notice Returns address of the token
     * @return The address of the token
     */
    function getTokenAddr() public view override returns (address) {
        return address(_tokenInstance);
    }

    /**
     * @notice Sets the address of the token
     * @param tokenAddr_ The address of the token
     */
    function setTokenAddr(
        address tokenAddr_
    ) public override onlyRole(TREASURY_ADMIN_ROLE) {
        require(tokenAddr_ != address(0), Errors.ZERO_ASSET_ADDRESS_NOT_VALID);
        _tokenInstance = FERC20(tokenAddr_);
    }

    /**
     * @notice Pauses the token.
     */
    function pause() public onlyRole(TREASURY_ADMIN_ROLE) {
        _paused = true;
    }

    /**
     * @notice Unpauses the token.
     */
    function unpause() public onlyRole(TREASURY_ADMIN_ROLE) {
        _paused = false;
    }

    /**
     * @notice Returns true if treasury is paused or false otherwise.
     * @return 
     */
    function isPaused() public view returns (bool) {
        return _paused;
    }

    /**
     * @notice Mints a certain amount of tokens
     * @param reciepientAddr_ The addresses of the asset
     */
    function mint(
        address reciepientAddr_
    ) public payable virtual override nonReentrant {
        require(msg.value > 0, Errors.ZERO_ASSET_AMOUNT_NOT_VALID);
        require(
            reciepientAddr_ != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );
        require(
            _tokenInstance.balanceOf(address(this)) >= msg.value,
            Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE
        );
        // Get price of asset
        uint256 price = _oracleInstance.getPrice();
        require(price > 0, Errors.ZERO_ASSET_PRICE_NOT_VALID);

        uint256 mintValue = msg.value.div(price);
        require(mintValue > 0, Errors.INSUFFICIENT_MINT_FUNDS);

        _mint(reciepientAddr_, mintValue);

        emit Mint(msg.sender, reciepientAddr_, mintValue);
    }

    /**
     * @notice Burns a certain amount of the token
     * @param amount_ The amount of the asset to burn
     */
    function burn(
        uint256 amount_
    ) external virtual override onlyRole(TREASURY_ADMIN_ROLE) nonReentrant {
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

    /**
     * @notice Disburse Ether to receipients
     * @param recieptients_ The addresses of the reciepients
     * @param amounts_ The amounts for each reciepient
     */
    function disburse(
        address[] calldata recieptients_,
        uint256[] calldata amounts_
    ) public virtual override onlyRole(TREASURY_ADMIN_ROLE) nonReentrant {
        require(
            recieptients_.length == amounts_.length,
            Errors.INCONSISTENT_PARAMS_LENGTH
        );
        for (uint256 i = 0; i < recieptients_.length; i++) {
            _disburse(recieptients_[i], amounts_[i]);
            emit Disburse(msg.sender, recieptients_[i], amounts_[i]);
        }
    }

    function _mint(address reciepientAddr_, uint256 amount_) internal virtual {
        // Transfer tokens to vault
        _tokenInstance.transfer(reciepientAddr_, amount_);
    }

    function _burn(uint256 amount_) internal virtual {
        _tokenInstance.burn(amount_);
    }

    function _disburse(
        address recieptient_,
        uint256 amount_
    ) internal virtual {
        require(amount_ > 0, Errors.ZERO_ASSET_AMOUNT_NOT_VALID);
        require(address(this).balance > amount_, Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE);
        require(
            recieptient_ != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );
        (bool success, ) = recieptient_.call{value: amount_}("");
        require(success, Errors.TRANSFER_FUNDS_TO_VAULT_FAILURE);
    }
}
