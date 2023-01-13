import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Fixtures } from "./Fixtures";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";

describe("NAFERC20 Events", function () {

    it("Should emit Mint event", async function () {
        const fixture = deployments.createFixture(Fixtures.fixture({
            id: DEPLOY_IDS.TEST_ASSET_ID,
            name: DEPLOY_IDS.TEST_ASSET_NAME,
            symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL,
        }));
        const { tokenInstance } = await fixture();


        const { utils } = ethers;
        const value = utils.parseEther("10");
        const [owner] = await ethers.getSigners();

        // Main function we are testing
        await expect(
            owner.sendTransaction({
                value,
                from: owner.address,
                to: tokenInstance.address,
            })
        ).to.emit(tokenInstance, "Mint");
    });


    it("Should emit Burn event", async function () {
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

        await expect(
            tokenInstance.burn(expectedTokenBalance, {})
        ).to.emit(tokenInstance, "Burn");
    });
});