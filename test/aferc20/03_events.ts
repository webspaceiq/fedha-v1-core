import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Fixtures } from "./Fixtures";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { AFERC20 } from "../../typechain";

describe("AFERC20 Events", function () {
    beforeEach(async () => {
        await deployments.fixture(['test']);
    });

    describe("Mint", function () {
        it("Should emit Mint event", async function () {
            const mintTokenAmount = ethers.utils.parseEther("5");
            const assetAmountToMint = ethers.utils.parseEther("10");
            const [deployer, notDeployer] = await ethers.getSigners();
            const assetInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_ASSET_ID);
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_ID) as AFERC20;

            // Funding and preapproval
            await assetInstance.mint(deployer.address, assetAmountToMint);
            await assetInstance.connect(deployer).approve(tokenInstance.address, assetAmountToMint);
            // Main function we are testing
            await tokenInstance.connect(deployer).mintToken(notDeployer.address, mintTokenAmount, {});

            await expect(
                tokenInstance.connect(deployer).mintToken(notDeployer.address, mintTokenAmount, {})
            ).to.emit(tokenInstance, "Mint");
        });
    });

    describe("Burn", function () {
        it("Should emit Burn event", async function () {
            const { BigNumber, utils } = ethers;
            const mintTokenAmount = utils.parseEther("5");
            const assetAmountToMint = utils.parseEther("10");

            const [deployer, notDeployer] = await ethers.getSigners();
            const assetInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_ASSET_ID);
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_ID) as AFERC20;
            const oracleInstance = await DeployHelper.getDeployedPriceOracle(`${DEPLOY_IDS.TEST_TOKEN_ID}PriceOracle`);

            // Funding and preapproval
            await assetInstance.mint(deployer.address, assetAmountToMint);
            await assetInstance.connect(deployer).approve(tokenInstance.address, assetAmountToMint);
            // Main function we are testing
            await tokenInstance.connect(deployer).mintToken(notDeployer.address, mintTokenAmount, {});
            // Get token and asset balances after mintToken ops
            const assetPrice = await oracleInstance.getPrice();
            const actualTokenBalance = await tokenInstance.balanceOf(notDeployer.address);
            // Main function we are testing
            await expect(
                tokenInstance.connect(notDeployer).burn(actualTokenBalance, {})
            ).to.emit(tokenInstance, "Burn");
        });
    });
});