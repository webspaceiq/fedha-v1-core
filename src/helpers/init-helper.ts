import { BigNumberish } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { AaveProtocolDataProvider, ACLManager, Pool, PoolAddressesProvider, PoolConfigurator } from "../../typechain";
import { eContractid, iMultiPoolsAssets, IReserveParams, tEthereumAddress } from "../types";
import { TxnHelper } from "../utilities/transaction";
import { chunk } from "../utilities/utils";
import { ZERO_ADDRESS } from "./constants";
import { AAVE_ACL_MANAGER_ID, AAVE_ATOKEN_IMPL_ID, AAVE_DELEGATION_AWARE_ATOKEN_IMPL_ID, AAVE_POOL_ADDRESSES_PROVIDER_ID, AAVE_POOL_CONFIGURATOR_IMPL_ID, AAVE_POOL_CONFIGURATOR_PROXY_ID, AAVE_POOL_DATA_PROVIDER, AAVE_POOL_IMPL_ID, AAVE_RESERVES_SETUP_HELPER_ID, AAVE_STABLE_DEBT_TOKEN_IMPL_ID, AAVE_VARIABLE_DEBT_TOKEN_IMPL_ID } from "./deploy-ids";

export class AaveInitHelper {
    public static async initReservesByHelper(
        reservesParams: iMultiPoolsAssets<IReserveParams>,
        tokenAddresses: { [symbol: string]: tEthereumAddress },
        aTokenNamePrefix: string,
        stableDebtTokenNamePrefix: string,
        variableDebtTokenNamePrefix: string,
        symbolPrefix: string,
        admin: tEthereumAddress,
        treasuryAddress: tEthereumAddress,
        incentivesController: tEthereumAddress
    ) {
        /* const poolConfig = (await loadPoolConfig(
            MARKET_NAME as ConfigNames
        )) as IAaveConfiguration; */
        const addressProviderArtifact = await deployments.get(
            AAVE_POOL_ADDRESSES_PROVIDER_ID
        );
        const addressProvider = (
            await ethers.getContractAt(
                addressProviderArtifact.abi,
                addressProviderArtifact.address
            )
        ).connect(await ethers.getSigner(admin)) as PoolAddressesProvider;

        const poolArtifact = await deployments.get(AAVE_POOL_IMPL_ID);
        const pool = (await ethers.getContractAt(
            poolArtifact.abi,
            await addressProvider.getPool()
        )) as any as Pool;

        // CHUNK CONFIGURATION
        const initChunks = 3;

        // Initialize variables for future reserves initialization
        let reserveTokens: string[] = [];
        let reserveInitDecimals: string[] = [];
        let reserveSymbols: string[] = [];

        let initInputParams: {
            aTokenImpl: string;
            stableDebtTokenImpl: string;
            variableDebtTokenImpl: string;
            underlyingAssetDecimals: BigNumberish;
            interestRateStrategyAddress: string;
            underlyingAsset: string;
            treasury: string;
            incentivesController: string;
            underlyingAssetName: string;
            aTokenName: string;
            aTokenSymbol: string;
            variableDebtTokenName: string;
            variableDebtTokenSymbol: string;
            stableDebtTokenName: string;
            stableDebtTokenSymbol: string;
            params: string;
        }[] = [];

        let strategyAddresses: Record<string, tEthereumAddress> = {};
        let strategyAddressPerAsset: Record<string, string> = {};
        let aTokenType: Record<string, string> = {};
        let delegationAwareATokenImplementationAddress = "";
        let aTokenImplementationAddress = "";
        let stableDebtTokenImplementationAddress = "";
        let variableDebtTokenImplementationAddress = "";

        stableDebtTokenImplementationAddress = (
            await deployments.get(AAVE_STABLE_DEBT_TOKEN_IMPL_ID)
        ).address;
        variableDebtTokenImplementationAddress = await (
            await deployments.get(AAVE_VARIABLE_DEBT_TOKEN_IMPL_ID)
        ).address;

        aTokenImplementationAddress = (await deployments.get(AAVE_ATOKEN_IMPL_ID))
            .address;

        const delegatedAwareReserves = Object.entries(reservesParams).filter(
            ([_, { aTokenImpl }]) => aTokenImpl === eContractid.DelegationAwareAToken
        ) as [string, IReserveParams][];

        if (delegatedAwareReserves.length > 0) {
            delegationAwareATokenImplementationAddress = (
                await deployments.get(AAVE_DELEGATION_AWARE_ATOKEN_IMPL_ID)
            ).address;
        }

        const reserves = Object.entries(reservesParams).filter(
            ([_, { aTokenImpl }]) =>
                aTokenImpl === eContractid.DelegationAwareAToken ||
                aTokenImpl === eContractid.AToken
        ) as [string, IReserveParams][];

        for (let [symbol, params] of reserves) {
            if (!tokenAddresses[symbol]) {
                console.log(
                    `- Skipping init of ${symbol} due token address is not set at markets config`
                );
                continue;
            }
            const poolReserve = await pool.getReserveData(tokenAddresses[symbol]);
            if (poolReserve.aTokenAddress !== ZERO_ADDRESS) {
                console.log(`- Skipping init of ${symbol} due is already initialized`);
                continue;
            }
            const { strategy, aTokenImpl, reserveDecimals } = params;
            if (!strategyAddresses[strategy.name]) {
                // Strategy does not exist, load it
                strategyAddresses[strategy.name] = (
                    await deployments.get(`ReserveStrategy-${strategy.name}`)
                ).address;
            }
            strategyAddressPerAsset[symbol] = strategyAddresses[strategy.name];
            console.log(
                "Strategy address for asset %s: %s",
                symbol,
                strategyAddressPerAsset[symbol]
            );

            if (aTokenImpl === eContractid.AToken) {
                aTokenType[symbol] = "generic";
            } else if (aTokenImpl === eContractid.DelegationAwareAToken) {
                aTokenType[symbol] = "delegation aware";
            }

            reserveInitDecimals.push(reserveDecimals);
            reserveTokens.push(tokenAddresses[symbol]);
            reserveSymbols.push(symbol);
        }

        for (let i = 0; i < reserveSymbols.length; i++) {
            let aTokenToUse: string;
            if (aTokenType[reserveSymbols[i]] === "generic") {
                aTokenToUse = aTokenImplementationAddress;
            } else {
                aTokenToUse = delegationAwareATokenImplementationAddress;
            }

            initInputParams.push({
                aTokenImpl: aTokenToUse,
                stableDebtTokenImpl: stableDebtTokenImplementationAddress,
                variableDebtTokenImpl: variableDebtTokenImplementationAddress,
                underlyingAssetDecimals: reserveInitDecimals[i],
                interestRateStrategyAddress: strategyAddressPerAsset[reserveSymbols[i]],
                underlyingAsset: reserveTokens[i],
                treasury: treasuryAddress,
                incentivesController,
                underlyingAssetName: reserveSymbols[i],
                aTokenName: `Aave ${aTokenNamePrefix} ${reserveSymbols[i]}`,
                aTokenSymbol: `a${symbolPrefix}${reserveSymbols[i]}`,
                variableDebtTokenName: `Aave ${variableDebtTokenNamePrefix} Variable Debt ${reserveSymbols[i]}`,
                variableDebtTokenSymbol: `variableDebt${symbolPrefix}${reserveSymbols[i]}`,
                stableDebtTokenName: `Aave ${stableDebtTokenNamePrefix} Stable Debt ${reserveSymbols[i]}`,
                stableDebtTokenSymbol: `stableDebt${symbolPrefix}${reserveSymbols[i]}`,
                params: "0x10",
            });
        }

        // Deploy init reserves per chunks
        const chunkedSymbols = chunk(reserveSymbols, initChunks);
        const chunkedInitInputParams = chunk(initInputParams, initChunks);

        const proxyArtifact = await deployments.get(AAVE_POOL_CONFIGURATOR_PROXY_ID);
        const configuratorArtifact = await deployments.get(
            AAVE_POOL_CONFIGURATOR_IMPL_ID
        );
        const configurator = (
            await ethers.getContractAt(
                configuratorArtifact.abi,
                proxyArtifact.address
            )
        ).connect(await ethers.getSigner(admin)) as PoolConfigurator;

        console.log(
            `- Reserves initialization in ${chunkedInitInputParams.length} txs`
        );
        for (
            let chunkIndex = 0;
            chunkIndex < chunkedInitInputParams.length;
            chunkIndex++
        ) {
            const tx = await TxnHelper.waitForTx(
                await configurator.initReserves(chunkedInitInputParams[chunkIndex])
            );

            console.log(
                `  - Reserve ready for: ${chunkedSymbols[chunkIndex].join(", ")}`,
                `\n    - Tx hash: ${tx.transactionHash}`
            );
        }
    };

    public static async configureReservesByHelper(
        reservesParams: iMultiPoolsAssets<IReserveParams>,
        tokenAddresses: { [symbol: string]: tEthereumAddress }
    ) {
        const { deployer } = await getNamedAccounts();
        const addressProviderArtifact = await deployments.get(
            AAVE_POOL_ADDRESSES_PROVIDER_ID
        );
        const addressProvider = (await ethers.getContractAt(
            addressProviderArtifact.abi,
            addressProviderArtifact.address
        )) as PoolAddressesProvider;

        const aclManagerArtifact = await deployments.get(AAVE_ACL_MANAGER_ID);
        const aclManager = (await ethers.getContractAt(
            aclManagerArtifact.abi,
            await addressProvider.getACLManager()
        )) as ACLManager;

        const reservesSetupArtifact = await deployments.get(
            AAVE_RESERVES_SETUP_HELPER_ID
        );
        const reservesSetupHelper = (
            await ethers.getContractAt(
                reservesSetupArtifact.abi,
                reservesSetupArtifact.address
            )
        ).connect(await ethers.getSigner(deployer));

        const protocolDataArtifact = await deployments.get(AAVE_POOL_DATA_PROVIDER);
        const protocolDataProvider = (await ethers.getContractAt(
            protocolDataArtifact.abi,
            (
                await deployments.get(AAVE_POOL_DATA_PROVIDER)
            ).address
        )) as AaveProtocolDataProvider;

        const tokens: string[] = [];
        const symbols: string[] = [];

        const inputParams: {
            asset: string;
            baseLTV: BigNumberish;
            liquidationThreshold: BigNumberish;
            liquidationBonus: BigNumberish;
            reserveFactor: BigNumberish;
            borrowCap: BigNumberish;
            supplyCap: BigNumberish;
            stableBorrowingEnabled: boolean;
            borrowingEnabled: boolean;
            flashLoanEnabled: boolean;
        }[] = [];

        for (const [
            assetSymbol,
            {
                baseLTVAsCollateral,
                liquidationBonus,
                liquidationThreshold,
                reserveFactor,
                borrowCap,
                supplyCap,
                stableBorrowRateEnabled,
                borrowingEnabled,
                flashLoanEnabled,
            },
        ] of Object.entries(reservesParams) as [string, IReserveParams][]) {
            if (!tokenAddresses[assetSymbol]) {
                console.log(
                    `- Skipping init of ${assetSymbol} due token address is not set at markets config`
                );
                continue;
            }
            if (baseLTVAsCollateral === "-1") continue;

            const assetAddressIndex = Object.keys(tokenAddresses).findIndex(
                (value) => value === assetSymbol
            );
            const [, tokenAddress] = (
                Object.entries(tokenAddresses) as [string, string][]
            )[assetAddressIndex];
            const { usageAsCollateralEnabled: alreadyEnabled } =
                await protocolDataProvider.getReserveConfigurationData(tokenAddress);

            if (alreadyEnabled) {
                console.log(
                    `- Reserve ${assetSymbol} is already enabled as collateral, skipping`
                );
                continue;
            }
            // Push data

            inputParams.push({
                asset: tokenAddress,
                baseLTV: baseLTVAsCollateral,
                liquidationThreshold,
                liquidationBonus,
                reserveFactor,
                borrowCap,
                supplyCap,
                stableBorrowingEnabled: stableBorrowRateEnabled,
                borrowingEnabled: borrowingEnabled,
                flashLoanEnabled: flashLoanEnabled,
            });

            tokens.push(tokenAddress);
            symbols.push(assetSymbol);
        }
        if (tokens.length) {
            // Set aTokenAndRatesDeployer as temporal admin
            const aclAdmin = await ethers.getSigner(
                await addressProvider.getACLAdmin()
            );
            await TxnHelper.waitForTx(
                await aclManager
                    .connect(aclAdmin)
                    .addRiskAdmin(reservesSetupHelper.address)
            );

            // Deploy init per chunks
            const enableChunks = 20;
            const chunkedSymbols = chunk(symbols, enableChunks);
            const chunkedInputParams = chunk(inputParams, enableChunks);
            const poolConfiguratorAddress = await addressProvider.getPoolConfigurator();

            console.log(`- Configure reserves in ${chunkedInputParams.length} txs`);
            for (
                let chunkIndex = 0;
                chunkIndex < chunkedInputParams.length;
                chunkIndex++
            ) {
                const tx = await TxnHelper.waitForTx(
                    await reservesSetupHelper.configureReserves(
                        poolConfiguratorAddress,
                        chunkedInputParams[chunkIndex]
                    )
                );
                console.log(
                    `  - Init for: ${chunkedSymbols[chunkIndex].join(", ")}`,
                    `\n    - Tx hash: ${tx.transactionHash}`
                );
            }
            // Remove ReservesSetupHelper from risk admins
            await TxnHelper.waitForTx(
                await aclManager
                    .connect(aclAdmin)
                    .removeRiskAdmin(reservesSetupHelper.address)
            );
        }
    };

}