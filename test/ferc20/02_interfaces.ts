import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { ZERO_ADDRESS } from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { MARKET_NAME, ConfigNames } from "../../src/helpers/env";
import { ConfigUtil } from "../../src/utilities/config";
import { Fixtures } from "./Fixtures";

describe("FERC20 State", function () {
    beforeEach(async () => {
        const fixture = deployments.createFixture(
            Fixtures.fixture(
                {
                    id: DEPLOY_IDS.TEST_TOKEN_ID,
                    tokenName: DEPLOY_IDS.TEST_TOKEN_NAME,
                    tokenSymbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL,
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await fixture();
    });

    describe("Pause", function () {
        it("Should pause the token", async function () {
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            await tokenInstance.pause();
            expect(await tokenInstance.paused()).to.equal(true);
        });

        it("Should unpause the token", async function () {
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            await tokenInstance.pause();
            expect(await tokenInstance.paused()).to.equal(true);
            await tokenInstance.unpause();
            expect(await tokenInstance.paused()).to.equal(false);
        });
    });

    describe("Name", function () {
        it("Should return name of token", async function () {
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            expect(await tokenInstance.name()).to.equal(DEPLOY_IDS.TEST_TOKEN_NAME);
        });
    });

    describe("Symbol", function () {
        it("Should return symbol of token", async function () {
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            expect(await tokenInstance.symbol()).to.equal(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
        });
    });

    describe("Decimals", function () {
        it("Should return decimals of token", async function () {
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            expect(await tokenInstance.decimals()).to.equal(ethers.BigNumber.from(18));
        });
    });

    describe("Balances", function () {
        it("Should return the total supply of zero", async function () {
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            expect(await tokenInstance.totalSupply()).to.equal(ethers.BigNumber.from(0));
        });

        it("Should return account balance of zero", async function () {
            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            expect(
                await tokenInstance.balanceOf(deployer.address)
            ).to.equal(ethers.BigNumber.from(0));
        });
    });

    describe("Mint", function () {
        it("Should mint tokens", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);

            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            const previousBalance = await tokenInstance.balanceOf(deployer.address);
            const expectedBalance = previousBalance.add(amount)

            expect(previousBalance).to.equal(BigNumber.from(0));

            await tokenInstance.mint(deployer.address, amount);
            const currentBalance = await tokenInstance.balanceOf(deployer.address);

            expect(currentBalance).to.equal(expectedBalance);
        });

        it("Should not allow non previledge account to mint tokens", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);
            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            await tokenInstance.mint(deployer.address, amount);

            await expect(
                tokenInstance.connect(notDeployer).mint(deployer.address, amount))
                .to.be.rejectedWith("AccessControl");
        });
    });

    describe("Burn", function () {
        it("Should burn tokens", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);

            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            const previousBalance = await tokenInstance.balanceOf(deployer.address);
            const expectedBalance = previousBalance.add(amount)

            expect(previousBalance).to.equal(BigNumber.from(0));

            await tokenInstance.mint(deployer.address, amount);

            let currentBalance = await tokenInstance.balanceOf(deployer.address);

            expect(currentBalance).to.equal(expectedBalance);

            await tokenInstance.burn(amount);

            currentBalance = await tokenInstance.balanceOf(deployer.address);

            expect(currentBalance).to.equal(BigNumber.from(0));
        });

        it("Should burn tokens from another account", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);
            const mintAmt = BigNumber.from(50);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            const previousAllowance = await tokenInstance.allowance(notDeployer.address, deployer.address);

            await tokenInstance.mint(notDeployer.address, mintAmt);

            await tokenInstance.connect(notDeployer).approve(deployer.address, amount);

            await tokenInstance.burnFrom(notDeployer.address, amount);

            const currentBalance = await tokenInstance.balanceOf(notDeployer.address);
            const currentAllowance = await tokenInstance.allowance(notDeployer.address, deployer.address);

            expect(currentBalance).to.equal(mintAmt.sub(amount));
            expect(currentAllowance).to.equal(previousAllowance);
        });

        it("Should revert when burning from account zero", async function () {
            const { BigNumber, utils } = ethers;
            const amount = BigNumber.from(10);
            const mintAmt = BigNumber.from(50);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);


            await tokenInstance.mint(notDeployer.address, mintAmt);

            await tokenInstance.connect(notDeployer).approve(deployer.address, amount);

            await expect(
                tokenInstance.burnFrom(utils.getAddress(ZERO_ADDRESS), amount))
                .to.be.revertedWith("ERC20: insufficient allowance");
        });

        it("Should not burn when account balance is zero", async function () {
            const [deployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            const { BigNumber } = ethers;

            await expect(
                tokenInstance.burn(BigNumber.from(10)))
                .to.be.revertedWith("ERC20: burn amount exceeds balance");
        });
    });

    describe("Transfer", function () {
        it("Should transfer tokens", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            const otherAcctPrevBal = await tokenInstance.balanceOf(notDeployer.address);

            expect(otherAcctPrevBal).to.equal(BigNumber.from(0));

            await tokenInstance.mint(deployer.address, amount);

            const senderBalance = await tokenInstance.balanceOf(deployer.address);

            expect(senderBalance).to.equal(BigNumber.from(10));

            await tokenInstance.transfer(notDeployer.address, amount);

            let currentOtherAcctBal = await tokenInstance.balanceOf(notDeployer.address);

            const expectedOtherAcctBal = otherAcctPrevBal.add(amount);

            expect(currentOtherAcctBal).to.equal(expectedOtherAcctBal);
        });
    });

    describe("Allowance", function () {
        it("Should return an allowance of zero", async function () {
            const { BigNumber } = ethers;

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);
            const allowance = await tokenInstance.allowance(notDeployer.address, deployer.address);

            expect(allowance).to.equal(BigNumber.from(0));
        });
    });

    describe("Approve", function () {
        it("Should approve amount for spender", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            const allowance = await tokenInstance.allowance(notDeployer.address, deployer.address);

            await tokenInstance.connect(notDeployer).approve(deployer.address, amount);

            expect(
                await tokenInstance.allowance(notDeployer.address, deployer.address))
                .to.equal(allowance.add(amount));
        });

        it("Should not approve amount for account zero", async function () {
            const { BigNumber, utils } = ethers;
            const amount = BigNumber.from(10);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            await expect(
                tokenInstance.connect(notDeployer)
                    .approve(utils.getAddress(ZERO_ADDRESS), amount))
                .to.be.rejectedWith("ERC20: approve to the zero address");
        });
    });

    describe("Transfer From", function () {
        it("Should transfer tokens from another account spending allowance", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);
            const mintAmount = BigNumber.from(20);

            const [deployer, notDeployer, thirdAccount] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            await tokenInstance.mint(notDeployer.address, mintAmount);

            await tokenInstance.connect(notDeployer).approve(deployer.address, amount);

            await tokenInstance.transferFrom(notDeployer.address, thirdAccount.address, amount);

            expect(
                await tokenInstance.balanceOf(notDeployer.address))
                .to.equal(mintAmount.sub(amount));

            expect(
                await tokenInstance.balanceOf(thirdAccount.address))
                .to.equal(mintAmount.sub(amount));

            expect(
                await tokenInstance.allowance(notDeployer.address, deployer.address))
                .to.equal(BigNumber.from(0));

        });
    });

    describe("Increase Allowance", function () {
        it("Should increase allowance of spender", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            const allowance = await tokenInstance.allowance(notDeployer.address, deployer.address);

            await tokenInstance.connect(notDeployer).increaseAllowance(deployer.address, amount);

            const currentAllowance = await tokenInstance.allowance(notDeployer.address, deployer.address);

            expect(currentAllowance).to.equal(allowance.add(amount));
        });
    });

    describe("Decrease Allowance", function () {
        it("Should decrease allowance", async function () {
            const { BigNumber } = ethers;
            const amount = BigNumber.from(50);
            const descreaseAmount = BigNumber.from(5);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            await tokenInstance.connect(notDeployer).approve(deployer.address, amount);

            await tokenInstance.connect(notDeployer).decreaseAllowance(deployer.address, descreaseAmount);

            const currentAllowance = await tokenInstance.allowance(notDeployer.address, deployer.address);

            expect(currentAllowance).to.equal(amount.sub(descreaseAmount));
        });

        it("Should revert when trying decrease allowance below zero", async function () {
            const { BigNumber } = ethers;
            const descreaseAmount = BigNumber.from(5);

            const [deployer, notDeployer] = await ethers.getSigners();
            const tokenInstance = await DeployHelper.getDeployedERC20Token(DEPLOY_IDS.TEST_TOKEN_SYMBOL);

            await expect(
                tokenInstance.connect(notDeployer).decreaseAllowance(deployer.address, descreaseAmount))
                .to.be.rejectedWith("ERC20: decreased allowance below zero");
        });
    });
});