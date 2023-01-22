
import { deployments, ethers } from "hardhat";
import { expect } from "chai";
import { ITreasury } from "../../typechain";
import * as CONSTANTS from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";


describe("MintFERC20Treasury:Mint", function () {
    let treasuryInstance: ITreasury;
    const id = DEPLOY_IDS.TEST_MINT_TREASURY_ID;
    
    
    beforeEach(async () => {
        await deployments.fixture(['treasuryMintTest']);
        treasuryInstance = await DeployHelper.getDeployedTreasury(id) as ITreasury;
    
    });

    it("Should revert when amount is zero", async function () {
        const [deployer] = await ethers.getSigners();

        const { BigNumber, utils } = ethers;
        const amount = utils.parseEther("0");
        const reciepientAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);

        await expect(
            treasuryInstance.mint(reciepientAddr, { value: amount })
        ).to.be.rejectedWith("116");
    });

    it("Should revert when reciepient address is zero", async function () {
        const { BigNumber, utils } = ethers;
        const amount = utils.parseEther("10");
        const reciepientAddr = utils.getAddress(CONSTANTS.ZERO_ADDRESS);

        await expect(
            treasuryInstance.mint(reciepientAddr, { value: amount })
        ).to.be.rejectedWith("206");
    });

    it("Should mint tokens to specified reciever", async function () {

        const { BigNumber, utils, provider } = ethers;
        const amountToMint = utils.parseEther("10");
        const treasurySupplyAmount = utils.parseEther("20");
        const reciepientAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);

        const tokenInstance = await DeployHelper.getDeployedERC20Token("KLINK");
        const oracleInstance = await DeployHelper.getDeployedPriceOracle("STALAG13");

        await tokenInstance.mint(treasuryInstance.address, treasurySupplyAmount);

        let currentTreasuryTokenBalance = await tokenInstance.balanceOf(treasuryInstance.address);

        expect(currentTreasuryTokenBalance).to.equal(treasurySupplyAmount);

        await treasuryInstance.mint(reciepientAddr, { value: amountToMint });

        const price = await oracleInstance.getPrice();

        const expectedReciepientTokenBal = amountToMint.div(price);

        let currentReciepientBalance = await tokenInstance.balanceOf(reciepientAddr);

        expect(expectedReciepientTokenBal).to.equal(currentReciepientBalance);

        const actualTreasuryEtherBalance = await provider.getBalance(treasuryInstance.address);
        expect(amountToMint).to.equal(actualTreasuryEtherBalance);
    });
});
