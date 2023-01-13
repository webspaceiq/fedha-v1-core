import { ethers } from "hardhat";
import { EMPTY_STRING } from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { TEST_ASSET_ID, TEST_ASSET_SYMBOL, TEST_TOKEN_NAME } from "../../src/helpers/deploy-ids";

export class Fixtures {

    public static async fixture() {

        // Contracts are deployed using the first signer/account by default
        const { utils } = ethers;
        const adminRole = utils.formatBytes32String(EMPTY_STRING);
        const pauserRole = utils.keccak256(utils.toUtf8Bytes("PAUSER_ROLE"));
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

        const instance = await DeployHelper.deployFERC20(
            TEST_ASSET_ID,
            owner.address,
            TEST_TOKEN_NAME,
            TEST_ASSET_SYMBOL
        );

        return {
            instance,
            owner,
            otherAccount,
            thirdAccount,
            adminRole,
            pauserRole,
            name: TEST_TOKEN_NAME,
            symbol: TEST_ASSET_SYMBOL
        };

    }
    public static async invalidNameFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner] = await ethers.getSigners();
        const instance = await DeployHelper.deployFERC20(
            TEST_ASSET_ID,
            owner.address,
            EMPTY_STRING,
            TEST_ASSET_SYMBOL
        );

        return { instance };

    }
    public static async invalidSymbolFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner] = await ethers.getSigners();
        const instance = await DeployHelper.deployFERC20(
            TEST_ASSET_ID,
            owner.address,
            TEST_TOKEN_NAME,
            EMPTY_STRING
        );
        return { instance, owner };

    }
}