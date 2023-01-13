import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Fixtures } from "./Fixtures";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";

describe("AFERC20 Events", function () {

    describe("Mint", function () {
        it("Should emit Mint event", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { other, assetInstance, assetTokenInstance, treasuryAdmin } = await fixture();

            const [owner] = await ethers.getSigners();
            const mintTokenAmount = ethers.utils.parseEther("5");
            const assetAmountToMint = ethers.utils.parseEther("10");
            // Funding and preapproval
            await assetInstance.mint(treasuryAdmin, assetAmountToMint);
            await assetInstance.connect(owner).approve(assetTokenInstance.address, assetAmountToMint);
            // Main function we are testing
            await assetTokenInstance.connect(owner).mintToken(other, mintTokenAmount, {});

            await expect(
                assetTokenInstance.connect(owner).mintToken(other, mintTokenAmount, {})
            ).to.emit(assetTokenInstance, "Mint");
        });
    });

    describe("Burn", function () {

        it("Should emit Burn event", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { assetInstance, assetTokenInstance, oracleInstance, treasuryAdmin } = await fixture();

            const { BigNumber, utils } = ethers;
            const [owner, otherAccount] = await ethers.getSigners();
            const mintTokenAmount = utils.parseEther("5");
            const assetAmountToMint = utils.parseEther("10");

            // Funding and preapproval
            await assetInstance.mint(treasuryAdmin, assetAmountToMint);
            await assetInstance.connect(owner).approve(assetTokenInstance.address, assetAmountToMint);
            // Main function we are testing
            await assetTokenInstance.connect(owner).mintToken(otherAccount.address, mintTokenAmount, {});
            // Get token and asset balances after mintToken ops
            const assetPrice = await oracleInstance.getPrice();
            const actualTokenBalance = await assetTokenInstance.balanceOf(otherAccount.address);
            // Main function we are testing
            await expect(
                assetTokenInstance.connect(otherAccount).burn(actualTokenBalance, {})
            ).to.emit(assetTokenInstance, "Burn");
        });
    });
});