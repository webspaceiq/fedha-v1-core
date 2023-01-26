// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
import "@chainlink/contracts/src/v0.7/Operator.sol";

contract ChainlinkOperator is Operator {

    /**
     * @notice Deploy with the address of the LINK token
     * @dev Sets the LinkToken address for the imported LinkTokenInterface
     * @param link The address of the LINK token
     * @param owner The address of the owner
     */
    constructor(address link, address owner) Operator(link, owner) {}
}
