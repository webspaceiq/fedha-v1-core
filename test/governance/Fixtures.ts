import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { ConfigNames, MARKET_NAME } from "../../src/helpers/env";
import { ConfigUtil } from "../../src/utilities/config";

export class Fixtures {

    public static fixture() {
        return async (hre: HardhatRuntimeEnvironment,) => {
            const { deployments } = hre;
            // ensure you start from a fresh deployments
            await deployments.fixture();
            const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
            //const options = await GovernanceUtil.getDeployOptions(configuration, hre);

            /* const {
                governorInstance,
                timelockInstance,
                tokenInstance
            } = await DeployHelper.deployGovernance(options);

            return {
                tokenInstance,
                timelockInstance,
                governorInstance,
            }; */
        }
    }

}