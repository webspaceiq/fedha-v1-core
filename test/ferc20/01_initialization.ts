import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { EMPTY_STRING } from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { Fixtures } from "./Fixtures";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { MARKET_NAME, ConfigNames } from "../../src/helpers/env";
import { ConfigUtil } from "../../src/utilities/config";

describe("FERC20 Initialization", function () {
    it("Should revert when token name is empty", async function () {
        const fixture = deployments.createFixture(
            Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_TOKEN_ID,
                    tokenName: EMPTY_STRING,
                    tokenSymbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL,
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
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.revertedWith('208');
    });

    it("Should grant default admin role to deployer", async function () {
        await deployments.fixture(['core']);

        const { utils } = ethers;
        const [deployer] = await ethers.getSigners();
        const adminRole = utils.formatBytes32String(EMPTY_STRING);

        const tokenInstance = await DeployHelper.getDeployedERC20Token("NGNC");

        expect(await tokenInstance.hasRole(adminRole, deployer.address)).to.equal(true)
    });

    it("Should grant pauser role to deployer", async function () {
        await deployments.fixture(['core']);

        const { utils } = ethers;
        const [deployer] = await ethers.getSigners();
        const pauserRole = utils.keccak256(utils.toUtf8Bytes("PAUSER_ROLE"));

        const tokenInstance = await DeployHelper.getDeployedERC20Token("NGNC");

        expect(await tokenInstance.hasRole(pauserRole, deployer.address)).to.equal(true)
    });
});