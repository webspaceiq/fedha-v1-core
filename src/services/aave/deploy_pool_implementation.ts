import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { DeployHelper } from "../../helpers/deploy-helper";
import { AAVE_POOL_ADDRESSES_PROVIDER_ID, AAVE_POOL_IMPL_ID } from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";
import { PoolInitUtil } from "../../utilities/pool-init";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class DeployAavePoolImplementationService {

    public static serviceName = 'DeployAavePoolImplementationService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();

        const { deploy } = deployments;

        const commonLibraries = await PoolInitUtil.getPoolLibraries(hre);
        const addressesProviderDeployment = await hre.deployments.get(AAVE_POOL_ADDRESSES_PROVIDER_ID);

        await deploy(`${AAVE_POOL_IMPL_ID}`, {
            contract: "Pool",
            from: deployer,
            args: [addressesProviderDeployment.address],
            libraries: {
                ...commonLibraries,
            },
            ...COMMON_DEPLOY_PARAMS,
        });

        const poolInstance = await DeployHelper.getDeployedContract(AAVE_POOL_IMPL_ID);

        await TxnHelper.waitForTx(
            await poolInstance.initialize(addressesProviderDeployment.address)
        );
        console.log("Initialized Pool Implementation");
    }
}
export const DeployAavePoolImplementationServiceInfo = {
    serviceName: DeployAavePoolImplementationService.serviceName,
    serviceContructor: DeployAavePoolImplementationService
};