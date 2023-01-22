import { HardhatRuntimeEnvironment } from "hardhat/types";
import { serviceExecutor } from "../../src";
import { DeployChainlinkOracleAndOpratorService } from "../../src/services/oracle/deploy-chainlink";
import { DeployChainlinkPriceOracleService } from "../../src/services/oracle/deploy-chainlink-oracle";
import { DeployChainlinkOracleAndOpratorServiceContext, DeployChainlinkPriceOracleServiceContext } from "../../src/types";

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
    public static priceOracleWithoutOperatorFixture(data: Omit<DeployChainlinkPriceOracleServiceContext, "hre">) {
        return async (hre: HardhatRuntimeEnvironment,) => {
            const { deployments } = hre;
            await deployments.fixture(); // ensure you start from a fresh deployments
            await serviceExecutor
                .executeService<DeployChainlinkPriceOracleServiceContext, Promise<void>>(
                    { data: { hre, ...data}, serviceName: DeployChainlinkPriceOracleService.serviceName });
        }
    }

}