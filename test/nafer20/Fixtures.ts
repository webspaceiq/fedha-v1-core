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
            const { treasuryAdmin, other } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const tokenInstance = await DeployHelper.deployNAFERC20({
                ...options, owner: treasuryAdmin, oracleAddr: oracleInstance.address
            });
            return {
                other,
                treasuryAdmin,
                tokenInstance,
                oracleInstance
            };
        }
    }

    public static invalidOracleAddrFixtureImpl(options: FERC20Options) {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const { treasuryAdmin } = await getNamedAccounts();
            const zeroAddr = ethers.utils.getAddress(ZERO_ADDRESS);

            const tokenInstance = await DeployHelper.deployNAFERC20({
                ...options, owner: treasuryAdmin, oracleAddr: zeroAddr
            });
            return { tokenInstance, treasuryAdmin, zeroAddr };
        }
    }
}
