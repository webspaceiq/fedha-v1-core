import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import * as CONSTANTS from "../../src/helpers/constants";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { MARKET_NAME, ConfigNames } from "../../src/helpers/env";
import { ConfigUtil } from "../../src/utilities/config";
import { Fixtures } from "./Fixtures";

describe("Treasury Initialization", function () {
    it("Should revert when token address is zero", async function () {
        it("Should revert when token name is empty", async function () {
            const [deployer] = await ethers.getSigners();
            const fixture = deployments.createFixture(Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID,
                    type: CONSTANTS.TREASURY_TYPE_TRANSFER,
                    deployer: deployer.address,
                    tokenAddr: ethers.utils.getAddress(CONSTANTS.ZERO_ADDRESS),
                    oracleAddr: ethers.utils.getAddress(CONSTANTS.FAKE_ADDRESS),
                    vaultAddr: ethers.utils.getAddress(CONSTANTS.FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            ));
            await expect(fixture()).to.be.revertedWith('207');
        });
    });
    
    it("Should revert when oracle address is zero", async function () {
        const [deployer] = await ethers.getSigners();
        const fixture = deployments.createFixture(Fixtures.fixture({
            id: DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID,
            type: CONSTANTS.TREASURY_TYPE_TRANSFER,
            deployer: deployer.address,
            tokenAddr: ethers.utils.getAddress(CONSTANTS.FAKE_ADDRESS),
            oracleAddr: ethers.utils.getAddress(CONSTANTS.ZERO_ADDRESS),
            vaultAddr: ethers.utils.getAddress(CONSTANTS.FAKE_ADDRESS),
            configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
        }));
        await expect(fixture()).to.be.revertedWith('17');
       
    });
});