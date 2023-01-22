import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { BigNumber } from "ethers";
import * as TYPES from "../../types";
import { serviceExecutor } from "../..";
import { IPriceOracle } from "../../../typechain";
import { ConfigUtil } from "../../utilities/config";
import * as CONSTANTS from "../../helpers/constants";
import { PRICE_ORACLE_ID_SUFFIX } from "../../helpers/deploy-ids";
import { DeploySimplePriceOracleService } from "./deploy-simple";
import { DeployChainlinkOracleAndOpratorService } from "./deploy-chainlink";

/**
 * This service deploys all types price oracles 
 * configured for a specfic market
 */
@IsService()
export class DeployOraclesService {

    public static serviceName = 'DeployOraclesService';

    async execute(context: IServiceContext<TYPES.DeployServiceContext>): Promise<void> {
        const { configuration } = context.data;

        const assetSymbols = Object.keys(configuration.PriceOracles);

        for (let index = 0; index < assetSymbols.length; index++) {
            const assetSymbol = assetSymbols[index];
            const { type } = configuration.PriceOracles[assetSymbol];
    
            switch (type) {
                case CONSTANTS.ORACLE_TYPE_SIMPLE:
                    await this.deploySimpleOracle(assetSymbol, configuration, context)
                    break;
                case CONSTANTS.ORACLE_TYPE_CHAINLINK:
                    await this.deployChainlinkOracle(assetSymbol, configuration, context)
                    break;
                default:
                    break;
            }
        }
    }

    private async deploySimpleOracle(
        assetSymbol: string,
        configuration: TYPES.IFedhaConfiguration,
        context: IServiceContext<TYPES.DeployServiceContext>) {

        const { hre } = context.data;
        const { price } = configuration.PriceOracles[assetSymbol];

        await serviceExecutor
            .executeService<TYPES.DeploySimplePriceOracleServiceContext, Promise<IPriceOracle>>(
                {
                    data: {
                        id: `${assetSymbol}${PRICE_ORACLE_ID_SUFFIX}`,
                        hre,
                        configuration,
                        price: BigNumber.from(price),
                    }, serviceName: DeploySimplePriceOracleService.serviceName
                }
            );
    }

    private async deployChainlinkOracle(
        assetSymbol: string,
        configuration: TYPES.IFedhaConfiguration,
        context: IServiceContext<TYPES.DeployServiceContext>) {

        const { hre } = context.data;
        const { jobId, httpUrl } = configuration.PriceOracles[assetSymbol];

        const network = (
            process.env.FORK ? process.env.FORK : hre.network.name
        ) as TYPES.eNetwork;

        const linkTokenAddr = ConfigUtil
            .getRequiredParamPerNetwork<string>(configuration, "LinkTokenConfig", network);

        await serviceExecutor
            .executeService<TYPES.DeployChainlinkOracleAndOpratorServiceContext, Promise<IPriceOracle>>(
                {
                    data: {
                        id: `${assetSymbol}${PRICE_ORACLE_ID_SUFFIX}`,
                        hre,
                        jobId,
                        httpUrl,
                        linkTokenAddr,
                        configuration,
                    }, serviceName: DeployChainlinkOracleAndOpratorService.serviceName
                }
            );
    }
}

export const DeployOraclesServiceInfo = {
    serviceName: DeployOraclesService.serviceName,
    serviceContructor: DeployOraclesService
};