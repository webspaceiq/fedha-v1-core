import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { Fixtures } from "./Fixtures";
import { FAKE_ADDRESS, ZERO_ADDRESS } from "../../src/helpers/constants";
import { tEthereumAddress } from "../../src/types";
import { BigNumber } from "ethers";

describe("Treasury Interfaces", function () {
    describe("GetTokenAddr", function () {
        it("Should return the address of the FERC20 token contract", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const { treasuryAdmin } = await getNamedAccounts();
            const [owner, otherAccount] = await ethers.getSigners();
            const { treasuryInstance, tokenInstance, oracleInstance } = await fixture();

            const tokenAddr = await treasuryInstance.getTokenAddr();
            expect(tokenAddr).to.equal(tokenInstance.address);
        });
    });
    describe("SetTokenAddr", function () {
        it("Should revert when token address is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { utils } = ethers;
            const tokenAddr = utils.getAddress(ZERO_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.setTokenAddr(tokenAddr)
            ).to.be.rejectedWith("16");
        });

        it("Should revert when unauthorized account attempts to set the token address", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { utils } = ethers;
            const { treasuryInstance } = await fixture();

            const tokenAddr = utils.getAddress(ZERO_ADDRESS);
            const [owner, otherAccount] = await ethers.getSigners();
            await expect(
                treasuryInstance.connect(otherAccount).setTokenAddr(tokenAddr)
            ).to.be.rejectedWith("AccessControl");
        });

        it("Should allow treasury admin to set the address of the token", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());
            const { treasuryInstance } = await fixture();

            const { utils } = ethers;
            const tokenAddr = utils.getAddress(FAKE_ADDRESS);

            await treasuryInstance.setTokenAddr(tokenAddr);

            const actualTokenAddr = await treasuryInstance.getTokenAddr();

            expect(tokenAddr).to.equal(actualTokenAddr);
        });
    });
    describe("GetOracleAddr", function () {
        it("Should return the address of the oracle contract", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const { treasuryInstance, oracleInstance } = await fixture();

            const oracleAddr = await treasuryInstance.getOracleAddr();
            expect(oracleAddr).to.equal(oracleInstance.address);
        });
    });
    describe("SetOracleAddr", function () {

        it("Should revert when oracle address is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { utils } = ethers;
            const oracleAddr = utils.getAddress(ZERO_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.setOracleAddr(oracleAddr)
            ).to.be.rejectedWith("17");
        });

        it("Should revert when unauthorized account attempts to set the oracle address", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { utils } = ethers;
            const { treasuryInstance } = await fixture();

            const oracleAddr = utils.getAddress(ZERO_ADDRESS);
            const [owner, otherAccount] = await ethers.getSigners();
            await expect(
                treasuryInstance.connect(otherAccount).setOracleAddr(oracleAddr)
            ).to.be.rejectedWith("AccessControl");
        });

        it("Should allow treasury admin to set the address of the oracle", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());
            const { treasuryInstance } = await fixture();

            const { utils } = ethers;
            const oracleAddr = utils.getAddress(FAKE_ADDRESS);

            await treasuryInstance.setOracleAddr(oracleAddr);

            const actualOracleAddr = await treasuryInstance.getOracleAddr();

            expect(oracleAddr).to.equal(actualOracleAddr);
        });
    });
    describe("IsPaused", function () {
        it("Should return true if contract is paused or false otherwise", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { treasuryInstance } = await fixture();
            const isPaused = await treasuryInstance.isPaused();
            // On construction contract is automatically paused
            expect(isPaused).to.equal(true);
        });
    });
    describe("Pause", function () {
        it("Should revert when an unauthorized account tries to pause the treasury contract", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { treasuryInstance } = await fixture();
            const [owner, otherAccount] = await ethers.getSigners();

            await expect(
                treasuryInstance.connect(otherAccount).pause()
            ).to.be.rejectedWith("AccessControl");
        });

        it("Should allow treasury admin to pause the treasury", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { treasuryInstance } = await fixture();

            await treasuryInstance.pause();

            const isPaused = await treasuryInstance.isPaused();
            // On construction contract is automatically paused
            expect(isPaused).to.equal(true);
        });
    });
    describe("Unpause", function () {

        it("Should revert when an unauthorized account tries to unpause the treasury contract", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { treasuryInstance } = await fixture();
            const [owner, otherAccount] = await ethers.getSigners();

            await expect(
                treasuryInstance.connect(otherAccount).unpause()
            ).to.be.rejectedWith("AccessControl");
        });
        it("Should allow treasury admin to unpause the treasury", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { treasuryInstance } = await fixture();
            // On construction contract is automatically paused
            await treasuryInstance.unpause();

            const isPaused = await treasuryInstance.isPaused();

            expect(isPaused).to.equal(false);
        });
    });

    describe("Mint", function () {
        it("Should revert when amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("0");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("116");
        });

        it("Should revert when reciepient address is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const reciepientAddr = utils.getAddress(ZERO_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("206");
        });

        it("Should revert when token balance is less than amount", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("8");
        });

        it("Should revert if price oracle returns zero", async function () {
        });

        it("Should mint tokens to specified reciever", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils, provider } = ethers;
            const amountToMint = utils.parseEther("10");
            const treasurySupplyAmount = utils.parseEther("20");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance, tokenInstance, oracleInstance } = await fixture();

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

    describe("MintFERC20Treasury:Mint", function () {
        it("Should revert when amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.mintERC20TreasuryFixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("0");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("116");
        });

        it("Should revert when reciepient address is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.mintERC20TreasuryFixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const reciepientAddr = utils.getAddress(ZERO_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("206");
        });

        it("Should mint tokens to specified reciever", async function () {
            const fixture = deployments.createFixture(Fixtures.mintERC20TreasuryFixture());

            const { BigNumber, utils, provider } = ethers;
            const amountToMint = utils.parseEther("10");
            const treasurySupplyAmount = utils.parseEther("20");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance, tokenInstance, oracleInstance } = await fixture();

            await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);
            let currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
            expect(currentTreasuryTokenBalance).to.equal(treasurySupplyAmount);

            await treasuryInstance.mint(reciepientAddr, { value: amountToMint });

            const price = await oracleInstance.getPrice();

            const expectedReciepientTokenBal = amountToMint.div(price);
            let currentReciepientBalance = await tokenInstance.balanceOf(reciepientAddr);
            expect(expectedReciepientTokenBal).to.equal(currentReciepientBalance);

            const actualTreasuryEtherBalance = await provider.getBalance(treasuryInstance.address);
            expect(amountToMint).to.equal(actualTreasuryEtherBalance);
        });
    });

    describe("TransferFromFERC20Treasury:Mint", function () {
        it("Should revert when amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.transferFromERC20TreasuryFixture());

            const { utils } = ethers;
            const amount = utils.parseEther("0");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("116");
        });

        it("Should revert when reciepient address is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.transferFromERC20TreasuryFixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const reciepientAddr = utils.getAddress(ZERO_ADDRESS);
            const { treasuryInstance } = await fixture();

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("206");
        });

        it("Should revert when treasury does not have spending allowance on vault", async function () {
            const fixture = deployments.createFixture(Fixtures.transferFromERC20TreasuryFixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const tokenSupplyAmount = utils.parseEther("20");
            const [owner, add1, ] = await ethers.getSigners();
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance, tokenInstance } = await fixture();

            await tokenInstance.mint(add1.address, tokenSupplyAmount);

            await expect(
                treasuryInstance.mint(reciepientAddr, { value: amount })
            ).to.be.rejectedWith("ERC20: insufficient allowance");
        });

        it("Should mint tokens to specified reciever", async function () {
            const fixture = deployments.createFixture(Fixtures.transferFromERC20TreasuryFixture());

            const { BigNumber, utils, provider } = ethers;
            const amountToMint = utils.parseEther("10");
            const tokenSupplyAmount = utils.parseEther("20");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const [owner, add1, ] = await ethers.getSigners();
            const { treasuryInstance, tokenInstance, oracleInstance } = await fixture();

            await tokenInstance.mint(add1.address, tokenSupplyAmount);
            await tokenInstance.connect(add1).approve(treasuryInstance.address, tokenSupplyAmount);

            let currentTreasuryTokenBalance = await tokenInstance.balanceOf(add1.address);
            expect(currentTreasuryTokenBalance).to.equal(tokenSupplyAmount);

            await treasuryInstance.mint(reciepientAddr, { value: amountToMint });

            const price = await oracleInstance.getPrice();

            const expectedReciepientTokenBal = amountToMint.div(price);
            let currentReciepientBalance = await tokenInstance.balanceOf(reciepientAddr);
            expect(expectedReciepientTokenBal).to.equal(currentReciepientBalance);

            const actualTreasuryEtherBalance = await provider.getBalance(treasuryInstance.address);
            expect(amountToMint).to.equal(actualTreasuryEtherBalance);
        });
    });

    describe("Burn", function () {
        it("Should revert when amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("0");
            const { treasuryInstance } = await fixture();

            await expect(treasuryInstance.burn(amount)).to.be.rejectedWith("117");
        });

        it("Should revert when token balance is less than amount", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const { treasuryInstance } = await fixture();

            await expect(treasuryInstance.burn(amount)).to.be.rejectedWith("8");
        });

        it("Should revert if price oracle returns zero", async function () {
        });

        it("Should burn tokens", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const treasurySupplyAmount = utils.parseEther("20");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance, tokenInstance, oracleInstance } = await fixture();

            await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);

            let currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
            expect(currentTreasuryTokenBalance).to.equal(treasurySupplyAmount);

            await treasuryInstance.burn(treasurySupplyAmount);

            currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
            expect(currentTreasuryTokenBalance).to.equal(utils.parseEther("0"));
        });
    });

    describe("Disburse", function () {
        it("Should revert length of arrays mismatch", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const { treasuryInstance } = await fixture();

            const amounts: tEthereumAddress[] = [];
            const recepientAddrs: tEthereumAddress[] = [utils.getAddress(FAKE_ADDRESS)];

            await expect(treasuryInstance.disburse(recepientAddrs, amounts)).to.be.rejectedWith("10");
        });

        it("Should revert if any reciepient amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { utils } = ethers;
            const amount = utils.parseEther("0");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance } = await fixture();

            const amounts: BigNumber[] = [amount];
            const recepientAddrs: tEthereumAddress[] = [reciepientAddr];

            await expect(treasuryInstance.disburse(recepientAddrs, amounts)).to.be.rejectedWith("116");
        });

        it("Should revert if there is insufficient funds", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { utils } = ethers;
            const amount = utils.parseEther("10");
            const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
            const { treasuryInstance } = await fixture();

            const amounts: BigNumber[] = [amount];
            const recepientAddrs: tEthereumAddress[] = [reciepientAddr];

            await expect(treasuryInstance.disburse(recepientAddrs, amounts)).to.be.rejectedWith("8");
        });

        it("Should revert if any reciepient address is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const value = utils.parseEther("20");
            const amount = utils.parseEther("10");
            const [owner] = await ethers.getSigners();
            const reciepientAddr = utils.getAddress(ZERO_ADDRESS);
            const { treasuryInstance } = await fixture();

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
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils, provider } = ethers;
            const value = utils.parseEther("10");
            const disburseAmount = utils.parseEther("5");

            const [owner, add1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
            const { treasuryInstance, oracleInstance } = await fixture();

            const amounts: BigNumber[] = [disburseAmount];
            const recepientAddrs: tEthereumAddress[] = [addr5.address];

            const prevReciepientEtherBalance = await provider.getBalance(addr5.address);

            await owner.sendTransaction({
                value,
                from: owner.address,
                to: treasuryInstance.address,
                gasLimit: 250000,
            });

            await treasuryInstance.disburse(recepientAddrs, amounts);

            const currentReciepientEtherBalance = await provider.getBalance(addr5.address);
            const expectedReciepientEtherBalance = prevReciepientEtherBalance.add(disburseAmount);

            expect(expectedReciepientEtherBalance).to.equal(currentReciepientEtherBalance);
        });

        it("Should emit Disburse event", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils, provider } = ethers;
            const value = utils.parseEther("20");
            const amount = utils.parseEther("10");
            const [owner, otherAccount] = await ethers.getSigners();
            const { treasuryInstance } = await fixture();

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