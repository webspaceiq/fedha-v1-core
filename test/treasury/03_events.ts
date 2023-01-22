import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Fixtures } from "./Fixtures";
import { FAKE_ADDRESS } from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { MARKET_NAME, ConfigNames } from "../../src/helpers/env";
import { ConfigUtil } from "../../src/utilities/config";
import { FERC20__factory, IERC20__factory, ITreasury } from "../../typechain";
import { Contract } from "ethers";

describe("Treasury Events", function () {
    let treasuryInstance: ITreasury;
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const { id } = configuration.Treasury;
    
    beforeEach(async () => {
        await deployments.fixture(['core']);
        treasuryInstance = await DeployHelper.getDeployedTreasury(id) as ITreasury;
    
    });

    it("Should emit Mint event", async function () {
        const { utils } = ethers;
        const amountToMint = utils.parseEther("10");
        const treasurySupplyAmount = utils.parseEther("20");
        const reciepientAddr = utils.getAddress(FAKE_ADDRESS);
        
        const [deployer] = await ethers.getSigners();
        const tokenAddr = await (treasuryInstance as Contract).getTokenAddr();
        const tokenInstance = FERC20__factory.connect(tokenAddr, deployer);

        await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);
        let currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);
        expect(currentTreasuryTokenBalance).to.equal(treasurySupplyAmount);

        await treasuryInstance.mint(reciepientAddr, { value: amountToMint });

        await expect(
            treasuryInstance.mint(reciepientAddr, { value: amountToMint })
        ).to.emit(treasuryInstance, "Mint");
    });

    it("Should emit Burn event", async function () {
        const { BigNumber, utils } = ethers;
        const treasurySupplyAmount = utils.parseEther("20");

        const [deployer] = await ethers.getSigners();
        const tokenAddr = await (treasuryInstance as Contract).getTokenAddr();
        const tokenInstance = FERC20__factory.connect(tokenAddr, deployer);

        await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);

        await expect(treasuryInstance.burn(treasurySupplyAmount)).to.emit(treasuryInstance, "Burn");
    });

});