import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { DeployHelper } from "../../helpers/deploy-helper";
import * as DEPLOY_IDS from "../../helpers/deploy-ids";
import { AaveInitHelper } from "../../helpers/init-helper";
import { DeployServiceContext, eNetwork, ITokenAddress } from "../../types";

@IsService()
export class InitializeAaveReservesService {

    public static serviceName = 'InitializeAaveReservesService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { configuration, hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();
        
        const network = (
            process.env.FORK ? process.env.FORK : hre.network.name
        ) as eNetwork;

        /* const poolConfig = (await loadPoolConfig(
            MARKET_NAME as ConfigNames
        )) as IAaveConfiguration;
 */
        const addressProviderArtifact = await deployments.get(
            DEPLOY_IDS.AAVE_POOL_ADDRESSES_PROVIDER_ID
        );

        const {
            ATokenNamePrefix,
            StableDebtTokenNamePrefix,
            VariableDebtTokenNamePrefix,
            SymbolPrefix,
            ReservesConfig,
            RateStrategies,
        } = configuration;

        // Deploy Rate Strategies
        for (const strategy in RateStrategies) {
            const strategyData = RateStrategies[strategy];
            const args = [
                addressProviderArtifact.address,
                strategyData.optimalUsageRatio,
                strategyData.baseVariableBorrowRate,
                strategyData.variableRateSlope1,
                strategyData.variableRateSlope2,
                strategyData.stableRateSlope1,
                strategyData.stableRateSlope2,
                strategyData.baseStableRateOffset,
                strategyData.stableRateExcessOffset,
                strategyData.optimalStableToTotalDebtRatio,
            ];
            await deployments.deploy(`ReserveStrategy-${strategyData.name}`, {
                from: deployer,
                args: args,
                contract: "DefaultReserveInterestRateStrategy",
                log: true,
            });
        }

        // Deploy Reserves ATokens

        const { address: treasuryAddress } = await DeployHelper.getDeployedContract(DEPLOY_IDS.AAVE_TREASURY_PROXY_ID);
        const incentivesController = await deployments.get("IncentivesProxy");
        const reservesAddresses: ITokenAddress = await DeployHelper.getAddressesOfAllAssets(configuration, network);

        if (Object.keys(reservesAddresses).length == 0) {
            console.warn("[WARNING] Skipping initialization. Empty asset list.");
            return;
        }

        await AaveInitHelper.initReservesByHelper(
            ReservesConfig,
            reservesAddresses,
            ATokenNamePrefix,
            StableDebtTokenNamePrefix,
            VariableDebtTokenNamePrefix,
            SymbolPrefix,
            deployer,
            treasuryAddress,
            incentivesController.address
        );
        deployments.log(`[Deployment] Initialized all reserves`);

        await AaveInitHelper.configureReservesByHelper(ReservesConfig, reservesAddresses);

        // Save AToken and Debt tokens artifacts
        const dataProvider = await deployments.get(DEPLOY_IDS.AAVE_POOL_DATA_PROVIDER);
        //await savePoolTokens(reservesAddresses, dataProvider.address);

        deployments.log(`[Deployment] Configured all reserves`);
    }
}
export const InitializeAaveReservesServiceInfo = {
    serviceName: InitializeAaveReservesService.serviceName,
    serviceContructor: InitializeAaveReservesService
};