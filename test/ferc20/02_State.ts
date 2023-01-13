import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../../src/helpers/constants";
import { Fixtures } from "./Fixtures";

describe("FERC20 State", function () {

    describe("Pause", function () {
        it("Should pause the token", async function () {
            const {
                instance,
            } = await loadFixture(Fixtures.fixture)

            await instance.pause();

            expect(await instance.paused()).to.equal(true);
        });

        it("Should unpause the token", async function () {
            const {
                instance,
            } = await loadFixture(Fixtures.fixture)

            await instance.pause();

            expect(await instance.paused()).to.equal(true);

            await instance.unpause();

            expect(await instance.paused()).to.equal(false);
        });
    });

    describe("Name", function () {
        it("Should return name of token", async function () {
            const {
                name,
                instance,
            } = await loadFixture(Fixtures.fixture)

            expect(await instance.name()).to.equal(name);
        });
    });

    describe("Symbol", function () {
        it("Should return symbol of token", async function () {
            const {
                symbol,
                instance,
            } = await loadFixture(Fixtures.fixture)

            expect(await instance.symbol()).to.equal(symbol);
        });
    });

    describe("Decimals", function () {
        it("Should return decimals of token", async function () {
            const {
                instance,
            } = await loadFixture(Fixtures.fixture)

            expect(await instance.decimals()).to.equal(ethers.BigNumber.from(18));
        });
    });

    describe("Balances", function () {
        it("Should return the total supply of zero", async function () {
            const {
                instance,
            } = await loadFixture(Fixtures.fixture)

            expect(await instance.totalSupply()).to.equal(ethers.BigNumber.from(0));
        });

        it("Should return account balance of zero", async function () {
            const {
                instance,
                owner
            } = await loadFixture(Fixtures.fixture)

            expect(
                await instance.balanceOf(owner.address))
                .to.equal(ethers.BigNumber.from(0));
        });
    });

    describe("Mint", function () {
        it("Should mint tokens", async function () {
            const {
                instance,
                owner
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;

            const amount = BigNumber.from(10);
            const previousBalance = await instance.balanceOf(owner.address);
            const expectedBalance = previousBalance.add(amount)

            expect(previousBalance).to.equal(BigNumber.from(0));

            await instance.mint(owner.address, amount);

            const currentBalance = await instance.balanceOf(owner.address);

            expect(currentBalance).to.equal(expectedBalance);
        });

        it("Should not allow non previledge account to mint tokens", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;

            const amount = BigNumber.from(10);

            await instance.mint(owner.address, amount);

            await expect(
                instance.connect(otherAccount).mint(owner.address, amount))
                .to.be.rejectedWith("AccessControl");
        });
    });

    describe("Burn", function () {
        it("Should burn tokens", async function () {
            const {
                instance,
                owner
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;

            const amount = BigNumber.from(10);
            const previousBalance = await instance.balanceOf(owner.address);
            const expectedBalance = previousBalance.add(amount)

            expect(previousBalance).to.equal(BigNumber.from(0));

            await instance.mint(owner.address, amount);

            let currentBalance = await instance.balanceOf(owner.address);

            expect(currentBalance).to.equal(expectedBalance);

            await instance.burn(amount);

            currentBalance = await instance.balanceOf(owner.address);

            expect(currentBalance).to.equal(BigNumber.from(0));
        });

        it("Should burn tokens from another account", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;

            const amount = BigNumber.from(10);
            const mintAmt = BigNumber.from(50);

            const previousAllowance = await instance.allowance(otherAccount.address, owner.address);

            await instance.mint(otherAccount.address, mintAmt);

            await instance.connect(otherAccount).approve(owner.address, amount);

            await instance.burnFrom(otherAccount.address, amount);

            const currentBalance = await instance.balanceOf(otherAccount.address);
            const currentAllowance = await instance.allowance(otherAccount.address, owner.address);

            expect(currentBalance).to.equal(mintAmt.sub(amount));
            expect(currentAllowance).to.equal(previousAllowance);
        });

        it("Should revert when burning from account zero", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber, utils } = ethers;

            const amount = BigNumber.from(10);
            const mintAmt = BigNumber.from(50);

            await instance.mint(otherAccount.address, mintAmt);

            await instance.connect(otherAccount).approve(owner.address, amount);

            await expect(
                instance.burnFrom(utils.getAddress(ZERO_ADDRESS), amount))
                .to.be.revertedWith("ERC20: insufficient allowance");
        });

        it("Should not burn when account balance is zero", async function () {
            const {
                instance,
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;

            await expect(
                instance.burn(BigNumber.from(10)))
                .to.be.revertedWith("ERC20: burn amount exceeds balance");
        });
    });

    describe("Transfer", function () {
        it("Should transfer tokens", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;

            const amount = BigNumber.from(10);
            const otherAcctPrevBal = await instance.balanceOf(otherAccount.address);


            expect(otherAcctPrevBal).to.equal(BigNumber.from(0));

            await instance.mint(owner.address, amount);

            const senderBalance = await instance.balanceOf(owner.address);

            expect(senderBalance).to.equal(BigNumber.from(10));

            await instance.transfer(otherAccount.address, amount);

            let currentOtherAcctBal = await instance.balanceOf(otherAccount.address);

            const expectedOtherAcctBal = otherAcctPrevBal.add(amount);

            expect(currentOtherAcctBal).to.equal(expectedOtherAcctBal);
        });
    });

    describe("Allowance", function () {
        it("Should return an allowance of zero", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;
            const allowance = await instance.allowance(otherAccount.address, owner.address);

            expect(allowance).to.equal(BigNumber.from(0));
        });
    });

    describe("Approve", function () {
        it("Should approve amount for spender", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);

            const allowance = await instance.allowance(otherAccount.address, owner.address);

            await instance.connect(otherAccount).approve(owner.address, amount);

            expect(
                await instance.allowance(otherAccount.address, owner.address))
                .to.equal(allowance.add(amount));
        });

        it("Should not approve amount for account zero", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber, utils } = ethers;
            const amount = BigNumber.from(10);

            await expect(
                instance.connect(otherAccount)
                    .approve(utils.getAddress(ZERO_ADDRESS), amount))
                .to.be.rejectedWith("ERC20: approve to the zero address");
        });
    });

    describe("Transfer From", function () {
        it("Should transfer tokens from another account spending allowance", async function () {
            const {
                instance,
                owner,
                otherAccount,
                thirdAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);
            const mintAmount = BigNumber.from(20);

            await instance.mint(otherAccount.address, mintAmount);

            await instance.connect(otherAccount).approve(owner.address, amount);

            await instance.transferFrom(otherAccount.address, thirdAccount.address, amount);

            expect(
                await instance.balanceOf(otherAccount.address))
                .to.equal(mintAmount.sub(amount));

            expect(
                await instance.balanceOf(thirdAccount.address))
                .to.equal(mintAmount.sub(amount));

            expect(
                await instance.allowance(otherAccount.address, owner.address))
                .to.equal(BigNumber.from(0));

        });
    });

    describe("Increase Allowance", function () {
        it("Should increase allowance of spender", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;
            const amount = BigNumber.from(10);

            const allowance = await instance.allowance(otherAccount.address, owner.address);

            await instance.connect(otherAccount).increaseAllowance(owner.address, amount);

            const currentAllowance = await instance.allowance(otherAccount.address, owner.address);

            expect(currentAllowance).to.equal(allowance.add(amount));
        });
    });

    describe("Decrease Allowance", function () {
        it("Should decrease allowance", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;
            const amount = BigNumber.from(50);
            const descreaseAmount = BigNumber.from(5);

            await instance.connect(otherAccount).approve(owner.address, amount);

            await instance.connect(otherAccount).decreaseAllowance(owner.address, descreaseAmount);

            const currentAllowance = await instance.allowance(otherAccount.address, owner.address);

            expect(currentAllowance).to.equal(amount.sub(descreaseAmount));
        });

        it("Should revert when trying decrease allowance below zero", async function () {
            const {
                instance,
                owner,
                otherAccount
            } = await loadFixture(Fixtures.fixture);

            const { BigNumber } = ethers;
            const descreaseAmount = BigNumber.from(5);

            await expect(
                instance.connect(otherAccount).decreaseAllowance(owner.address, descreaseAmount))
                .to.be.rejectedWith("ERC20: decreased allowance below zero");
        });
    });
});