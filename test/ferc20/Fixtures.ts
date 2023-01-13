import { ethers } from "hardhat";
import { EMPTY_STRING } from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";

export class Fixtures {

    public static async fixture() {

        // Contracts are deployed using the first signer/account by default
        const { utils } = ethers;
        const adminRole = utils.formatBytes32String(EMPTY_STRING);
        const pauserRole = utils.keccak256(utils.toUtf8Bytes("PAUSER_ROLE"));
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

        const instance = await DeployHelper.deployFERC20({
            id: DEPLOY_IDS.TEST_TOKEN_ID,
            owner: owner.address,
            name: DEPLOY_IDS.TEST_TOKEN_NAME,
            symbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL
        });

        return {
            instance,
            owner,
            otherAccount,
            thirdAccount,
            adminRole,
            pauserRole,
            name: DEPLOY_IDS.TEST_TOKEN_NAME,
            symbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL
        };

    }
    
    public static async invalidNameFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner] = await ethers.getSigners();
        const instance = await DeployHelper.deployFERC20({
            id: DEPLOY_IDS.TEST_TOKEN_ID,
            owner: owner.address,
            name: EMPTY_STRING,
            symbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL
        });

        return { instance };

    }

    public static async invalidSymbolFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner] = await ethers.getSigners();
        const instance = await DeployHelper.deployFERC20({
            id: DEPLOY_IDS.TEST_TOKEN_ID,
            owner: owner.address,
            name: DEPLOY_IDS.TEST_TOKEN_NAME,
            symbol: EMPTY_STRING
        });
        return { instance, owner };

    }
}