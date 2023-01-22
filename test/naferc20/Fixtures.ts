import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployNAFERC20ServiceContext } from "../../src/types";
import { serviceExecutor } from "../../src";
import { DeployNAFERC20Service } from "../../src/services/token/deploy-naferc20";

export class Fixtures {
    /**
     */
    public static fixture(context: Omit<DeployNAFERC20ServiceContext, "hre">) {
        return async (hre: HardhatRuntimeEnvironment,) => {
            const { deployments, getNamedAccounts, ethers } = hre;
            await deployments.fixture(); // ensure you start from a fresh deployments
            const data: DeployNAFERC20ServiceContext = {
                hre,
                ...context
            };
            await serviceExecutor
                .executeService<DeployNAFERC20ServiceContext, Promise<void>>(
                    { data, serviceName: DeployNAFERC20Service.serviceName });
        }
    }
}
