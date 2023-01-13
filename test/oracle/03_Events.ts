import { HelperFunctions } from "../../src/utilities/helper-functions";
import { assert, expect } from "chai";
import { Fixtures } from "./Fixtures";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";


describe("PriceOracle Events", function () {
    it("Should successfully make an API call", async function () {
        const { oracle } = await loadFixture(
            Fixtures.Fixture
        );
        const transaction = await oracle.requestData();
        const transactionReceipt = await transaction.wait(1);
        const requestId = transactionReceipt.events[0].topics[1];
        expect(requestId).to.not.be.null;
    });

    it("Should successfully make an API request and get a result", async function () {
        const { oracle, mockOracle } = await loadFixture(
            Fixtures.Fixture
        );
        const transaction = await oracle.requestData();
        const transactionReceipt = await transaction.wait(1)
        const requestId = transactionReceipt.events[0].topics[1]
        const callbackValue = 777
        await mockOracle.fulfillOracleRequest(requestId, HelperFunctions.numToBytes32(callbackValue))
        const volume = await oracle._currentPrice()
        assert.equal(volume.toString(), callbackValue.toString())
    });


    it("Should emit an event on request fulfillment", async function () {

        const { oracle, mockOracle } = await loadFixture(
            Fixtures.Fixture
        );
        const callbackValue = 777
        const transaction = await oracle.requestData();
        const transactionReceipt = await transaction.wait(1);
        const requestId = transactionReceipt.events[0].topics[1]
        await expect(mockOracle.fulfillOracleRequest(requestId, HelperFunctions.numToBytes32(callbackValue)))
            .to.emit(oracle, "RequestFulfilled");
    });
});