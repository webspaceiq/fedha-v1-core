// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ChainlinkOracle.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import {IPriceOracleGetter} from "@aave/core-v3/contracts/interfaces/IPriceOracleGetter.sol";

contract PriceOracle is ChainlinkOracle {
    using Strings for string;
    using Chainlink for Chainlink.Request;

    uint256 public _currentPrice;

    uint256 private _oraclePayment;
    string _httpUrl;

    event HttpUrlUpdated(string indexed newValue, address indexed editedBy);

    constructor(
        string memory httpUrl_,
        string memory jobId_,
        address operatorAddr_,
        address linkTokenAddres_
    ) ChainlinkOracle(jobId_, operatorAddr_, linkTokenAddres_) {
        require(bytes(httpUrl_).length != 0, "Invalid http url");
        _httpUrl = httpUrl_;
    }

    function getHttpUrl() external view returns (string memory) {
        return _httpUrl;
    }

    function setHttpUrl(
        string memory httpUrl_
    ) external onlyRole(ORACLE_ADMIN) {
        require(bytes(httpUrl_).length != 0, "Invalid http url");
        _httpUrl = httpUrl_;
        emit HttpUrlUpdated(httpUrl_, msg.sender);
    }

    function _requestData(
        Chainlink.Request memory request
    ) internal view override returns (Chainlink.Request memory) {
        request.add("get", _httpUrl);
        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10 ** 18;
        request.addInt("times", timesAmount);
        return request;
    }

    function _fulfillRequest(bytes32 responseData) internal override {
        _currentPrice = uint256(responseData);
    }
}
