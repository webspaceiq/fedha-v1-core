// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./BaseTreasury.sol";

contract TransferFromFERC20Treasury is BaseTreasury {

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

    function _mint(address reciepientAddr_, uint256 amount_) internal override {
        // Transfer tokens to vault
        _tokenInstance.transfer(reciepientAddr_, amount_);
    }

    function _burn(uint256 amount_) internal override {
        _tokenInstance.burn(amount_);
    }

    function _disburse(
        address recieptients_,
        uint256 amounts_
    ) internal override {}
}