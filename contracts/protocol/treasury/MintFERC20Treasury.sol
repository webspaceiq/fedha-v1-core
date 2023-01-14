// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Treasury.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MintFERC20Treasury is Treasury {
    using SafeMath for uint256;

    constructor(address tokenAddr_, address oracleAddr_) Treasury(tokenAddr_, oracleAddr_) {
    }

    /**
     * @notice Mints a certain amount of tokens
     * @param reciepientAddr_ The addresses of the asset
     */
    function mint(
        address reciepientAddr_
    ) public payable override nonReentrant {
        require(msg.value > 0, Errors.ZERO_ASSET_AMOUNT_NOT_VALID);
        require(
            reciepientAddr_ != address(0),
            Errors.ZERO_BENEFICIARY_ADDRESS_NOT_VALID
        );

        // Get price of asset
        uint256 price = _oracleInstance.getPrice();
        require(price > 0, Errors.ZERO_ASSET_PRICE_NOT_VALID);

        uint256 mintValue = msg.value.div(price);
        require(mintValue > 0, Errors.INSUFFICIENT_MINT_FUNDS);

        _tokenInstance.mint(reciepientAddr_, mintValue);

        emit Mint(msg.sender, reciepientAddr_, mintValue);
    }

    function _burn(uint256 amount_) internal override {
    }
}