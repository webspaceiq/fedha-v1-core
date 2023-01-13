import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments } from "hardhat";
import { EMPTY_STRING } from "../../src/helpers/constants";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { Fixtures } from "./Fixtures";

describe("Treasury Initialization", function () {
    it("Should revert when token address is zero", async function () {
        it("Should revert when token name is empty", async function () {
            const fixture = deployments.createFixture(Fixtures.invalidTokenAddr());
            await expect(fixture()).to.be.revertedWith('207');
        });
    });
    it("Should revert when oracle address is zero", async function () {
        const fixture = deployments.createFixture(Fixtures.invalidOracleAddr());
        await expect(fixture()).to.be.revertedWith('207');
       
    });
});