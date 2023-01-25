import { Contract } from "ethers";
import { assert, expect } from "chai";
import { deployments, ethers } from "hardhat";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { HelperFunctions } from "../../src/utilities/helper-functions";


describe("TokenOracle Events", function () {
    beforeEach(async () => {
        await deployments.fixture(['testChainlinkTokenOracles']);
    });
    
    it("Should successfully make an API call", async function () {
        const [deployer] = await ethers.getSigners();

        const linkTokenInstance = await DeployHelper
            .getDeployedERC20Token(DEPLOY_IDS.TEST_LINK_TOKEN_ID);

        const oracleInstance = await DeployHelper
            .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

        await linkTokenInstance.transfer(oracleInstance.address, "1000000000000000000");

        const transaction = await oracleInstance.requestData();
        const transactionReceipt = await transaction.wait(1);

        const requestId = transactionReceipt.events[0].topics[1];

        expect(requestId).to.not.be.null;
    });

    it("Should successfully make an API request and get a result", async function () {
        const linkTokenInstance = await DeployHelper
            .getDeployedERC20Token(DEPLOY_IDS.TEST_LINK_TOKEN_ID);

        const oracleInstance = await DeployHelper
            .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

        await linkTokenInstance.transfer(oracleInstance.address, "1000000000000000000");

        const mockOracleInstance = await DeployHelper
            .getDeployedChainlinkMockOracle(
                `${DEPLOY_IDS.TEST_PRICE_ORACLE_ID}${DEPLOY_IDS.PRICE_ORACLE_OPERATOR_ID_SUFFIX}`);

        const transaction = await oracleInstance.requestData();
        const transactionReceipt = await transaction.wait(1);

        const callbackValue = 777;
        const requestId = transactionReceipt.events[0].topics[1];

        await mockOracleInstance
            .fulfillOracleRequest(
                requestId, HelperFunctions.numToBytes32(callbackValue));

        const volume = await oracleInstance._currentPrice();

        assert.equal(volume.toString(), callbackValue.toString())
    });

    it("Should emit an event on request fulfillment", async function () {
        const linkTokenInstance = await DeployHelper
            .getDeployedERC20Token(DEPLOY_IDS.TEST_LINK_TOKEN_ID);

        const oracleInstance = await DeployHelper
            .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

        await linkTokenInstance.transfer(oracleInstance.address, "1000000000000000000");

        const mockOracleInstance = await DeployHelper
            .getDeployedChainlinkMockOracle(
                `${DEPLOY_IDS.TEST_PRICE_ORACLE_ID}${DEPLOY_IDS.PRICE_ORACLE_OPERATOR_ID_SUFFIX}`);

        const transaction = await oracleInstance.requestData();
        const transactionReceipt = await transaction.wait(1);

        const callbackValue = 777;
        const requestId = transactionReceipt.events[0].topics[1];

        await expect(
            mockOracleInstance.fulfillOracleRequest(
                requestId, HelperFunctions.numToBytes32(callbackValue))
            ).to.emit(oracleInstance, "RequestFulfilled");
    });
});