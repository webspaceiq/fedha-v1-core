import { expect } from "chai";
import { ethers, utils } from "ethers";
import { deployments } from "hardhat";
import { EMPTY_STRING, FAKE_ADDRESS, FAKE_BYTES, ZERO_ADDRESS } from "../../src/helpers/constants";
import { PRICE_ORACLE_ID } from "../../src/helpers/deploy-ids";
import { MARKET_NAME, ConfigNames } from "../../src/helpers/env";
import { ConfigUtil } from "../../src/utilities/config";
import { Fixtures } from "./Fixtures";

describe("PriceOracle Initialization", function () {

    it("Should revert with message 'Invalid http url'", async function () {
        const { utils } = ethers;
        const fixture = deployments.createFixture(
            Fixtures.priceOracleWithoutOperatorFixture(
                {
                    id: PRICE_ORACLE_ID,
                    httpUrl: EMPTY_STRING,
                    jobId: FAKE_BYTES,
                    linkTokenAddr: utils.getAddress(FAKE_ADDRESS),
                    oracleOperatorAddr: utils.getAddress(FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.revertedWith('Invalid http url');
    });

    it("Should revert with message 'Invalid job id'", async function () {
        const fixture = deployments.createFixture(
            Fixtures.priceOracleWithoutOperatorFixture(
                {
                    id: PRICE_ORACLE_ID,
                    httpUrl: FAKE_BYTES,
                    jobId: EMPTY_STRING,
                    linkTokenAddr: utils.getAddress(FAKE_ADDRESS),
                    oracleOperatorAddr: utils.getAddress(FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.revertedWith('Invalid job id')
    });

    it("Should throw an error when an invalid operator address is provided", async function () {
        const fixture = deployments.createFixture(
            Fixtures.priceOracleWithoutOperatorFixture(
                {
                    id: PRICE_ORACLE_ID,
                    httpUrl: ZERO_ADDRESS,
                    jobId: ZERO_ADDRESS,
                    linkTokenAddr: utils.getAddress(FAKE_ADDRESS),
                    oracleOperatorAddr: utils.getAddress(ZERO_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.rejectedWith(Error)
    });

    it("Should throw an error when an invalid link token address is provided", async function () {
        const fixture = deployments.createFixture(
            Fixtures.priceOracleWithoutOperatorFixture(
                {
                    id: PRICE_ORACLE_ID,
                    httpUrl: ZERO_ADDRESS,
                    jobId: ZERO_ADDRESS,
                    linkTokenAddr: utils.getAddress(ZERO_ADDRESS),
                    oracleOperatorAddr: utils.getAddress(FAKE_ADDRESS),
                    configuration: ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames)
                }
            )
        );
        await expect(fixture()).to.be.rejectedWith(Error)
    });
});