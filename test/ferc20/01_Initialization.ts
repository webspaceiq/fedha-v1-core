import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Fixtures } from "./Fixtures";

describe("FERC20 Initialization", function () {

    it("Should revert when token name is empty", async function () {
        await expect(
            loadFixture(Fixtures.invalidNameFixture))
            .to.be.revertedWith('207');
    });

    it("Should revert when token symbol is empty", async function () {
        await expect(
            loadFixture(Fixtures.invalidSymbolFixture))
            .to.be.revertedWith('208')
    });

    it("Should grant default admin role to deployer", async function () {
        const {
            instance,
            adminRole,
            owner
        } = await loadFixture(Fixtures.fixture)
        
        expect(await instance.hasRole(adminRole, owner.address)).to.equal(true)
    });

    it("Should grant pauser role to deployer", async function () {
        const {
            instance,
            pauserRole,
            owner
        } = await loadFixture(Fixtures.fixture)
        
        expect(await instance.hasRole(pauserRole, owner.address)).to.equal(true)
    });
});