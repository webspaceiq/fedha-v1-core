import { DeployFunction } from 'hardhat-deploy/types';
import { DeployHelper } from '../src/helpers/deploy-helper';
import { PRICE_ORACLE_ID } from '../src/helpers/deploy-ids';
import { COMMON_DEPLOY_PARAMS, ConfigNames, MARKET_NAME } from '../src/helpers/env';
import { eNetwork } from '../src/types';
import { ConfigUtil } from '../src/utilities/config';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;
    
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const assets = ConfigUtil.getReserveAssets(configuration, network);
    // Only deploy assets do not already have an address configured
    const assetsToDeploy = assets.filter((asset) => asset.address === undefined);

    for (let index = 0; index < assetsToDeploy.length; index++) {
        const { name, symbol } = assetsToDeploy[index];
        const deployedPriceOracle = await DeployHelper.getDeployedPriceOracle(symbol);

        await DeployHelper.deployNAFERC20({
            id: symbol,
            name, 
            symbol, 
            owner: treasuryAdmin,
            oracleAddr: deployedPriceOracle.address
        });
    }
};

export default func;
func.dependencies = [];
func.id = 'NAFERC20';
func.tags = ["core", "assets"];