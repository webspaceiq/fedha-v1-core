import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Contract } from "ethers";
import * as CONSTANTS from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";

describe("Chainlink TokenOracle Interfaces", function () {
    beforeEach(async () => {
        await deployments.fixture(['testChainlinkTokenOracles']);
    });

    describe("HttpOperatorClientBase", function () {
        describe("HTTP URL", function () {
            it("Should return HTTP endpoint URL", async function () {
                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                expect(await oracleInstance.getHttpUrl()).to.equal(CONSTANTS.FAKE_BYTES);
            });

            it("Should update the HTTP endpoint URL", async function () {
                const httpURL = "http://api.fedhabank.com/v1/market/feed/";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await oracleInstance.setHttpUrl(httpURL);

                expect(await oracleInstance.getHttpUrl()).to.equal(httpURL);
            });

            it("Should allow only oracleInstance admin to update HTTP endpoint URL", async function () {
                const [deployer, notDeployer] = await ethers.getSigners();
                const httpURL = "http://api.fedhabank.com/v1/market/feed/";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(oracleInstance.connect(notDeployer).setHttpUrl(httpURL)).to.be.rejectedWith(Error)
            });

            it("Should fail to update HTTP endpoint URL given empty URL string", async function () {
                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(oracleInstance.setHttpUrl(CONSTANTS.EMPTY_STRING)).to.be.rejectedWith(Error)
            });

            it("Should emit HttpUrlUpdated event", async function () {
                const httpURL = "http://api.fedhabank.com/v1/market/feed/";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(
                    oracleInstance.setHttpUrl(httpURL)
                ).to.emit(oracleInstance, "HttpUrlUpdated");
            });
        });

        describe("Job ID", function () {
            it("Should return the job id ", async function () {
                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                expect(await oracleInstance.getJobId()).to.equal(CONSTANTS.FAKE_BYTES);
            });

            it("Should update the job id", async function () {
                const jobID = "0xe522b22b71dcfa4572fd8962b8d8a134ebde84a0375d141792302e05e5cedd66";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await oracleInstance.setJobId(jobID);

                expect(await oracleInstance.getJobId()).to.equal(jobID);
            });

            it("Should allow only oracleInstance admin to update job id", async function () {
                const [deployer, notDeployer] = await ethers.getSigners();
                const jobID = "0xe522b22b71dcfa4572fd8962b8d8a134ebde84a0375d141792302e05e5cedd66";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(oracleInstance.connect(notDeployer).setJobId(jobID)).to.be.rejectedWith(Error)
            });

            it("Should fail to update job id given empty string", async function () {
                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(oracleInstance.setJobId(CONSTANTS.EMPTY_STRING)).to.be.rejectedWith(Error)
            });

            it("Should emit JobIdUpdated event", async function () {
                const jobID = "0xe522b22b71dcfa4572fd8962b8d8a134ebde84a0375d141792302e05e5cedd66";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(
                    oracleInstance.setJobId(jobID)
                ).to.emit(oracleInstance, "JobIdUpdated");
            });
        });

        describe("Operator Address", function () {
            it("Should return address of operator contract ", async function () {
                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                const { address } = await DeployHelper
                    .getDeployedChainlinkMockOracle(
                        `${DEPLOY_IDS.TEST_PRICE_ORACLE_ID}${DEPLOY_IDS.PRICE_ORACLE_OPERATOR_ID_SUFFIX}`);

                expect(await oracleInstance.getOperatorAddress()).to.equal(address);
            });

            it("Should update the address of operator contract ", async function () {
                const { utils } = ethers;
                const address = "0x9A676e781A523b5d0C0e43731313A708CB607508";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await oracleInstance.setOperatorAddress(utils.getAddress(address));

                expect(await oracleInstance.getOperatorAddress()).to.equal(address);
            });

            it("Should allow only oracleInstance admin to update address of operator contract", async function () {
                const address = "0x9A676e781A523b5d0C0e43731313A708CB607508";

                const [deployer, notDeployer] = await ethers.getSigners();

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(
                    oracleInstance.connect(notDeployer).setOperatorAddress(address)
                ).to.be.rejectedWith(Error);
            });

            it("Should fail to update operator contract address given zero address", async function () {
                const { utils } = ethers;
                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(
                    oracleInstance.setOperatorAddress(utils.getAddress(CONSTANTS.ZERO_ADDRESS))
                ).to.be.rejectedWith(Error);
            });

            it("Should emit OperatorAddressUpdated event", async function () {
                const { utils } = ethers;
                const address = "0x9A676e781A523b5d0C0e43731313A708CB607508";

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await expect(oracleInstance.setOperatorAddress(utils.getAddress(address)))
                    .to.emit(oracleInstance, "OperatorAddressUpdated");
            });
        });

        describe("Link Token", function () {
            it("Should also return address of link token ", async function () {
                const linkTokenInstance = await DeployHelper
                    .getDeployedERC20Token(DEPLOY_IDS.TEST_LINK_TOKEN_ID);

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                expect(await oracleInstance.getChainlinkToken()).to.equal(linkTokenInstance.address);
            });

            it("Should withdraw link token ", async function () {
                const [deployer, notDeployer] = await ethers.getSigners();

                const linkTokenInstance = await DeployHelper
                    .getDeployedERC20Token(DEPLOY_IDS.TEST_LINK_TOKEN_ID);

                const oracleInstance = await DeployHelper
                    .getDeployedTokenOracle(DEPLOY_IDS.TEST_PRICE_ORACLE_ID) as Contract;

                await linkTokenInstance.transfer(oracleInstance.address, "1000000000000000000")

                const mockOracleInstance = await DeployHelper
                    .getDeployedChainlinkMockOracle(
                        `${DEPLOY_IDS.TEST_PRICE_ORACLE_ID}${DEPLOY_IDS.PRICE_ORACLE_OPERATOR_ID_SUFFIX}`);

                const oldBalance = await linkTokenInstance.balanceOf(deployer.address);
                const transaction = await oracleInstance.requestData();

                const transactionReceipt = await transaction.wait(1)

                const requestId = transactionReceipt.events[0].topics[1];
                const callbackValue = ethers.utils.hexZeroPad(ethers.utils.hexlify(777), 32);

                await mockOracleInstance.fulfillOracleRequest(requestId, callbackValue);

                await oracleInstance.withdrawLink();

                const newBalance = await linkTokenInstance.balanceOf(deployer.address);

                expect(newBalance).to.not.equal(oldBalance);
            });
        });
    });
});