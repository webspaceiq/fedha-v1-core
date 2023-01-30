import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { parseUnits } from "ethers/lib/utils";
import { PoolAddressesProvider } from "../../../typechain";
import { ZERO_ADDRESS } from "../../helpers/constants";
import { DeployHelper } from "../../helpers/deploy-helper";
import { AAVE_POOL_ADDRESSES_PROVIDER_ID, AAVE_POOL_IMPL_ID, FEDHA_ORACLE_ID } from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class DeployFedhaOracleService {

    public static serviceName = 'DeployFedhaOracleService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { configuration, hre } = context.data;
        const { deployments, getNamedAccounts } = hre;

        const { deploy } = deployments;
        const { deployer } = await getNamedAccounts();

        const addressesProviderInstance = await DeployHelper.getDeployedContract(
            AAVE_POOL_ADDRESSES_PROVIDER_ID
        ) as PoolAddressesProvider;

        const assets: any[] = [];
        const sources: any[] = [];

        const fedhaOracleDeployment = await deploy(FEDHA_ORACLE_ID, {
            from: deployer,
            args: [
                addressesProviderInstance.address,
                assets,
                sources,
                ZERO_ADDRESS,
                parseUnits("1", configuration.OracleQuoteUnit),
            ],
            ...COMMON_DEPLOY_PARAMS,
            contract: "FedhaOracle",
        });

        // 1. Set price oracle
        await TxnHelper.waitForTx(
            await addressesProviderInstance.setPriceOracle(fedhaOracleDeployment.address)
        );
        console.log(
            `[Deployment] Added PriceOracle ${fedhaOracleDeployment.address} to PoolAddressesProvider`
        );
    }
}
export const DeployFedhaOracleServiceInfo = {
    serviceName: DeployFedhaOracleService.serviceName,
    serviceContructor: DeployFedhaOracleService
};