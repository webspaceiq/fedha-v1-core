import { IServiceContext, IsService } from "@webspaceiq/service-objects";
import *as DEPLOY_IDS from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";

@IsService()
export class DeployUniswapFactoryV2Service {

    public static serviceName = 'DeployUniswapFactoryV2Service';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { treasuryAdmin } = await getNamedAccounts();

        const { deploy } = deployments;

        // deploy WETH
        const wethDeployment = await deploy(
            DEPLOY_IDS.UNISWAP_WETH_ID,
            {
                contract: 'WETH9',
                from: treasuryAdmin,
                ...COMMON_DEPLOY_PARAMS
            }
        );
        // deploy V2 Factory
        const factoryDeployment = await deploy(
            DEPLOY_IDS.UNISWAP_FACTORY_ID,
            {
                contract: 'UniswapV2Factory',
                from: treasuryAdmin, args: [treasuryAdmin],
                ...COMMON_DEPLOY_PARAMS
            }
        );
        // deploy V2 Factory
        await deploy(
            DEPLOY_IDS.UNISWAP_ROUTER_ID,
            {
                contract: 'UniswapV2Router02',
                from: treasuryAdmin,
                args: [factoryDeployment.address, wethDeployment.address],
                ...COMMON_DEPLOY_PARAMS
            }
        );
    }
}
export const DeployUniswapFactoryV2ServiceInfo = {
    serviceName: DeployUniswapFactoryV2Service.serviceName,
    serviceContructor: DeployUniswapFactoryV2Service
};