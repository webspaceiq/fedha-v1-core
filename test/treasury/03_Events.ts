import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Fixtures } from "./Fixtures";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { FAKE_ADDRESS } from "../../src/helpers/constants";

describe("Treasury Events", function () {

    it("Should emit Mint event", async function () {
        const fixture = deployments.createFixture(Fixtures.fixture());

        const { utils } = ethers;
        const amountToMint = utils.parseEther("10");
        const treasurySupplyAmount = utils.parseEther("20");
        const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
        const { treasuryInstance, tokenInstance } = await fixture();

        await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);
        let currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
        expect(currentTreasuryTokenBalance).to.equal(treasurySupplyAmount);

        await treasuryInstance.mint(reciepientAddr, { value: amountToMint });

        await expect(
            treasuryInstance.mint(reciepientAddr, { value: amountToMint })
        ).to.emit(treasuryInstance, "Mint");
    });

    it("Should emit Burn event", async function () {
        const fixture = deployments.createFixture(Fixtures.fixture());

        const { BigNumber, utils } = ethers;
        const treasurySupplyAmount = utils.parseEther("20");
        const { treasuryInstance, tokenInstance, } = await fixture();

        await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);

        await expect(treasuryInstance.burn(treasurySupplyAmount)).to.emit(treasuryInstance, "Burn");
    });

});