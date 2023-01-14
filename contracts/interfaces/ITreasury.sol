// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ITreasury {
    event Mint(address callerAddr, address recieptientAddr, uint256 amount);
    event Burn(address callerAddr, uint256 amount);
    event Disburse(address callerAddr, address recieptientAddr, uint256 amount);

    /**
     * @notice Mints a certain amount of tokens
     * @param recieptientAddr The addresses of the asset
     * @param amount_ The amount of the asset to burn
     */
    function mint(address recieptientAddr, uint256 amount_) external payable;

    /**
     * @notice Burns a certain amount of the token
     * @param amount_ The amount of the asset to burn
     */
    function burn(uint256 amount_) external;

    /**
     * @notice Disburse Ether to receipients
     * @param recieptients_ The addresses of the reciepients
     * @param amounts_ The amounts for each reciepient
     */
    function disburse(
        address[] calldata recieptients_,
        uint256[] calldata amounts_
    ) external;

    /**
     * @notice Returns the address of the price oracle
     * @return The address of the price oracle
     */
    function getOracleAddr() external returns (address);

    /**
     * @notice Sets the address of the price oracle
     * @param oracleAddr_ The address of the price oracle
     */
    function setOracleAddr(address oracleAddr_) external;

    /**
     * @notice Returns address of the token
     * @return The address of the token
     */
    function getTokenAddr() external returns (address);

    /**
     * @notice Sets the address of the token
     * @param tokenAddr_ The address of the token
     */
    function setTokenAddr(address tokenAddr_) external;
}
