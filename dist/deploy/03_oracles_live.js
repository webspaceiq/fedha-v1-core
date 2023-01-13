"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/utilities/config");
const hardhat_1 = require("hardhat");
const env_1 = require("../src/helpers/env");
const deploy_helper_1 = require("../src/helpers/deploy-helper");
const func = async function ({ deployments, getNamedAccounts, ...hre }) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    const configuration = config_1.ConfigUtil.getMarketConfiguration(env_1.MARKET_NAME);
    const symbols = Object.keys(configuration.PriceOracles);
    const linkTokenAddr = config_1.ConfigUtil
        .getRequiredParamPerNetwork(configuration, "LinkTokenConfig", network);
    // Deploy chainlink operator contract
    const operatorArtifact = await deploy('ChainlinkOperator', {
        from: treasuryAdmin,
        args: [linkTokenAddr, treasuryAdmin],
        ...env_1.COMMON_DEPLOY_PARAMS
    });
    // Deploy the oracles that have a HTTP endpoint configured
    for (let index = 0; index < symbols.length; index++) {
        const assetSymbol = symbols[index];
        const oracleConfig = configuration.PriceOracles[assetSymbol];
        if (!oracleConfig || !oracleConfig.address)
            continue;
        const { httpUrl, jobId } = oracleConfig;
        if (!httpUrl)
            continue;
        await deploy_helper_1.DeployHelper.deployPriceOracle({
            jobId,
            httpUrl,
            linkTokenAddr,
            id: assetSymbol,
            owner: treasuryAdmin,
            oracleOperatorAddr: operatorArtifact.address
        });
    }
};
exports.default = func;
func.dependencies = [];
func.id = 'MockPriceOracle';
func.tags = ["core", "oracles"];
func.skip = async (env) => !hardhat_1.network.live;
