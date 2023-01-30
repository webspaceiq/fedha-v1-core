import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ACLManager, PoolAddressesProvider } from "../../../typechain";
import { ZERO_BYTES_32 } from "../../helpers/constants";
import { AAVE_ACL_MANAGER_ID, AAVE_POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class DeployAaveMarketACLManagerService {

    public static serviceName = 'DeployAaveMarketACLManagerService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { deployer, poolAdmin, aclAdmin, emergencyAdmin } = await getNamedAccounts();
        const aclAdminSigner = await hre.ethers.getSigner(aclAdmin);

        const { deploy } = deployments;

        const addressesProviderArtifact = await deployments.get(`${AAVE_POOL_ADDRESSES_PROVIDER_ID}`);

        const addressesProviderInstance = (
            await hre.ethers.getContractAt(
                addressesProviderArtifact.abi,
                addressesProviderArtifact.address
            )
        ).connect(await hre.ethers.getSigner(deployer)) as PoolAddressesProvider;

        // 1. Set ACL admin at AddressesProvider
        await TxnHelper.waitForTx(await addressesProviderInstance.setACLAdmin(aclAdmin));

        // 2. Deploy ACLManager and setup administrators
        const aclManagerArtifact = await deploy(AAVE_ACL_MANAGER_ID, {
            from: deployer,
            contract: "ACLManager",
            args: [addressesProviderArtifact.address],
            ...COMMON_DEPLOY_PARAMS,
        });

        const aclManager = (
            await hre.ethers.getContractAt(
                aclManagerArtifact.abi,
                aclManagerArtifact.address
            )
        ).connect(aclAdminSigner) as ACLManager;

        // 3. Setup ACLManager at AddressesProviderInstance
        await TxnHelper.waitForTx(await addressesProviderInstance.setACLManager(aclManager.address));

        // 4. Add PoolAdmin to ACLManager contract
        await TxnHelper.waitForTx(await aclManager.connect(aclAdminSigner).addPoolAdmin(poolAdmin));

        // 5. Add EmergencyAdmin  to ACLManager contract
        await TxnHelper.waitForTx(await aclManager.connect(aclAdminSigner).addEmergencyAdmin(emergencyAdmin));

        const isACLAdmin = await aclManager.hasRole(ZERO_BYTES_32, aclAdmin);
        const isPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
        const isEmergencyAdmin = await aclManager.isEmergencyAdmin(emergencyAdmin);

        if (!isACLAdmin)
            throw "[ACL][ERROR] ACLAdmin is not setup correctly";
        if (!isPoolAdmin)
            throw "[ACL][ERROR] PoolAdmin is not setup correctly";
        if (!isEmergencyAdmin)
            throw "[ACL][ERROR] EmergencyAdmin is not setup correctly";

        console.log("== Market Admins ==");
        console.log("- ACL Admin", aclAdmin);
        console.log("- Pool Admin", poolAdmin);
        console.log("- Emergency Admin", emergencyAdmin);

    }
}
export const DeployAaveMarketACLManagerServiceInfo = {
    serviceName: DeployAaveMarketACLManagerService.serviceName,
    serviceContructor: DeployAaveMarketACLManagerService
};