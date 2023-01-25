import { HardhatRuntimeEnvironment } from "hardhat/types";
import { serviceExecutor } from "../../src";
import { DeployChainlinkOracleAndOpratorService } from "../../src/services/fedha/oracle/deploy-chainlink";
import { DeployChainlinkTokenOracleService } from "../../src/services/fedha/oracle/deploy-chainlink-oracle";
import { DeployChainlinkOracleAndOpratorServiceContext, DeployChainlinkTokenOracleServiceContext } from "../../src/types";

export class Fixtures {

    /**
     */
    public static priceOracleWithOperatorFixture(data: Omit<DeployChainlinkOracleAndOpratorServiceContext, "hre">) {
        return async (hre: HardhatRuntimeEnvironment,) => {
            const { deployments } = hre;
            await deployments.fixture(); // ensure you start from a fresh deployments
            await serviceExecutor
                .executeService<DeployChainlinkOracleAndOpratorServiceContext, Promise<void>>(
                    { data: { hre, ...data}, serviceName: DeployChainlinkOracleAndOpratorService.serviceName });
        }
    }

    /**
     */
    public static priceOracleWithoutOperatorFixture(data: Omit<DeployChainlinkTokenOracleServiceContext, "hre">) {
        return async (hre: HardhatRuntimeEnvironment,) => {
            const { deployments } = hre;
            await deployments.fixture(); // ensure you start from a fresh deployments
            await serviceExecutor
                .executeService<DeployChainlinkTokenOracleServiceContext, Promise<void>>(
                    { data: { hre, ...data}, serviceName: DeployChainlinkTokenOracleService.serviceName });
        }
    }

}