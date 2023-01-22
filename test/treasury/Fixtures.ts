import { deployments } from "hardhat";
import { serviceExecutor } from "../../src";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployTreasuryServiceContext } from "../../src/types";
import { DeployTreasuryService } from "../../src/services/treasury/deploy";

export class Fixtures {

    /**
     * fixture
     */
    public static fixture(context: Omit<DeployTreasuryServiceContext, "hre">) {
        return async(hre: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const data: DeployTreasuryServiceContext = {
                hre,
                ...context
            };
            await serviceExecutor
                .executeService<DeployTreasuryServiceContext, Promise<void>>(
                    { data, serviceName: DeployTreasuryService.serviceName });
        }
        
    }
}
