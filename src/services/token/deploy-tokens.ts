import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployHelper } from "../../helpers/deploy-helper";
import { DeployTokensServiceContext, IAssetConfigutation } from "../../types";
import * as CONSTANTS from "../../helpers/constants";

@IsService()
export class DeployTokensService {

    public static serviceName = 'DeployTokensService';

    async execute(context: IServiceContext<DeployTokensServiceContext>): Promise<void> {
        const { assets } = context.data;
        // Only deploy assets do not already have an address configured
        const assetsToDeploy = assets.filter((asset) => asset.address === undefined);

        for (let index = 0; index < assetsToDeploy.length; index++) {
            const asset = assetsToDeploy[index];

            switch (asset.type) {
                case CONSTANTS.ASSET_TYPE_ERC20_VOTES:
                    await this.deployFERC20VotesToken(asset, context)
                    break;
                case CONSTANTS.ASSET_TYPE_ERC20:
                    await this.deployFERC20Token(asset, context)
                    break;
                case CONSTANTS.ASSET_TYPE_AFERC20:
                    await this.deployAFERC20Token(asset, context)
                    break;
                case CONSTANTS.ASSET_TYPE_NAFERC20:
                    await this.deployNAFERC20Token(asset, context)
                    break;
                default:
                    break;
            }
        }
    }

    private async deployFERC20Token(asset: IAssetConfigutation, context: IServiceContext<DeployTokensServiceContext>) {
        const { hre } = context.data;
        const { name, symbol } = asset;
        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();

        await deployments.deploy(symbol, {
            contract: "FERC20",
            from: deployer,
            args: [name, symbol],
            ...COMMON_DEPLOY_PARAMS
        });
    }

    private async deployFERC20VotesToken(
        asset: IAssetConfigutation, context: IServiceContext<DeployTokensServiceContext>) {
        const { hre } = context.data;
        const { name, symbol } = asset;
        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();

        await deployments.deploy(symbol, {
            contract: "FERC20Votes",
            from: deployer,
            args: [name, symbol],
            ...COMMON_DEPLOY_PARAMS
        });

    }

    private async deployAFERC20Token(
        asset: IAssetConfigutation, context: IServiceContext<DeployTokensServiceContext>) {
    }

    private async deployNAFERC20Token(
        asset: IAssetConfigutation, context: IServiceContext<DeployTokensServiceContext>) {
        const { hre } = context.data;
        const { name, symbol } = asset;
        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();
        const deployedPriceOracle = await DeployHelper.getDeployedPriceOracle(`${symbol}PriceOracle`);

        await deployments.deploy(symbol, {
            contract: "NAFERC20",
            from: deployer,
            args: [name, symbol, deployedPriceOracle.address],
            ...COMMON_DEPLOY_PARAMS
        });
    }
}

export const DeployTokensServiceInfo = {
    serviceName: DeployTokensService.serviceName,
    serviceContructor: DeployTokensService
};