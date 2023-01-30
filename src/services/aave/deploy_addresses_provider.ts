import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { AAVE_POOL_ADDRESSES_PROVIDER_ID, AAVE_POOL_DATA_PROVIDER } from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";
import { PoolInitUtil } from "../../utilities/pool-init";

@IsService()
export class DeployAaveAddressesProviderService {

    public static serviceName = 'DeployAaveAddressesProviderService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { configuration, hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { deployer, addressesProviderRegistryOwner } = await getNamedAccounts();

        const { deploy } = deployments;

        // 1. Deploy PoolAddressesProvider
        // NOTE: The script passes 0 as market id to create the same address of PoolAddressesProvider
        // in multiple networks via CREATE2. Later in this script it will update the corresponding Market ID.
        const addressesProviderArtifact = await deploy(AAVE_POOL_ADDRESSES_PROVIDER_ID, {
            from: deployer,
            contract: "PoolAddressesProvider",
            args: ["0", deployer],
            ...COMMON_DEPLOY_PARAMS,
        });

        const addressesProviderInstance = (
            await hre.ethers.getContractAt(
                addressesProviderArtifact.abi, addressesProviderArtifact.address));

        // 2. Set the MarketId
        await addressesProviderInstance.setMarketId(configuration.MarketId);

        // 3. Add AddressesProvider to Registry
        await PoolInitUtil.addMarketToRegistry(hre, configuration.ProviderId, addressesProviderArtifact.address);

        // 4. Deploy AaveProtocolDataProvider getters contract
        const protocolDataProvider = await deploy(`${AAVE_POOL_DATA_PROVIDER}`, {
            from: deployer,
            contract: "AaveProtocolDataProvider",
            args: [addressesProviderArtifact.address],
            ...COMMON_DEPLOY_PARAMS,
        });

        const currentProtocolDataProvider = await addressesProviderInstance.getPoolDataProvider();

        // Set the ProtocolDataProvider if is not already set at addresses provider
        if (currentProtocolDataProvider.address !== protocolDataProvider.address) {
            await addressesProviderInstance.setPoolDataProvider(protocolDataProvider.address);
        }
    }
}
export const DeployAaveAddressesProviderServiceInfo = {
    serviceName: DeployAaveAddressesProviderService.serviceName,
    serviceContructor: DeployAaveAddressesProviderService
};