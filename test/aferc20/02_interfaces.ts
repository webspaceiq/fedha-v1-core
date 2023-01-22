import { expect } from "chai";
import { AFERC20 } from "../../typechain";
import { deployments, ethers } from "hardhat";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { EMPTY_STRING, ZERO, ZERO_ADDRESS } from "../../src/helpers/constants";
import { TEST_ASSET_ID, TEST_TOKEN_ID } from "../../src/helpers/deploy-ids";

describe("AFERC20 Interfaces", function () {
    beforeEach(async () => {
        await deployments.fixture(['test']);
    });

    describe("Receive", function () {
        it("Should revert when receive function is called", async function () {
            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID);

            const to = tokenInstance.address;
            const value = ethers.utils.parseEther("1");
            await expect(
                deployer.sendTransaction({ from: deployer.address, to, value })
            ).to.be.revertedWith("14");
        });
    });

    describe("Fallback", function () {
        it("Should revert when fallback function is called", async function () {
            const { utils } = ethers;
            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID);

            const to = tokenInstance.address;
            const value = ethers.utils.parseEther("1");
            const data = utils.formatBytes32String(EMPTY_STRING);

            await expect(
                deployer.sendTransaction({ from: deployer.address, to, value, data })
            ).to.be.revertedWith("14");
        });
    });

    describe("Mint", function () {

        it("Should revert when beneficiary address is zero", async function () {
            const { utils } = ethers;
            const amount = utils.parseEther("1");
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID) as AFERC20;

            await expect(
                tokenInstance.mintToken(utils.getAddress(ZERO_ADDRESS), amount, {})
            ).to.be.revertedWith('206');
        });

        it("Should revert when mint amount is zero", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(ZERO);
            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID) as AFERC20;

            await expect(
                tokenInstance.mintToken(notDeployer.address, amount, {})
            ).to.be.revertedWith('116');
        });

        it("Should revert when sender AFERC20 has insufficient allowance to transfer asset of message sender", async function () {
            const { utils } = ethers;
            const amount = utils.parseEther("5");
            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID) as AFERC20;

            await expect(
                tokenInstance.mintToken(notDeployer.address, amount, {})
            ).to.be.revertedWith("8");
        });

        it("Should mint the specified amount of AFERC20 tokens", async function () {
            const { BigNumber, utils } = ethers;
            const mintTokenAmount = utils.parseEther("5");
            const assetAmountToMint = utils.parseEther("10");
            const [deployer, notDeployer] = await ethers.getSigners();

            const assetInstance = await DeployHelper.getDeployedERC20Token(TEST_ASSET_ID);
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID) as AFERC20;
            const oracleInstance = await DeployHelper.getDeployedPriceOracle(`${TEST_TOKEN_ID}PriceOracle`);

            const initialTokenBalance = await tokenInstance.balanceOf(notDeployer.address);
            // Funding and preapproval
            await assetInstance.mint(deployer.address, assetAmountToMint);
            await assetInstance.connect(deployer).approve(tokenInstance.address, assetAmountToMint);
            // Main function we are testing
            await tokenInstance.connect(deployer).mintToken(notDeployer.address, mintTokenAmount, {});
            // Get token and asset balances after mintToken ops
            const actualTokenBalance = await tokenInstance.balanceOf(notDeployer.address);
            const actualAssetBalance = await assetInstance.balanceOf(tokenInstance.address);
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
            const { BigNumber } = ethers;
            const amount = BigNumber.from(ZERO);
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID);

            await expect(tokenInstance.burn(amount, {})).to.be.revertedWith("117");
        });

        it("Should revert when caller has insufficient token balance", async function () {
            const { utils } = ethers;
            const burnTokenAmount = utils.parseEther("5");
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID);

            await expect(tokenInstance.burn(burnTokenAmount, {})).to.be.revertedWith("8");
        });

        it("Should revert when burning contract has insufficient asset balance", async function () {
            const { utils } = ethers;
            const mintTokenAmount = utils.parseEther("5");
            const burnTokenAmount = utils.parseEther("400");
            const assetAmountToMint = utils.parseEther("10");
            const extraTokenMintAmount = utils.parseEther("500");

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID) as AFERC20;
            const assetInstance = await DeployHelper.getDeployedERC20Token(TEST_ASSET_ID);

            // Funding and preapproval
            await assetInstance.mint(deployer.address, assetAmountToMint);
            await assetInstance.connect(deployer).approve(tokenInstance.address, assetAmountToMint);
            // Create a situation that an account has more token that there is in the vault
            await tokenInstance.mint(notDeployer.address, extraTokenMintAmount, {});
            await tokenInstance.connect(deployer).mintToken(notDeployer.address, mintTokenAmount, {});
            // Main function we are testing
            await expect(tokenInstance.connect(notDeployer).burn(burnTokenAmount, {})).to.be.revertedWith("201");
        });

        it("Should burn the specified amount of AFERC20 tokens", async function () {
            const { BigNumber, utils } = ethers;
            const mintTokenAmount = utils.parseEther("5");
            const assetAmountToMint = utils.parseEther("10");

            const [deployer, notDeployer] = await ethers.getSigners();
            const assetInstance = await DeployHelper.getDeployedERC20Token(TEST_ASSET_ID);
            const tokenInstance = await DeployHelper.getDeployedERC20Token(TEST_TOKEN_ID) as AFERC20;
            const oracleInstance = await DeployHelper.getDeployedPriceOracle(`${TEST_TOKEN_ID}PriceOracle`);

            // Funding and preapproval
            await assetInstance.mint(deployer.address, assetAmountToMint);
            await assetInstance.connect(deployer).approve(tokenInstance.address, assetAmountToMint);
            // Main function we are testing
            await tokenInstance.connect(deployer).mintToken(notDeployer.address, mintTokenAmount, {});
            // Get token and asset balances after mintToken ops
            const assetPrice = await oracleInstance.getPrice();
            const actualTokenBalance = await tokenInstance.balanceOf(notDeployer.address);
            // Main function we are testing
            await tokenInstance.connect(notDeployer).burn(actualTokenBalance, {});

            const expectedAssetBalance = actualTokenBalance.mul(assetPrice);
            const finalAssetBalance = await assetInstance.balanceOf(notDeployer.address);
            const finalTokenBalance = await tokenInstance.balanceOf(notDeployer.address);

            expect(finalTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedAssetBalance).to.equal(finalAssetBalance);
        });
    });
});