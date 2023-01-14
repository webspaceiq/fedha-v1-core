// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Treasury.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TransferFromFERC20Treasury is Treasury {
    using SafeMath for uint256;

    address internal _vaultAddr;

    constructor(
        address tokenAddr_,
        address oracleAddr_,
        address vaultAddr_
    ) Treasury(tokenAddr_, oracleAddr_) {
        require(vaultAddr_ != address(0), Errors.ZERO_VAULT_ADDRESS_NOT_VALID);
        _vaultAddr = vaultAddr_;
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
            _tokenInstance.balanceOf(_vaultAddr) >= msg.value,
            Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE
        );
        // Get price of asset
        uint256 price = _oracleInstance.getPrice();
        require(price > 0, Errors.ZERO_ASSET_PRICE_NOT_VALID);

        uint256 mintValue = msg.value.div(price);
        require(mintValue > 0, Errors.INSUFFICIENT_MINT_FUNDS);

        _tokenInstance.transferFrom(_vaultAddr, reciepientAddr_, mintValue);

        emit Mint(msg.sender, reciepientAddr_, mintValue);
    }

    function _burn(uint256 amount_) internal override {}
}
