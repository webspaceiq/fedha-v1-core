import { deployments } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { ZERO_ADDRESS } from "../../src/helpers/constants";

export type FERC20Options = {
    id: string;
    name: string;
    symbol: string;
}

export class Fixtures {

    public static fixture(options: FERC20Options) {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin, other } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const assetInstance = await DeployHelper.deployFERC20(
                DEPLOY_IDS.TEST_ASSET_ID,
                treasuryAdmin,
                DEPLOY_IDS.TEST_ASSET_NAME,
                DEPLOY_IDS.TEST_ASSET_SYMBOL
            );

            const assetTokenInstance = await DeployHelper.deployAFERC20({
                ...options,
                owner: treasuryAdmin,
                assetAddr: assetInstance.address,
                oracleAddr: oracleInstance.address
            });

            return { 
                other,
                assetTokenInstance, 
                treasuryAdmin, 
                assetInstance, 
                oracleInstance 
            };
        }
    }

    public static invalidOracleAddrFixtureImpl(options: FERC20Options) {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const { treasuryAdmin } = await getNamedAccounts();
            const zeroAddr = ethers.utils.getAddress(ZERO_ADDRESS);

            const assetInstance = await DeployHelper.deployFERC20(
                DEPLOY_IDS.TEST_ASSET_ID,
                treasuryAdmin,
                DEPLOY_IDS.TEST_ASSET_NAME,
                DEPLOY_IDS.TEST_ASSET_SYMBOL
            );

            const assetTokenInstance = await DeployHelper.deployAFERC20({
                ...options,
                owner: treasuryAdmin,
                assetAddr: assetInstance.address,
                oracleAddr: zeroAddr
            });

            return { assetTokenInstance, treasuryAdmin, assetInstance, zeroAddr };
        }
    }

    public static invalidAssetAddrFixtureImpl(options: FERC20Options) {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const { treasuryAdmin } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const assetInstance = await DeployHelper.deployFERC20(
                DEPLOY_IDS.TEST_ASSET_ID,
                treasuryAdmin,
                DEPLOY_IDS.TEST_ASSET_NAME,
                DEPLOY_IDS.TEST_ASSET_SYMBOL
            );

            const assetTokenInstance = await DeployHelper.deployAFERC20({
                ...options,
                owner: treasuryAdmin,
                assetAddr: ethers.utils.getAddress(ZERO_ADDRESS),
                oracleAddr: oracleInstance.address
            });

            return { assetTokenInstance, treasuryAdmin, assetInstance, oracleInstance };
        }
    }
}
