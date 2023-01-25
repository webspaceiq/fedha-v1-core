import { HardhatRuntimeEnvironment } from "hardhat/types";
import { serviceExecutor } from "../../src";
import { DeployAFERC20ServiceContext } from "../../src/types";
import { DeployAFERC20Service } from "../../src/services/fedha/token/deploy-aferc20";

export class Fixtures {
    /**
     */
    public static fixture(context: Omit<DeployAFERC20ServiceContext, "hre">) {
        return async (hre: HardhatRuntimeEnvironment,) => {
            const { deployments, getNamedAccounts, ethers } = hre;
            await deployments.fixture(); // ensure you start from a fresh deployments
            const data: DeployAFERC20ServiceContext = {
                hre,
                ...context
            };
            await serviceExecutor
                .executeService<DeployAFERC20ServiceContext, Promise<void>>(
                    { data, serviceName: DeployAFERC20Service.serviceName });
        }
    }

}
