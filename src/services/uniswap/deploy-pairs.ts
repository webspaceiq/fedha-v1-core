import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { DeployHelper } from "../../helpers/deploy-helper";
import { UNISWAP_FACTORY_ID } from "../../helpers/deploy-ids";
import { DeployUniswapPairsV2ServiceContext } from "../../types";

@IsService()
export class DeployUniswapPairsV2Service {

    public static serviceName = 'DeployUniswapPairsV2Service';

    async execute(context: IServiceContext<DeployUniswapPairsV2ServiceContext>): Promise<void> {
        const { assetPairs } = context.data;
        const uniswapFactoryInstance = await DeployHelper.getDeployedContract(UNISWAP_FACTORY_ID);
        
        for (let index = 0; index < assetPairs.length; index++) {
            const pair = assetPairs[index];
            // Create pair
            const tokenA = await DeployHelper.getDeployedERC20Token(pair.tokenA);
            const tokenB = await DeployHelper.getDeployedERC20Token(pair.tokenB);
            
            console.log(`Deploying uniswap pair: ${pair.tokenA}:${pair.tokenB}`);

            await uniswapFactoryInstance.createPair(tokenA.address, tokenB.address);
        }
    }
}

export const DeployUniswapPairsV2ServiceInfo = {
    serviceName: DeployUniswapPairsV2Service.serviceName,
    serviceContructor: DeployUniswapPairsV2Service
};