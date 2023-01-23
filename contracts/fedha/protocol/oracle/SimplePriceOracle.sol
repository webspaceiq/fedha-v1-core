// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../interfaces/IPriceOracle.sol";

contract SimplePriceOracle is IPriceOracle {
    uint256 internal _price;
    
    constructor(uint256 price_) {
        _price = price_;
    }

    function getPrice() external view override returns (uint256) {
        return _price;
    }

    function setPrice(uint256 price_) external {
        _price = price_;
    }
}