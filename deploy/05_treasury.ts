import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { FedhaMarket } from '../markets/fedha';
import { ConfigUtil } from '../src/utilities/config';
import { eNetwork } from '../src/types';
import { ConfigNames, MARKET_NAME } from '../src/helpers/env';
import { DeployHelper } from '../src/helpers/deploy-helper';
import * as DEPLOY_IDS from '../src/helpers/deploy-ids';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    const deployedPriceOracle = await DeployHelper.deployMockOracle(
        "Treasury", treasuryAdmin
    );
    
    const deployedToken = await DeployHelper.deployFERC20({
        owner: treasuryAdmin,
        id: DEPLOY_IDS.TEST_TOKEN_ID,
        name: DEPLOY_IDS.TEST_TOKEN_NAME,
        symbol: DEPLOY_IDS.TEST_TOKEN_SYMBOL
    });

    await DeployHelper.deployTreasury({
        id: DEPLOY_IDS.TREASURY_ID,
        owner: treasuryAdmin,
        tokenAddr: deployedToken.address,
        oracleAddr: deployedPriceOracle.address,
    });

};
export default func;
func.dependencies = [];
func.id = "Treasury";
func.tags = ["treasury", "core"];