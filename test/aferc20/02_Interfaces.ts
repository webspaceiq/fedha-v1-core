import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Fixtures } from "./Fixtures";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { EMPTY_STRING, ZERO, ZERO_ADDRESS } from "../../src/helpers/constants";

describe("AFERC20 Interfaces", function () {
    describe("Receive", function () {
        it("Should revert when receive function is called", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { treasuryAdmin, assetTokenInstance } = await fixture();
            const [owner] = await ethers.getSigners();

            const to = assetTokenInstance.address;
            const value = ethers.utils.parseEther("1");

            // not defining `data` field will use the default value - empty data
            await expect(
                owner.sendTransaction({ from: treasuryAdmin, to, value }))
                .to.be.revertedWith("14");
        });
    });

    describe("Fallback", function () {
        it("Should revert when fallback function is called", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { treasuryAdmin, assetTokenInstance } = await fixture();

            const { utils } = ethers;
            const [owner] = await ethers.getSigners();

            const to = assetTokenInstance.address;
            const value = ethers.utils.parseEther("1");
            const data = utils.formatBytes32String(EMPTY_STRING);

            await expect(
                owner.sendTransaction({ from: treasuryAdmin, to, value, data }))
                .to.be.revertedWith("14");
        });
    });

    describe("Mint", function () {

        it("Should revert when beneficiary address is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { assetTokenInstance } = await fixture();
            const { utils } = ethers;
            const amount = utils.parseEther("1");

            await expect(
                assetTokenInstance.mintToken(utils.getAddress(ZERO_ADDRESS), amount, {}))
                .to.be.revertedWith('206');
        });

        it("Should revert when mint amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { other, assetTokenInstance } = await fixture();

            const { BigNumber } = ethers;
            const amount = BigNumber.from(ZERO);

            await expect(assetTokenInstance.mintToken(other, amount, {})).to.be.revertedWith('116');
        });

        it("Should revert when sender AFERC20 has insufficient allowance to transfer asset of message sender", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { other, assetTokenInstance } = await fixture();

            const { utils } = ethers;
            const amount = utils.parseEther("5");

            await expect(
                assetTokenInstance.mintToken(other, amount, {}))
                .to.be.revertedWith("8");
        });

        it("Should mint the specified amount of AFERC20 tokens", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { other, assetInstance, assetTokenInstance, oracleInstance, treasuryAdmin } = await fixture();

            const { BigNumber, utils } = ethers;
            const [owner] = await ethers.getSigners();
            const mintTokenAmount = utils.parseEther("5");
            const assetAmountToMint = utils.parseEther("10");

            const initialTokenBalance = await assetTokenInstance.balanceOf(other);
            // Funding and preapproval
            await assetInstance.mint(treasuryAdmin, assetAmountToMint);
            await assetInstance.connect(owner).approve(assetTokenInstance.address, assetAmountToMint);
            // Main function we are testing
            await assetTokenInstance.connect(owner).mintToken(other, mintTokenAmount, {});
            // Get token and asset balances after mintToken ops
            const actualTokenBalance = await assetTokenInstance.balanceOf(other);
            const actualAssetBalance = await assetInstance.balanceOf(assetTokenInstance.address);
            // Compute expected balances
            const assetPrice = await oracleInstance.getPrice();
            const expectedTokenBalance = mintTokenAmount.div(assetPrice);
            const expectedAssetBalance = mintTokenAmount;
            // Verify results
            expect(initialTokenBalance).to.equal(BigNumber.from(0));
            expect(actualAssetBalance).to.equal(expectedAssetBalance);
            expect(actualTokenBalance).to.equal(expectedTokenBalance);
        });
    });

    describe("Burn", function () {
        it("Should revert when burn amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { assetTokenInstance } = await fixture();

            const { BigNumber } = ethers;
            const amount = BigNumber.from(ZERO);

            await expect(assetTokenInstance.burn(amount, {})).to.be.revertedWith("117");
        });

        it("Should revert when caller has insufficient token balance", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { assetTokenInstance } = await fixture();
            const { utils } = ethers;
            const burnTokenAmount = utils.parseEther("5");

            await expect(assetTokenInstance.burn(burnTokenAmount, {})).to.be.revertedWith("8");
        });

        it("Should revert when burning contract has insufficient asset balance", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { assetInstance, assetTokenInstance, treasuryAdmin } = await fixture();

            const { utils } = ethers;
            const [owner, otherAccount] = await ethers.getSigners();
            const assetAmountToMint = utils.parseEther("10");
            const mintTokenAmount = utils.parseEther("5");
            const extraTokenMintAmount = utils.parseEther("500");
            const burnTokenAmount = utils.parseEther("400");

            // Funding and preapproval
            await assetInstance.mint(treasuryAdmin, assetAmountToMint);
            await assetInstance.connect(owner).approve(assetTokenInstance.address, assetAmountToMint);
            // Create a situation that an account has more token that there is in the vault
            await assetTokenInstance.mint(otherAccount.address, extraTokenMintAmount, {});
            await assetTokenInstance.connect(owner).mintToken(otherAccount.address, mintTokenAmount, {});
            // Main function we are testing
            await expect(assetTokenInstance.connect(otherAccount).burn(burnTokenAmount, {})).to.be.revertedWith("201");
        });

        it("Should burn the specified amount of AFERC20 tokens", async function () {
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
            await assetTokenInstance.connect(otherAccount).burn(actualTokenBalance, {});

            const expectedAssetBalance = actualTokenBalance.mul(assetPrice);
            const finalAssetBalance = await assetInstance.balanceOf(otherAccount.address);
            const finalTokenBalance = await assetTokenInstance.balanceOf(otherAccount.address);

            expect(finalTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedAssetBalance).to.equal(finalAssetBalance);
        });
    });
});