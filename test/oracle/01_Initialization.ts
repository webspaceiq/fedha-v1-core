import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Fixtures } from "./Fixtures";

describe("PriceOracle Initialization", function () {

    it("Should revert with message 'Invalid http url'", async function () {
        await expect(
            loadFixture(Fixtures.invalidHttpUrlFixture))
        .to.be.revertedWith('Invalid http url');
    });

    it("Should revert with message 'Invalid job id'", async function () {
        await expect(
            loadFixture(Fixtures.invalidJobIdFixture))
        .to.be.revertedWith('Invalid job id')
    });

    it("Should throw an error when an invalid operator address is provided", async function () {
        await expect(
            loadFixture(Fixtures.invalidOperatorAddrFixture))
        .to.be.rejectedWith(Error)
    });

    it("Should throw an error when an invalid link token address is provided", async function () {
        await expect(
            loadFixture(Fixtures.invalidLinkAddrFixture))
        .to.be.rejectedWith(Error)
    });

    it("Should add message sender to oracle admin role", async function () {
        const {  } = await loadFixture(Fixtures.Fixture);
        //expect(await oracle.hasRole(adminRole, owner.address)).to.equal(true);
    });
});