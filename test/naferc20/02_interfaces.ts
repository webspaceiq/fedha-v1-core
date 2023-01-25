import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { EMPTY_STRING, ZERO, ZERO_ADDRESS } from "../../src/helpers/constants";
import { NAFERC20 } from "../../typechain";
import { DeployHelper } from "../../src/helpers/deploy-helper";

describe("NAFERC20 Interfaces", function () {
    beforeEach(async () => {
        await deployments.fixture(['test']);
    });
    describe("Receive", function () {
        it("Should mint tokens when Ether is sent to receive function", async function () {
            const { BigNumber, utils } = ethers;
            const value = utils.parseEther("10");

            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper
                .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

            const oracleInstance = await DeployHelper
                .getDeployedTokenOracle(
                    `${DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID}${DEPLOY_IDS.PRICE_ORACLE_ID_SUFFIX}`);

            const price = await oracleInstance.getPrice();

            const previousTokenBalance = await tokenInstance.balanceOf(deployer.address);

            await deployer.sendTransaction({
                value,
                from: deployer.address,
                to: tokenInstance.address
            });

            const actualTokenBalance = await tokenInstance.balanceOf(deployer.address);
            const expectedTokenBalance = value.div(price);

            expect(previousTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedTokenBalance).to.equal(actualTokenBalance);
        });
    });

    describe("Fallback", function () {
        it("Should mint tokens when Ether is sent to fallback function", async function () {
            const { BigNumber, utils } = ethers;
            const value = utils.parseEther("10");
            const [deployer] = await ethers.getSigners();

            const tokenInstance = await DeployHelper
                .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

            const oracleInstance = await DeployHelper
                .getDeployedTokenOracle(`${DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID}${DEPLOY_IDS.PRICE_ORACLE_ID_SUFFIX}`);

            const price = await oracleInstance.getPrice();
            const data = utils.formatBytes32String(EMPTY_STRING);

            const previousTokenBalance = await tokenInstance.balanceOf(deployer.address);

            await deployer.sendTransaction({
                value,
                data,
                from: deployer.address,
                to: tokenInstance.address,
            });

            const actualTokenBalance = await tokenInstance.balanceOf(deployer.address);
            const expectedTokenBalance = value.div(price);

            expect(previousTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedTokenBalance).to.equal(actualTokenBalance);
        });
    });

    describe("Mint", function () {
        it("Should revert when mint amount is zero", async function () {
            const { BigNumber, utils } = ethers;
            const value = utils.parseEther("0");

            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper
                .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

            await expect(
                deployer.sendTransaction({
                    value,
                    from: deployer.address,
                    to: tokenInstance.address,
                })
            ).to.be.revertedWith('116');
        });
    });

    describe("Burn", function () {
        it("Should revert when burn amount is zero", async function () {
            const { BigNumber, utils } = ethers;
            const amount = BigNumber.from(ZERO);

            const tokenInstance = await DeployHelper
                .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

            await expect(tokenInstance.burn(amount, {})).to.be.revertedWith("117");
        });

        it("Should revert when caller has insufficient token balance", async function () {
            const { utils } = ethers;
            const burnTokenAmount = utils.parseEther("5");

            const tokenInstance = await DeployHelper
                .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

            await expect(tokenInstance.burn(burnTokenAmount, {})).to.be.revertedWith("8");
        });

        it("Should revert when burning contract has insufficient asset balance", async function () {
            const { utils } = ethers;
            const burnTokenAmount = utils.parseEther("40");

            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper
                .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

            await tokenInstance.mint(deployer.address, burnTokenAmount, {});
            // Main function we are testing
            await expect(tokenInstance.burn(burnTokenAmount, {})).to.be.revertedWith("201");
        });

        it("Should burn the specified amount of NAFERC20 tokens", async function () {
            const { BigNumber, utils } = ethers;
            const [deployer] = await ethers.getSigners();

            const tokenInstance = await DeployHelper
                .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

            const oracleInstance = await DeployHelper
                .getDeployedTokenOracle(`${DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID}${DEPLOY_IDS.PRICE_ORACLE_ID_SUFFIX}`);

            const value = utils.parseEther("5");
            const price = await oracleInstance.getPrice();

            const previousTokenBalance = await tokenInstance.balanceOf(deployer.address);

            await deployer.sendTransaction({
                value,
                from: deployer.address,
                to: tokenInstance.address
            });

            let actualTokenBalance = await tokenInstance.balanceOf(deployer.address);
            let expectedTokenBalance = value.div(price);

            expect(previousTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedTokenBalance).to.equal(actualTokenBalance);

            await tokenInstance.burn(expectedTokenBalance, {});

            expectedTokenBalance = await tokenInstance.balanceOf(deployer.address);
            expect(expectedTokenBalance).to.equal(BigNumber.from(0));
        });
    });
});