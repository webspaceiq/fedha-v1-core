// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IAFERC20 {
    event Mint(
        address indexed caller,
        address indexed onBehalfOf,
        uint256 value
    );

    event Burn(
        address indexed caller,
        address indexed onBehalfOf,
        uint256 value
    );

    /**
     * @notice Mints a certain amount of the specified asset
     * @param onBehalfOf_ The addresses of the asset
     * @param amount_ The amount of the asset to burn
     */
    function mintToken(address onBehalfOf_, uint256 amount_) external payable;
}
