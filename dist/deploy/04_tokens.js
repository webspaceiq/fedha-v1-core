"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_helper_1 = require("../src/helpers/deploy-helper");
const env_1 = require("../src/helpers/env");
const config_1 = require("../src/utilities/config");
const func = async function ({ deployments, getNamedAccounts, ethers, upgrades, ...hre }) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    const configuration = config_1.ConfigUtil.getMarketConfiguration(env_1.MARKET_NAME);
    const assets = config_1.ConfigUtil.getReserveAssets(configuration, network);
    // Only deploy assets do not already have an address configured
    const assetsToDeploy = assets.filter((asset) => asset.address === undefined);
    for (let index = 0; index < assetsToDeploy.length; index++) {
        const { name, symbol } = assetsToDeploy[index];
        const deployedPriceOracle = await deploy_helper_1.DeployHelper.getDeployedPriceOracle(symbol);
        await deploy_helper_1.DeployHelper.deployNAFERC20({
            id: symbol,
            name,
            symbol,
            owner: treasuryAdmin,
            oracleAddr: deployedPriceOracle.address
        });
    }
};
exports.default = func;
func.dependencies = [];
func.id = 'NAFERC20';
func.tags = ["core", "assets"];
