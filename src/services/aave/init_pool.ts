import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { PoolAddressesProvider } from "../../../typechain";
import { ZERO_ADDRESS } from "../../helpers/constants";
import { DeployHelper } from "../../helpers/deploy-helper";
import * as DEPLOY_IDS from "../../helpers/deploy-ids";
import { DeployServiceContext } from "../../types";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class InitializeAavePoolService {

    public static serviceName = 'InitializeAavePoolService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { configuration, hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { save } = deployments;

        const { deployer } = await getNamedAccounts();

        const proxyArtifact = await deployments.getExtendedArtifact(
            "InitializableImmutableAdminUpgradeabilityProxy"
        );

        const poolImplDeployment = await deployments.get(DEPLOY_IDS.AAVE_POOL_IMPL_ID);

        const poolConfiguratorImplDeployment = await deployments.get(
            DEPLOY_IDS.AAVE_POOL_CONFIGURATOR_IMPL_ID
        );

        const { address: addressesProvider } = await deployments.get(
            DEPLOY_IDS.AAVE_POOL_ADDRESSES_PROVIDER_ID
        );

        const addressesProviderInstance =
            await DeployHelper.getDeployedContract(DEPLOY_IDS.AAVE_POOL_ADDRESSES_PROVIDER_ID) as PoolAddressesProvider;

        const isPoolProxyPending =
            (await addressesProviderInstance.getPool()) === ZERO_ADDRESS;

        // Set Pool implementation to Addresses provider and save the proxy deployment artifact at disk
        if (isPoolProxyPending) {
            const setPoolImplTx = await TxnHelper.waitForTx(
                await addressesProviderInstance.setPoolImpl(poolImplDeployment.address)
            );
            const txPoolProxyAddress = await addressesProviderInstance.getPool();
            deployments.log(
                `[Deployment] Attached Pool implementation and deployed proxy contract: `
            );
            deployments.log("- Tx hash:", setPoolImplTx.transactionHash);
        }

        const poolProxyAddress = await addressesProviderInstance.getPool();
        deployments.log("- Deployed Proxy:", poolProxyAddress);

        await save(DEPLOY_IDS.AAVE_POOL_PROXY_ID, {
            ...proxyArtifact,
            address: poolProxyAddress,
        });
        const isPoolConfiguratorProxyPending =
            (await addressesProviderInstance.getPoolConfigurator()) === ZERO_ADDRESS;

        // Set Pool Configurator to Addresses Provider proxy deployment artifact at disk
        if (isPoolConfiguratorProxyPending) {
            const setPoolConfiguratorTx = await TxnHelper.waitForTx(
                await addressesProviderInstance.setPoolConfiguratorImpl(
                    poolConfiguratorImplDeployment.address
                )
            );
            deployments.log(
                `[Deployment] Attached PoolConfigurator implementation and deployed proxy `
            );
            deployments.log("- Tx hash:", setPoolConfiguratorTx.transactionHash);
        }
        const poolConfiguratorProxyAddress =
            await addressesProviderInstance.getPoolConfigurator();

        deployments.log("- Deployed Proxy:", poolConfiguratorProxyAddress);

        await save(DEPLOY_IDS.AAVE_POOL_CONFIGURATOR_PROXY_ID, {
            ...proxyArtifact,
            address: poolConfiguratorProxyAddress,
        });

        /* // Set Flash Loan premiums
        const poolConfiguratorInstance = (
            await DeployHelper.getDeployedContract(DEPLOY_IDS.AAVE_POOL_CONFIGURATOR_IMPL_ID)
        ).connect(await hre.ethers.getSigner(deployer));

        // Set total Flash Loan Premium
        await TxnHelper.waitForTx(
            await poolConfiguratorInstance.updateFlashloanPremiumTotal(
                configuration.FlashLoanPremiums.total
            )
        );
        // Set protocol Flash Loan Premium
        await TxnHelper.waitForTx(
            await poolConfiguratorInstance.updateFlashloanPremiumToProtocol(
                configuration.FlashLoanPremiums.protocol
            )
        ); */
    }
}
export const InitializeAavePoolServiceInfo = {
    serviceName: InitializeAavePoolService.serviceName,
    serviceContructor: InitializeAavePoolService
};