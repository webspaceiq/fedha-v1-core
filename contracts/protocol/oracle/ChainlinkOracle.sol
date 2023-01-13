// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ChainlinkOracle is ChainlinkClient, AccessControl {
    string internal _jobId;
    address internal _operatorAddr;
    address internal _linkTokenAddress;
    uint256 private _oraclePayment;

    // Create a new role identifier for the minter role
    bytes32 public constant ORACLE_ADMIN = keccak256("ORACLE_ADMIN");

    event JobIdUpdated(string indexed newValue, address indexed editedBy);

    event OperatorAddressUpdated(
        address indexed newAddr,
        address indexed editedBy
    );

    event RequestFulfilled(
        bytes32 indexed requestId,
        bytes32 indexed responseData
    );

    constructor(
        string memory jobId_,
        address operatorAddr_,
        address linkTokenAddres_
    ) {
        require(bytes(jobId_).length != 0, "Invalid job id");
        require(operatorAddr_ != address(0x0), "Invalid operator address");
        require(linkTokenAddres_ != address(0x0), "Invalid link token address");

        _jobId = jobId_;
        _operatorAddr = operatorAddr_;
        _linkTokenAddress = linkTokenAddres_;

        setChainlinkToken(_linkTokenAddress);
        _oraclePayment = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18

        // Grant the minter role to a specified account
        _grantRole(ORACLE_ADMIN, msg.sender);
    }

    function getJobId() external view returns (string memory) {
        return _jobId;
    }

    function setJobId(string memory jobId_) external onlyRole(ORACLE_ADMIN) {
        require(bytes(jobId_).length != 0, "Invalid job id");
        _jobId = jobId_;
        emit JobIdUpdated(jobId_, msg.sender);
    }

    function getOperatorAddress() external view returns (address) {
        return _operatorAddr;
    }

    function setOperatorAddress(
        address operatorAddr_
    ) external onlyRole(ORACLE_ADMIN) {
        require(
            operatorAddr_ != address(0x0),
            "Invalid operator contract address"
        );
        _operatorAddr = operatorAddr_;
        emit OperatorAddressUpdated(operatorAddr_, msg.sender);
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    /**
     * @notice Initiates an request to the oracle operator contract.
     * The type of the request is HTTP GET
     */
    function requestData()
        public
        onlyRole(ORACLE_ADMIN)
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(
            bytes32(abi.encodePacked(_jobId)),
            address(this),
            this.fulfillRequest.selector
        );

        request = _requestData(request);

        requestId = sendChainlinkRequestTo(
            _operatorAddr,
            request,
            _oraclePayment
        );
    }

    function _requestData(
        Chainlink.Request memory request
    ) internal virtual returns (Chainlink.Request memory) {}

    /**
     * @notice Request fulfillment callback function.
     * This is called by the operator contract
     * @param _requestId The id of the request
     * @param responseData The the response
     */
    function fulfillRequest(
        bytes32 _requestId,
        bytes32 responseData
    ) public recordChainlinkFulfillment(_requestId) {
        _fulfillRequest(responseData);
        emit RequestFulfilled(_requestId, responseData);
    }

    function _fulfillRequest(bytes32 responseData) internal virtual {}

    function withdrawLink() public onlyRole(ORACLE_ADMIN) {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyRole(ORACLE_ADMIN) {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }
}
