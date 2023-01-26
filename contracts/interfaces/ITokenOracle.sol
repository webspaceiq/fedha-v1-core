// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ITokenOracle {

  /**
   * @notice Returns the asset price in the base currency
   * @return The price of the asset
   **/
  function getPrice() external view returns (uint256);
}