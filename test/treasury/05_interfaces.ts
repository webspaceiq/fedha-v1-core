import { deployments, ethers } from "hardhat";
import { expect } from "chai";
import { ITreasury } from "../../typechain";
import * as CONSTANTS from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";

    describe("TransferFromFERC20Treasury:Mint", function () {
        let treasuryInstance: ITreasury;
        const id = DEPLOY_IDS.TEST_TRANSFER_FROM_TREASURY_ID;
        
        beforeEach(async () => {
            await deployments.fixture(['treasuryTransferFromTest']);
            treasuryInstance = await DeployHelper.getDeployedTreasury(id) as ITreasury;
        
        });

        it("Should revert when amount is zero", async function () {
            const { utils } = ethers;
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

        it("Should revert when treasury does not have spending allowance on vault", async function () {
            const { BigNumber, utils } = ethers;
            const amount = utils.parseEther("10");
            const tokenSupplyAmount = utils.parseEther("20");

            const [owner, notDeployer, vault] = await ethers.getSigners();
            
            const tokenInstance = await DeployHelper.getDeployedERC20Token("FRAULEIN");

            const mintTx = await tokenInstance.mint(vault.address, tokenSupplyAmount);

            await mintTx.wait(1);

            await expect(
                treasuryInstance.mint(notDeployer.address, { value: amount })
            ).to.be.rejectedWith("ERC20: insufficient allowance");
        });

        it("Should mint tokens to specified reciever", async function () {
            const tokenInstance = await DeployHelper.getDeployedERC20Token("FRAULEIN");
            const oracleInstance = await DeployHelper.getDeployedPriceOracle("CYNTHIA_LYNN");

            const { BigNumber, utils, provider } = ethers;
            const amountToMint = utils.parseEther("10");
            const tokenSupplyAmount = utils.parseEther("20");
            const reciepientAddr = utils.getAddress(CONSTANTS.FAKE_ADDRESS);

            const [deployer, notDeployer, vault] = await ethers.getSigners();

            await tokenInstance.mint(vault.address, tokenSupplyAmount);
            await tokenInstance.connect(vault).approve(treasuryInstance.address, tokenSupplyAmount);

            let currentTreasuryTokenBalance = await tokenInstance.balanceOf(vault.address);
            expect(currentTreasuryTokenBalance).to.equal(tokenSupplyAmount);

            await treasuryInstance.mint(reciepientAddr, { value: amountToMint });

            const price = await oracleInstance.getPrice();

            const expectedReciepientTokenBal = amountToMint.div(price);
            let currentReciepientBalance = await tokenInstance.balanceOf(reciepientAddr);
            expect(expectedReciepientTokenBal).to.equal(currentReciepientBalance);

            const actualTreasuryEtherBalance = await provider.getBalance(treasuryInstance.address);
            expect(amountToMint).to.equal(actualTreasuryEtherBalance);
        });
    });
