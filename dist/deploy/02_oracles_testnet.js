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
    const assets = config_1.ConfigUtil.getReserveAssets(configuration, network);
    // Only deploy assets do not already have an address configured
    const assetsOraclesToDeploy = assets.filter((asset) => asset.oracleAddr === undefined);
    for (let index = 0; index < assetsOraclesToDeploy.length; index++) {
        const { symbol } = assetsOraclesToDeploy[index];
        await deploy_helper_1.DeployHelper.deployMockOracle(symbol, treasuryAdmin);
    }
};
exports.default = func;
func.dependencies = [];
func.id = 'MockPriceOracle';
func.tags = ["core", "oracles", "test"];
func.skip = async (env) => hardhat_1.network.live;
