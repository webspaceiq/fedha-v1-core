import { IServiceContext, IsService } from "@webspaceiq/service-objects";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";

@IsService()
export class DeployAaveMarketsRegistryService {

    public static serviceName = 'DeployAaveMarketsRegistryService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { treasuryAdmin, addressesProviderRegistryOwner } = await getNamedAccounts();

        const { deploy } = deployments;

        const poolAddressesProviderRegistryArtifact = await deploy('PoolAddressesProviderRegistry', {
            from: treasuryAdmin,
            args: [treasuryAdmin],
            ...COMMON_DEPLOY_PARAMS
        });
        
        const registryInstance = await hre.ethers.getContractAt(
            poolAddressesProviderRegistryArtifact.abi, poolAddressesProviderRegistryArtifact.address);

        await registryInstance.transferOwnership(addressesProviderRegistryOwner);

        deployments.log(`[Deployment] Transferred ownership of PoolAddressesProviderRegistry to: ${addressesProviderRegistryOwner} `);
    }
}
export const DeployAaveMarketsRegistryServiceInfo = {
    serviceName: DeployAaveMarketsRegistryService.serviceName,
    serviceContructor: DeployAaveMarketsRegistryService
};