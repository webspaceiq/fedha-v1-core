import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { DeployHelper } from "../../helpers/deploy-helper";
import { AAVE_POOL_ADDRESSES_PROVIDER_ID, AAVE_POOL_CONFIGURATOR_IMPL_ID, AAVE_RESERVES_SETUP_HELPER_ID } from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class DeployAavePoolConfiguratorService {

    public static serviceName = 'DeployAavePoolConfiguratorService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { hre } = context.data;
        const { deployments, getNamedAccounts, } = hre;
        const { deployer } = await getNamedAccounts();

        const { deploy, get } = deployments;

        const configuratorLogicArtifact = await get("ConfiguratorLogic");
        const { address: addressesProviderAddress } = await deployments.get(AAVE_POOL_ADDRESSES_PROVIDER_ID);

        const poolConfiguratorArtifact = await deploy(
            `${AAVE_POOL_CONFIGURATOR_IMPL_ID}`, {
            contract: "PoolConfigurator",
            from: deployer,
            args: [],
            libraries: {
                ConfiguratorLogic: configuratorLogicArtifact.address,
            },
            ...COMMON_DEPLOY_PARAMS,
        });

        // Initialize implementation
        const poolConfig = await DeployHelper.getPoolConfiguratorProxy(poolConfiguratorArtifact.address);
        await TxnHelper.waitForTx(await poolConfig.initialize(addressesProviderAddress));
        console.log("Initialized PoolConfigurator Implementation");

        await deploy(
            `${AAVE_RESERVES_SETUP_HELPER_ID}`, {
            from: deployer,
            args: [],
            contract: "ReservesSetupHelper",
            ...COMMON_DEPLOY_PARAMS,
        });
    }
}
export const DeployAavePoolConfiguratorServiceInfo = {
    serviceName: DeployAavePoolConfiguratorService.serviceName,
    serviceContructor: DeployAavePoolConfiguratorService
};