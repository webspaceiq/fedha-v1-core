import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments } from "hardhat";
import { EMPTY_STRING } from "../../src/helpers/constants";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { Fixtures } from "./Fixtures";

describe("AFERC20 Initialization", function () {
    it("Should revert when token name is empty", async function () {
        const fixture = deployments.createFixture(Fixtures.fixture({
            id: DEPLOY_IDS.TEST_ASSET_ID,
            name: EMPTY_STRING,
            symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
        }));
        await expect(fixture()).to.be.revertedWith('207');
    });

    it("Should revert when token symbol is empty", async function () {
        const fixture = deployments.createFixture(Fixtures.fixture({
            id: DEPLOY_IDS.TEST_ASSET_ID,
            name: DEPLOY_IDS.TEST_ASSET_NAME,
            symbol: EMPTY_STRING,
        }));
        await expect(fixture()).to.be.revertedWith('208');
    });

    it("Should revert when oracle address is empty", async function () {
        const fixture = deployments.createFixture(Fixtures.invalidOracleAddrFixtureImpl({
            id: DEPLOY_IDS.TEST_ASSET_ID,
            name: DEPLOY_IDS.TEST_ASSET_NAME,
            symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
        }));
        await expect(fixture()).to.be.revertedWith('17');
    });

    it("Should revert when asset address is empty", async function () {
        const fixture = deployments.createFixture(Fixtures.invalidAssetAddrFixtureImpl({
            id: DEPLOY_IDS.TEST_ASSET_ID,
            name: DEPLOY_IDS.TEST_ASSET_NAME,
            symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
        }));
        await expect(fixture()).to.be.revertedWith('16');
    });

    it("Should not revert ", async function () {
        const fixture = deployments.createFixture(Fixtures.fixture({
            id: DEPLOY_IDS.TEST_ASSET_ID,
            name: DEPLOY_IDS.TEST_ASSET_NAME,
            symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
        }));
        await expect(fixture()).to.not.be.rejectedWith(Error);
    });
});