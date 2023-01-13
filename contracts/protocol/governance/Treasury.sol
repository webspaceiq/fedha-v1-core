// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../interfaces/ITreasury.sol";

contract Treasury is ITreasury {

    constructor(address tokenAddr_, address oracleAddr_){

    }
    
    function mint(
        address recieptient_,
        uint256 amount_
    ) external payable override {}

    function burn(uint256 amount_) external override {}

    function disburse(
        address[] calldata recieptients_,
        uint256[] calldata amounts_
    ) external override {}

    function getOracleAddr() external override returns (address) {}

    function setOracleAddr(address oracleAddr_) external override {}

    function getTokenAddr() external override returns (address) {}

    function setTokenAddr(address tokenAddr_) external override {}
}
