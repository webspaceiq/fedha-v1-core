import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { NAFERC20 } from "../../typechain";

describe("NAFERC20 Events", function () {
    beforeEach(async () => {
        await deployments.fixture(['test']);
    });


    it("Should emit Mint event", async function () {
        const { utils } = ethers;
        const value = utils.parseEther("10");
        const [deployer] = await ethers.getSigners();

        const tokenInstance = await DeployHelper
            .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

        // Main function we are testing
        await expect(
            deployer.sendTransaction({
                value,
                from: deployer.address,
                to: tokenInstance.address,
            })
        ).to.emit(tokenInstance, "Mint");
    });


    it("Should emit Burn event", async function () {
        const { utils } = ethers;
        const [deployer] = await ethers.getSigners();

        const tokenInstance = await DeployHelper
            .getDeployedERC20Token(DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID) as NAFERC20;

        const oracleInstance = await DeployHelper
            .getDeployedTokenOracle(`${DEPLOY_IDS.TEST_NAFERC20_TOKEN_ID}${DEPLOY_IDS.PRICE_ORACLE_ID_SUFFIX}`);

        const value = utils.parseEther("5");
        const price = await oracleInstance.getPrice();

        await deployer.sendTransaction({
            value,
            from: deployer.address,
            to: tokenInstance.address
        });

        let expectedTokenBalance = value.div(price);

        await expect(
            tokenInstance.burn(expectedTokenBalance, {})
        ).to.emit(tokenInstance, "Burn");
    });
});