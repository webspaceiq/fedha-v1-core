import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";
import { Fixtures } from "./Fixtures";
import { ZERO_ADDRESS } from "../../src/helpers/constants";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("PriceOracle State", function () {

    describe("HttpOperatorClientBase", function () {
        describe("HTTP URL", function () {
            it("Should return HTTP endpoint URL", async function () {
                const { oracle, httpUrl } = await loadFixture(
                    Fixtures.Fixture
                );
                expect(await oracle.getHttpUrl()).to.equal(httpUrl);
            });

            it("Should update the HTTP endpoint URL", async function () {
                const { oracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await oracle.setHttpUrl("httpUrlTwo")
                expect(await oracle.getHttpUrl()).to.equal("httpUrlTwo");
            });

            it("Should allow only oracle admin to update HTTP endpoint URL", async function () {
                const { oracle, otherAccount, anotherMockOracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.connect(otherAccount).setHttpUrl("httpUrlTwo")).to.be.rejectedWith(Error)
            });

            it("Should fail to update HTTP endpoint URL given empty URL string", async function () {
                const { oracle, otherAccount, anotherMockOracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.setHttpUrl("")).to.be.rejectedWith(Error)
            });

            it("Should emit JobIdUpdated event", async function () {
                const { oracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.setHttpUrl("httpUrlTwo"))
                    .to.emit(oracle, "HttpUrlUpdated");
            });
        });

        describe("Job ID", function () {
            it("Should return the job id ", async function () {
                const { oracle, jobId } = await loadFixture(
                    Fixtures.Fixture
                );
                expect(await oracle.getJobId()).to.equal(jobId);
            });

            it("Should update the job id", async function () {
                const { oracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await oracle.setJobId("jobId")
                expect(await oracle.getJobId()).to.equal("jobId");
            });

            it("Should allow only oracle admin to update job id", async function () {
                const { oracle, otherAccount } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.connect(otherAccount).setJobId("jobId")).to.be.rejectedWith(Error)
            });

            it("Should fail to update job id given empty string", async function () {
                const { oracle, otherAccount, anotherMockOracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.setJobId("")).to.be.rejectedWith(Error)
            });

            it("Should emit JobIdUpdated event", async function () {
                const { oracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.setJobId("jobId"))
                    .to.emit(oracle, "JobIdUpdated");
            });
        });

        describe("Operator Address", function () {
            it("Should return address of operator contract ", async function () {
                const { oracle, mockOracle } = await loadFixture(
                    Fixtures.Fixture
                );
                expect(await oracle.getOperatorAddress()).to.equal(mockOracle.address);
            });

            it("Should update the address of operator contract ", async function () {
                const { oracle, anotherMockOracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await oracle.setOperatorAddress(anotherMockOracle.address)
                expect(await oracle.getOperatorAddress()).to.equal(anotherMockOracle.address);
            });

            it("Should allow only oracle admin to update address of operator contract", async function () {
                const { oracle, otherAccount, anotherMockOracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.connect(otherAccount).setOperatorAddress(anotherMockOracle.address)).to.be.rejectedWith(Error)
            });

            it("Should fail to update operator contract address given zero address", async function () {
                const { oracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.setOperatorAddress(utils.getAddress(ZERO_ADDRESS))).to.be.rejectedWith(Error)
            });

            it("Should emit OperatorAddressUpdated event", async function () {
                const { oracle, anotherMockOracle } = await loadFixture(
                    Fixtures.Fixture
                );
                await expect(oracle.setOperatorAddress(anotherMockOracle.address))
                    .to.emit(oracle, "OperatorAddressUpdated");
            });
        });

        describe("Link Token", function () {

            it("Should also return address of link token ", async function () {
                const { oracle, linkTokenAddr } = await loadFixture(
                    Fixtures.Fixture
                );
                expect(await oracle.getChainlinkToken()).to.equal(linkTokenAddr);
            });

            it("Should withdraw link token ", async function () {

                const { oracle, mockOracle, owner, linkToken } = await loadFixture(
                    Fixtures.Fixture
                );
                const oldBalance = await linkToken.balanceOf(owner.address);
                const transaction = await oracle.requestData();
                const transactionReceipt = await transaction.wait(1)
                const requestId = transactionReceipt.events[0].topics[1]
                const callbackValue = ethers.utils.hexZeroPad(ethers.utils.hexlify(777), 32)
                await mockOracle.fulfillOracleRequest(requestId, callbackValue);
                const volume = await oracle._currentPrice()
                await oracle.withdrawLink();
                const newBalance = await linkToken.balanceOf(owner.address);

                expect(newBalance).to.not.equal(oldBalance);
            });
        });
    });
});