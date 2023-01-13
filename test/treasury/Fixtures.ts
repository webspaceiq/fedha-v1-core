import { deployments } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { ZERO_ADDRESS } from "../../src/helpers/constants";
import { FERC20Options } from "../../src/types";


export class Fixtures {

    public static fixture(options: FERC20Options) {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin, other } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const tokenInstance = await DeployHelper.deployFERC20({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL
            });

            const treasuryInstance = await DeployHelper.deployTreasury({
                ...options,
                owner: treasuryAdmin,
                tokenAddr: tokenInstance.address,
                oracleAddr: oracleInstance.address
            });

            return { 
                other,
                treasuryInstance, 
                treasuryAdmin, 
                tokenInstance, 
                oracleInstance 
            };
        }
    }
}
