import { Contract } from "ethers";
import { deployments, ethers } from "hardhat";
import { FedhaMarket } from "../../markets/fedha";
import { ConfigNames } from "../helpers/env";
import * as TYPES from "../types";

export class ConfigUtil {

    public static getMarketConfiguration(configName: ConfigNames): TYPES.IFedhaConfiguration {
        switch (configName) {
            case ConfigNames.Fedha:
                return FedhaMarket;
            case ConfigNames.Test:
                return FedhaMarket;
            case ConfigNames.Polygon:
                return FedhaMarket;
            default:
                throw new Error(
                    `Unsupported pool configuration: ${configName} is not one of the supported configs ${Object.values(
                        ConfigNames
                    )}`
                );
        }
    };

    public static getReserveAssets(
        configuration: TYPES.IFedhaConfiguration,
        network: TYPES.eNetwork): TYPES.IAssetConfigutation[] {

        const reserveAssets = ConfigUtil.getRequiredParamPerNetwork
            <TYPES.SymbolMap<TYPES.IAssetConfigutation>>(configuration, 'ReserveAssets', network);

        const assets: TYPES.IAssetConfigutation[] = []
        const assetSymbols = Object.keys(reserveAssets);
        for (let index = 0; index < assetSymbols.length; index++) {
            const symbol = assetSymbols[index];
            assets.push(reserveAssets[symbol]);
        }
        return assets;
    }

    public static getAssetPairs(
        configuration: TYPES.IFedhaConfiguration,
        network: TYPES.eNetwork): TYPES.IAssetPairConfigutation[] {

        const assetPairs = ConfigUtil.getRequiredParamPerNetwork
            <TYPES.SymbolMap<TYPES.IAssetPairConfigutation>>(configuration, 'AssetPairs', network);

        const assets: TYPES.IAssetPairConfigutation[] = []
        const pairSymbols = Object.keys(assetPairs);

        for (let index = 0; index < pairSymbols.length; index++) {
            const symbol = pairSymbols[index];
            assets.push(assetPairs[symbol]);
        }
        return assets;
    }

    public static getTokenOracles(
        configuration: TYPES.IFedhaConfiguration): TYPES.IOracleConfigutation[] {

        const oracles: TYPES.IOracleConfigutation[] = []
        const assetSymbols = Object.keys(configuration.TokenOracles);
        for (let index = 0; index < assetSymbols.length; index++) {
            const oracle = configuration.TokenOracles[index];
            oracles.push(oracle);
        }
        return oracles;
    }

    public static getParamPerNetwork<T>(
        param: TYPES.iParamsPerNetwork<T> | undefined,
        network: TYPES.eNetwork
    ): T | undefined {
        if (!param) return undefined;

        return param[network];
    };

    public static getRequiredParamPerNetwork = <T>(
        configuration: TYPES.IFedhaConfiguration,
        key: keyof TYPES.IFedhaConfiguration,
        network: TYPES.eNetwork
    ): T => {
        const mapNetworkToValue = configuration[key] as TYPES.iParamsPerNetwork<T>;
        if (!mapNetworkToValue)
            throw `[config] missing required parameter ${key} at market config`;

        const value = mapNetworkToValue[network];
        if (!value) throw `[config] missing required value at ${key}.${network}`;

        return value;
    };

    public static getContract = async <ContractType extends Contract>(
        id: string,
        address?: TYPES.tEthereumAddress,
    ): Promise<ContractType> => {
        const artifact = await deployments.getArtifact(id);
        return ethers.getContractAt(
            artifact.abi,
            address || (await (await deployments.get(id)).address)
        ) as any as ContractType;
    };

}