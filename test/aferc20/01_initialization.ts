import { expect } from "chai";
import { Fixtures } from "./Fixtures";
import { deployments, ethers } from "hardhat";
import { ConfigUtil } from "../../src/utilities/config";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { MARKET_NAME, ConfigNames } from "../../src/helpers/env";
import { EMPTY_STRING, FAKE_ADDRESS, ZERO_ADDRESS } from "../../src/helpers/constants";

describe("AFERC20 Initialization", function () {
    it("Should revert when token name is empty", async function () {
        const fixture = deployments.createFixture(
            Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_TOKEN_ID,
                    tokenName: EMPTY_STRING,
                    tokenSymbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL,
                    oracleAddr: ethers.utils.getAddress(FAKE_ADDRESS), 
                    tokenAddr: ethers.utils.getAddress(FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.revertedWith('207');
    });

    it("Should revert when token symbol is empty", async function () {
        const fixture = deployments.createFixture(
            Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_TOKEN_ID,
                    tokenName: DEPLOY_IDS.TEST_TOKEN_NAME,
                    tokenSymbol: EMPTY_STRING,
                    oracleAddr: ethers.utils.getAddress(FAKE_ADDRESS), 
                    tokenAddr: ethers.utils.getAddress(FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.revertedWith('208');
    });

    it("Should revert when oracle address is empty", async function () {
        const fixture = deployments.createFixture(
            Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_TOKEN_ID,
                    tokenName: DEPLOY_IDS.TEST_TOKEN_NAME,
                    tokenSymbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL,
                    oracleAddr: ethers.utils.getAddress(ZERO_ADDRESS), 
                    tokenAddr: ethers.utils.getAddress(FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.revertedWith('17');
    });

    it("Should revert when asset address is empty", async function () {
        const fixture = deployments.createFixture(
            Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_TOKEN_ID,
                    tokenName: DEPLOY_IDS.TEST_TOKEN_NAME,
                    tokenSymbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL,
                    oracleAddr: ethers.utils.getAddress(FAKE_ADDRESS), 
                    tokenAddr: ethers.utils.getAddress(ZERO_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.revertedWith('16');
    });

    it("Should not revert ", async function () {
        const fixture = deployments.createFixture(
            Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_TOKEN_ID,
                    tokenName: DEPLOY_IDS.TEST_TOKEN_NAME,
                    tokenSymbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL,
                    oracleAddr: ethers.utils.getAddress(FAKE_ADDRESS), 
                    tokenAddr: ethers.utils.getAddress(FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.not.be.rejectedWith(Error);
    });
});