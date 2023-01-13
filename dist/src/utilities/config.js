"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigUtil = void 0;
const hardhat_1 = require("hardhat");
const fedha_1 = require("../../markets/fedha");
const env_1 = require("../helpers/env");
class ConfigUtil {
    static getMarketConfiguration(configName) {
        switch (configName) {
            case env_1.ConfigNames.Fedha:
                return fedha_1.FedhaMarket;
            case env_1.ConfigNames.Test:
                return fedha_1.FedhaMarket;
            case env_1.ConfigNames.Polygon:
                return fedha_1.FedhaMarket;
            default:
                throw new Error(`Unsupported pool configuration: ${configName} is not one of the supported configs ${Object.values(env_1.ConfigNames)}`);
        }
    }
    ;
    static getReserveAssets(configuration, network) {
        const reserveAssets = ConfigUtil.getRequiredParamPerNetwork(configuration, 'ReserveAssets', network);
        const assets = [];
        const assetSymbols = Object.keys(reserveAssets);
        for (let index = 0; index < assetSymbols.length; index++) {
            const symbol = assetSymbols[index];
            assets.push(reserveAssets[symbol]);
        }
        return assets;
    }
    static getPriceOracles(configuration) {
        const oracles = [];
        const assetSymbols = Object.keys(configuration.PriceOracles);
        for (let index = 0; index < assetSymbols.length; index++) {
            const oracle = configuration.PriceOracles[index];
            oracles.push(oracle);
        }
        return oracles;
    }
}
exports.ConfigUtil = ConfigUtil;
_a = ConfigUtil;
ConfigUtil.getRequiredParamPerNetwork = (configuration, key, network) => {
    const mapNetworkToValue = configuration[key];
    if (!mapNetworkToValue)
        throw `[config] missing required parameter ${key} at market config`;
    const value = mapNetworkToValue[network];
    if (!value)
        throw `[config] missing required value at ${key}.${network}`;
    return value;
};
ConfigUtil.getContract = async (id, address) => {
    const artifact = await hardhat_1.deployments.getArtifact(id);
    return hardhat_1.ethers.getContractAt(artifact.abi, address || (await (await hardhat_1.deployments.get(id)).address));
};
