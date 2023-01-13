import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Fixtures } from "./Fixtures";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { EMPTY_STRING, ZERO, ZERO_ADDRESS } from "../../src/helpers/constants";

describe("NAFERC20 Interfaces", function () {
    describe("Receive", function () {
        it("Should mint tokens when Ether is sent to receive function", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { tokenInstance, oracleInstance } = await fixture();

            const { utils, BigNumber, provider } = ethers;
            const value = utils.parseEther("10");
            const [owner] = await ethers.getSigners();
            const price = await oracleInstance.getPrice();

            const previousTokenBalance = await tokenInstance.balanceOf(owner.address);

            await owner.sendTransaction({
                value,
                from: owner.address,
                to: tokenInstance.address
            });

            const actualTokenBalance = await tokenInstance.balanceOf(owner.address);
            const expectedTokenBalance = value.div(price);

            expect(previousTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedTokenBalance).to.equal(actualTokenBalance);
        });
    });

    describe("Fallback", function () {
        it("Should mint tokens when Ether is sent to fallback function", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { tokenInstance, oracleInstance } = await fixture();

            const { utils, BigNumber, provider } = ethers;
            const value = utils.parseEther("10");
            const [owner] = await ethers.getSigners();
            const price = await oracleInstance.getPrice();
            const data = utils.formatBytes32String(EMPTY_STRING);

            const previousTokenBalance = await tokenInstance.balanceOf(owner.address);

            await owner.sendTransaction({
                value,
                data,
                from: owner.address,
                to: tokenInstance.address,
            });

            const actualTokenBalance = await tokenInstance.balanceOf(owner.address);
            const expectedTokenBalance = value.div(price);

            expect(previousTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedTokenBalance).to.equal(actualTokenBalance);
        });
    });

    describe("Mint", function () {
        it("Should revert when mint amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { tokenInstance } = await fixture();

            const { utils } = ethers;
            const [owner] = await ethers.getSigners();
            const value = utils.parseEther("0");

            await expect(
                owner.sendTransaction({
                    value,
                    from: owner.address,
                    to: tokenInstance.address,
                })
            ).to.be.revertedWith('116');
        });
    });

    describe("Burn", function () {
        it("Should revert when burn amount is zero", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { tokenInstance } = await fixture();

            const { BigNumber } = ethers;
            const amount = BigNumber.from(ZERO);

            await expect(tokenInstance.burn(amount, {})).to.be.revertedWith("117");
        });
        
        it("Should revert when caller has insufficient token balance", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { tokenInstance } = await fixture();
            const { utils } = ethers;
            const burnTokenAmount = utils.parseEther("5");

            await expect(tokenInstance.burn(burnTokenAmount, {})).to.be.revertedWith("8");
        });
        
        it("Should revert when burning contract has insufficient asset balance", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { tokenInstance, treasuryAdmin } = await fixture();

            const { utils } = ethers;
            const burnTokenAmount = utils.parseEther("40");

            await tokenInstance.mint(treasuryAdmin, burnTokenAmount, {});
            // Main function we are testing
            await expect(tokenInstance.burn(burnTokenAmount, {})).to.be.revertedWith("201");
        });

        it("Should burn the specified amount of NAFERC20 tokens", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
            }));
            const { tokenInstance, oracleInstance } = await fixture();

            const { utils, BigNumber, provider } = ethers;
            const value = utils.parseEther("5");
            const [owner] = await ethers.getSigners();
            const price = await oracleInstance.getPrice();

            const previousTokenBalance = await tokenInstance.balanceOf(owner.address);

            await owner.sendTransaction({
                value,
                from: owner.address,
                to: tokenInstance.address
            });

            let actualTokenBalance = await tokenInstance.balanceOf(owner.address);
            let expectedTokenBalance = value.div(price);
            let expectedEtherBalance = expectedTokenBalance.mul(price);

            expect(previousTokenBalance).to.equal(BigNumber.from(0));
            expect(expectedTokenBalance).to.equal(actualTokenBalance);

            await tokenInstance.burn(expectedTokenBalance, {});

            expectedTokenBalance = await tokenInstance.balanceOf(owner.address);
            expect(expectedTokenBalance).to.equal(BigNumber.from(0));
            //expect(expectedEtherBalance).to.equal(value);
        });


    });
});