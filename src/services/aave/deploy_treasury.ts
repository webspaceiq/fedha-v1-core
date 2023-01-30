import { IServiceContext, IsService } from "@webspaceiq/service-objects";
import { AaveEcosystemReserveController__factory, AaveEcosystemReserveV2, AaveEcosystemReserveV2__factory, InitializableAdminUpgradeabilityProxy, InitializableAdminUpgradeabilityProxy__factory } from "../../../typechain";
import { ZERO_ADDRESS } from "../../helpers/constants";
import { AAVE_TREASURY_CONTROLLER_ID, AAVE_TREASURY_IMPL_ID, AAVE_TREASURY_PROXY_ID } from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from "../../helpers/env";
import { DeployServiceContext, eNetwork } from "../../types";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class DeployAaveTreasuryService {

    public static serviceName = 'DeployAaveTreasuryService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { treasuryAdmin, addressesProviderRegistryOwner } = await getNamedAccounts();

        const { deploy, save } = deployments;
        const { deployer } = await getNamedAccounts();
       

        // Deploy Treasury proxy
        const treasuryProxyArtifact = await deploy(AAVE_TREASURY_PROXY_ID, {
            from: deployer,
            contract: "InitializableAdminUpgradeabilityProxy",
            args: [],
        });

        // Deploy Treasury Controller
        const treasuryController = await deploy(AAVE_TREASURY_CONTROLLER_ID, {
            from: deployer,
            contract: "AaveEcosystemReserveController",
            args: [treasuryAdmin],
            ...COMMON_DEPLOY_PARAMS,
        });

        // Deploy Treasury implementation and initialize proxy
        const treasuryImplArtifact = await deploy(AAVE_TREASURY_IMPL_ID, {
            from: deployer,
            contract: "AaveEcosystemReserveV2",
            args: [],
            ...COMMON_DEPLOY_PARAMS,
        });

        const treasuryImpl = (await hre.ethers.getContractAt(
            treasuryImplArtifact.abi,
            treasuryImplArtifact.address
        )) as AaveEcosystemReserveV2;

        // Call to initialize at implementation contract to prevent other calls.
        await TxnHelper.waitForTx(await treasuryImpl.initialize(ZERO_ADDRESS));

        // Initialize proxy
        const proxy = (await hre.ethers.getContractAt(
            treasuryProxyArtifact.abi,
            treasuryProxyArtifact.address
        )) as InitializableAdminUpgradeabilityProxy;

        const initializePayload = treasuryImpl.interface.encodeFunctionData(
            "initialize",
            [treasuryController.address]
        );

        await TxnHelper.waitForTx(
            await proxy["initialize(address,address,bytes)"](
                treasuryImplArtifact.address,
                treasuryAdmin,
                initializePayload
            )
        );
    }
}
export const DeployAaveTreasuryServiceInfo = {
    serviceName: DeployAaveTreasuryService.serviceName,
    serviceContructor: DeployAaveTreasuryService
};