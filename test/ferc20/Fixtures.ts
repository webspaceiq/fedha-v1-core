import { deployments, ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { serviceExecutor } from "../../src";
import { DeployFERC20Service } from "../../src/services/fedha/token/deploy-ferc20";
import { DeployFERC20ServiceContext } from "../../src/types";

export type FixtureContext = Omit<DeployFERC20ServiceContext, "hre">;

export class Fixtures {

    /**
     * fixture
     */
    public static fixture(context: Omit<DeployFERC20ServiceContext, "hre">) {
        return async(hre: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const data: DeployFERC20ServiceContext = {
                hre,
                ...context
            };
            await serviceExecutor
                .executeService<DeployFERC20ServiceContext, Promise<void>>(
                    { data, serviceName: DeployFERC20Service.serviceName });
        }
        
    }
}