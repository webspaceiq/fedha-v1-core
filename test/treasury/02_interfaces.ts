import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import * as CONSTANTS from "../../src/helpers/constants";
import { tEthereumAddress } from "../../src/types";
import { BigNumber, Contract } from "ethers";
import { FERC20__factory, IERC20__factory, IPriceOracle__factory, ITreasury } from "../../typechain";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { ConfigUtil } from "../../src/utilities/config";
import { ConfigNames, MARKET_NAME } from "../../src/helpers/env";

describe("Treasury Interfaces", function () {

    let treasuryInstance: ITreasury;
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const { id } = configuration.Treasury;
    
    beforeEach(async () => {
        await deployments.fixture(['core']);
        treasuryInstance = await DeployHelper.getDeployedTreasury(id) as ITreasury;
    
    });
    describe("GetTokenAddr", function () {
        it("Should return the address of the FERC20 token contract", async function () {
            const [deployer] = await ethers.getSigners();

            const tokenAddr = await (treasuryInstance as Contract).getTokenAddr();
            const tokenInstance = IERC20__factory.connect(tokenAddr, deployer);
            
            expect(tokenAddr).to.equal(tokenInstance.address);
        });
    });
    describe("SetTokenAddr", function () {
        it("Should revert when token address is zero", async function () {
            const { utils } = ethers;
            const tokenAddr = utils.getAddress(CONSTANTS.ZERO_ADDRESS);

            await expect(
                treasuryInstance.setTokenAddr(tokenAddr)
            ).to.be.rejectedWith("16");
        });

        it("Should revert when unauthorized account attempts to set the token address", async function () {
            const { utils } = ethers;
            const tokenAddr = utils.getAddress(CONSTANTS.ZERO_ADDRESS);
            
            const [deployer, notDeployer] = await ethers.getSigners();

            await expect(
                treasuryInstance.connect(notDeployer).setTokenAddr(tokenAddr)
            ).to.be.rejectedWith("AccessControl");
        });

        it("Should allow treasury admin to set the address of the token", async function () {
            const { utils } = ethers;
            const tokenAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);

            await treasuryInstance.setTokenAddr(tokenAddr);
            const actualTokenAddr = await treasuryInstance.getTokenAddr();

            expect(tokenAddr).to.equal(actualTokenAddr);
        });
    });

    describe("GetOracleAddr", function () {
        it("Should return the address of the oracle contract", async function () {
            const [deployer] = await ethers.getSigners();

            const oracleAddr = await (treasuryInstance as Contract).getOracleAddr();
            const oracleInstance = IPriceOracle__factory.connect(oracleAddr, deployer);

            expect(oracleAddr).to.equal(oracleInstance.address);
        });
    });

    describe("SetOracleAddr", function () {

        it("Should revert when oracle address is zero", async function () {
            const { utils } = ethers;
            const oracleAddr = utils.getAddress(CONSTANTS.ZERO_ADDRESS);
            
            await expect(
                treasuryInstance.setOracleAddr(oracleAddr)
            ).to.be.rejectedWith("17");
        });

        it("Should revert when unauthorized account attempts to set the oracle address", async function () {
            const { utils } = ethers;
            const oracleAddr = utils.getAddress(CONSTANTS.ZERO_ADDRESS);

            const [deployer, notDeployer] = await ethers.getSigners();
            
            await expect(
                treasuryInstance.connect(notDeployer).setOracleAddr(oracleAddr)
            ).to.be.rejectedWith("AccessControl");
        });

        it("Should allow treasury admin to set the address of the oracle", async function () {
            const { utils } = ethers;
            const oracleAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);

            await treasuryInstance.setOracleAddr(oracleAddr);

            const actualOracleAddr = await treasuryInstance.getOracleAddr();

            expect(oracleAddr).to.equal(actualOracleAddr);
        });
    });

    describe("IsPaused", function () {
        it("Should return true if contract is paused or false otherwise", async function () {
            const isPaused = await treasuryInstance.isPaused();
            // On construction contract is automatically paused
            expect(isPaused).to.equal(true);
        });
    });
    describe("Pause", function () {
        it("Should revert when an unauthorized account tries to pause the treasury contract", async function () {
            const [deployer, notDeployer] = await ethers.getSigners();

            await expect(
                treasuryInstance.connect(notDeployer).pause()
            ).to.be.rejectedWith("AccessControl");
        });

        it("Should allow treasury admin to pause the treasury", async function () {
            await treasuryInstance.pause();
            const isPaused = await treasuryInstance.isPaused();

            // On construction contract is automatically paused
            expect(isPaused).to.equal(true);
        });
    });
    describe("Unpause", function () {
        it("Should revert when an unauthorized account tries to unpause the treasury contract", async function () {
            const [deployer, notDeployer] = await ethers.getSigners();

            await expect(
                treasuryInstance.connect(notDeployer).unpause()
            ).to.be.rejectedWith("AccessControl");
        });

        it("Should allow treasury admin to unpause the treasury", async function () {
            // On construction contract is automatically paused
            await treasuryInstance.unpause();

            const isPaused = await treasuryInstance.isPaused();

            expect(isPaused).to.equal(false);
        });
    });

    describe("Mint", function () {
        it("Should revert when amount is zero", async function () {
            const { utils } = ethers;
            const amount = utils.parseEther("0");
            const reciepientAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("116");
        });

        it("Should revert when reciepient address is zero", async function () {
            const { utils } = ethers;
            const amount = utils.parseEther("10");
            const reciepientAddr = utils.getAddress(CONSTANTS.ZERO_ADDRESS);

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("206");
        });

        it("Should revert when token balance is less than amount", async function () {
            const { utils } = ethers;
            const amount = utils.parseEther("10");
            const reciepientAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("8");
        });

        it("Should revert if price oracle returns zero", async function () {
        });

        it("Should mint tokens to specified reciever", async function () {

            const { BigNumber, utils, provider } = ethers;
            const amountToMint = utils.parseEther("10");
            const treasurySupplyAmount = utils.parseEther("20");
            const reciepientAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);
            
            const [deployer] = await ethers.getSigners();

            const tokenAddr = await (treasuryInstance as Contract).getTokenAddr();
            const tokenInstance = FERC20__factory.connect(tokenAddr, deployer);

            const oracleAddr = await (treasuryInstance as Contract).getOracleAddr();
            const oracleInstance = IPriceOracle__factory.connect(oracleAddr, deployer);

            await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);
            let currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
            expect(currentTreasuryTokenBalance).to.equal(treasurySupplyAmount);

            await treasuryInstance.mint(reciepientAddr, { value: amountToMint });

            const price = await oracleInstance.getPrice();

            const expectedReciepientTokenBal = amountToMint.div(price);
            let currentReciepientBalance = await tokenInstance.balanceOf(reciepientAddr);
            expect(expectedReciepientTokenBal).to.equal(currentReciepientBalance);

            const expectedTreasuryBalance = currentTreasuryTokenBalance.sub(expectedReciepientTokenBal);
            currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
            expect(expectedTreasuryBalance).to.equal(currentTreasuryTokenBalance);

            const actualTreasuryEtherBalance = await provider.getBalance(treasuryInstance.address);
            expect(amountToMint).to.equal(actualTreasuryEtherBalance);
        });
    });

    
    describe("Burn", function () {
        it("Should revert when amount is zero", async function () {
            const { utils } = ethers;
            const amount = utils.parseEther("0");

            await expect(treasuryInstance.burn(amount)).to.be.rejectedWith("117");
        });

        it("Should revert when token balance is less than amount", async function () {
            const { utils } = ethers;
            const amount = utils.parseEther("10");

            await expect(treasuryInstance.burn(amount)).to.be.rejectedWith("8");
        });

        it("Should revert if price oracle returns zero", async function () {
        });

        it("Should burn tokens", async function () {

            const { BigNumber, utils } = ethers;
            const value = utils.parseEther("100");
            const treasurySupplyAmount = utils.parseEther("20");
            
            const [deployer] = await ethers.getSigners();

            const tokenAddr = await (treasuryInstance as Contract).getTokenAddr();
            const tokenInstance = FERC20__factory.connect(tokenAddr, deployer);

            await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);

            let currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
            expect(currentTreasuryTokenBalance).to.equal(treasurySupplyAmount);

            const sentTx = await deployer.sendTransaction({
                value,
                from: deployer.address,
                to: treasuryInstance.address
            });
            sentTx.wait(1);

            await treasuryInstance.burn(treasurySupplyAmount);

            currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
            expect(currentTreasuryTokenBalance).to.equal(utils.parseEther("0"));
        });
    });

    describe("Disburse", function () {
        it("Should revert length of arrays mismatch", async function () {
            const { utils } = ethers;
            const amounts: tEthereumAddress[] = [];
            const recepientAddrs: tEthereumAddress[] = [utils.getAddress(CONSTANTS.FAKE_ADDRESS)];

            await expect(treasuryInstance.disburse(recepientAddrs, amounts)).to.be.rejectedWith("10");
        });

        it("Should revert if any reciepient amount is zero", async function () {
            const { utils } = ethers;
            const amounts: BigNumber[] = [utils.parseEther("0")];
            const recepientAddrs: tEthereumAddress[] = [utils.getAddress(CONSTANTS.FAKE_ADDRESS)];

            await expect(treasuryInstance.disburse(recepientAddrs, amounts)).to.be.rejectedWith("116");
        });

        it("Should revert if there is insufficient funds", async function () {
            const { utils } = ethers;
            const amounts: BigNumber[] = [utils.parseEther("10")];
            const recepientAddrs: tEthereumAddress[] = [utils.getAddress(CONSTANTS.FAKE_ADDRESS)];

            await expect(treasuryInstance.disburse(recepientAddrs, amounts)).to.be.rejectedWith("8");
        });

        it("Should revert if any reciepient address is zero", async function () {
            const { utils } = ethers;
            const value = utils.parseEther("20");
            const amount = utils.parseEther("10");
            const [owner] = await ethers.getSigners();
            const reciepientAddr = utils.getAddress(CONSTANTS.ZERO_ADDRESS);

            const amounts: BigNumber[] = [amount];
            const recepientAddrs: tEthereumAddress[] = [reciepientAddr];

            await owner.sendTransaction({
                value,
                from: owner.address,
                to: treasuryInstance.address
            });

            await expect(
                treasuryInstance.disburse(recepientAddrs, amounts)
            ).to.be.rejectedWith("206");
        });

        it("Should disburse asset", async function () {
            const { utils, provider } = ethers;
            const value = utils.parseEther("10");
            const disburseAmount = utils.parseEther("5");

            const [deployer, notDeployer, coolDude] = await ethers.getSigners();

            const amounts: BigNumber[] = [disburseAmount];
            const recepientAddrs: tEthereumAddress[] = [coolDude.address];

            const prevReciepientEtherBalance = await provider.getBalance(coolDude.address);

            await deployer.sendTransaction({
                value,
                from: deployer.address,
                to: treasuryInstance.address,
                gasLimit: 250000,
            });

            await treasuryInstance.disburse(recepientAddrs, amounts);

            const currentReciepientEtherBalance = await provider.getBalance(coolDude.address);
            const expectedReciepientEtherBalance = prevReciepientEtherBalance.add(disburseAmount);

            expect(expectedReciepientEtherBalance).to.equal(currentReciepientEtherBalance);
        });

        it("Should emit Disburse event", async function () {
            const { utils } = ethers;
            const value = utils.parseEther("20");
            const amount = utils.parseEther("10");
            const [owner, otherAccount] = await ethers.getSigners();

            const amounts: BigNumber[] = [amount];
            const recepientAddrs: tEthereumAddress[] = [otherAccount.address];

            await owner.sendTransaction({
                value,
                from: owner.address,
                to: treasuryInstance.address,
                gasLimit: 250000,
            });

            await expect(
                treasuryInstance.disburse(recepientAddrs, amounts)
            ).to.emit(treasuryInstance, "Disburse");
        });
    });
});