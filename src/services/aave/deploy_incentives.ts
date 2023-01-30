import { IServiceContext, IsService } from "@webspaceiq/service-objects";
import { EmissionManager, PoolAddressesProvider, RewardsController } from "../../../typechain";
import { ZERO_ADDRESS } from "../../helpers/constants";
import { DeployHelper } from "../../helpers/deploy-helper";
import * as DEPLOY_IDS from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext, eNetwork } from "../../types";
import { ConfigUtil } from "../../utilities/config";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class DeployAaveIncentivesService {

    public static serviceName = 'DeployAaveIncentivesService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        const { configuration, hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { save, deploy } = deployments;
        const network = (
            process.env.FORK ? process.env.FORK : hre.network.name
        ) as eNetwork;
        const isLive = hre.config.networks[network].live;
        const { deployer, incentivesRewardsVault, incentivesEmissionManager } =
            await getNamedAccounts();

        const proxyArtifact = await deployments.getExtendedArtifact(
            "InitializableImmutableAdminUpgradeabilityProxy"
        );

        const { address: addressesProvider } = await deployments.get(
            DEPLOY_IDS.AAVE_POOL_ADDRESSES_PROVIDER_ID
        );

        const addressesProviderInstance = (
            await DeployHelper.getDeployedContract(DEPLOY_IDS.AAVE_POOL_ADDRESSES_PROVIDER_ID)
        ) as PoolAddressesProvider;

        // Deploy EmissionManager
        const emissionManagerArtifact = await deploy(DEPLOY_IDS.AAVE_EMISSION_MANAGER_ID, {
            from: deployer,
            contract: "EmissionManager",
            args: [deployer],
            ...COMMON_DEPLOY_PARAMS,
        });
        const emissionManager = (await hre.ethers.getContractAt(
            emissionManagerArtifact.abi,
            emissionManagerArtifact.address
        )) as EmissionManager;

        // Deploy Incentives Implementation
        const incentivesImplArtifact = await deploy(DEPLOY_IDS.AAVE_INCENTIVES_V2_IMPL_ID, {
            from: deployer,
            contract: "RewardsController",
            args: [emissionManagerArtifact.address],
            ...COMMON_DEPLOY_PARAMS,
        });
        const incentivesImpl = (await hre.ethers.getContractAt(
            incentivesImplArtifact.abi,
            incentivesImplArtifact.address
        )) as RewardsController;

        // Call to initialize at implementation contract to prevent others.
        await TxnHelper.waitForTx(await incentivesImpl.initialize(ZERO_ADDRESS));

        // The Rewards Controller must be set at PoolAddressesProvider with id keccak256("INCENTIVES_CONTROLLER"):
        // 0x703c2c8634bed68d98c029c18f310e7f7ec0e5d6342c590190b3cb8b3ba54532
        const incentivesControllerId = hre.ethers.utils.keccak256(
            hre.ethers.utils.toUtf8Bytes("INCENTIVES_CONTROLLER")
        );

        const isRewardsProxyPending =
            (await addressesProviderInstance.getAddress(incentivesControllerId)) ===
            ZERO_ADDRESS;

        if (isRewardsProxyPending) {
            const setRewardsAsProxyTx = await TxnHelper.waitForTx(
                await addressesProviderInstance.setAddressAsProxy(
                    incentivesControllerId,
                    incentivesImpl.address
                )
            );

            const proxyAddress = await addressesProviderInstance.getAddress(
                incentivesControllerId
            );
            await save(DEPLOY_IDS.AAVE_INCENTIVES_PROXY_ID, {
                ...proxyArtifact,
                address: proxyAddress,
            });

            deployments.log(
                `[Deployment] Attached Rewards implementation and deployed proxy contract: `
            );
            deployments.log("- Tx hash:", setRewardsAsProxyTx.transactionHash);
        }

        const { address: rewardsProxyAddress } = await deployments.get(
            DEPLOY_IDS.AAVE_INCENTIVES_PROXY_ID
        );

        // Init RewardsController address
        await TxnHelper.waitForTx(
            await emissionManager.setRewardsController(rewardsProxyAddress)
        );

        if (!isLive) {
            await deploy(DEPLOY_IDS.AAVE_INCENTIVES_PULL_REWARDS_STRATEGY_ID, {
                from: deployer,
                contract: "PullRewardsTransferStrategy",
                args: [
                    rewardsProxyAddress,
                    incentivesEmissionManager,
                    incentivesRewardsVault,
                ],
                ...COMMON_DEPLOY_PARAMS,
            });
            /* const stakedAaveAddress = isLive
                ? ConfigUtil.getParamPerNetwork(configuration.StkAaveProxy, network)
                : (await deployments.getOrNull(DEPLOY_IDS.AAVE_STAKE_AAVE_PROXY))?.address;

            if (stakedAaveAddress) {
                await deploy(DEPLOY_IDS.AAVE_INCENTIVES_STAKED_TOKEN_STRATEGY_ID, {
                    from: deployer,
                    contract: "StakedTokenTransferStrategy",
                    args: [
                        rewardsProxyAddress,
                        incentivesEmissionManager,
                        stakedAaveAddress,
                    ],
                    ...COMMON_DEPLOY_PARAMS,
                });
            } else {
                console.log(
                    "[WARNING] Missing StkAave address. Skipping StakedTokenTransferStrategy deployment."
                );
            } */
        }

        // Transfer emission manager ownership

        await TxnHelper.waitForTx(
            await emissionManager.transferOwnership(incentivesEmissionManager)
        );
    }
}
export const DeployAaveIncentivesServiceInfo = {
    serviceName: DeployAaveIncentivesService.serviceName,
    serviceContructor: DeployAaveIncentivesService
};