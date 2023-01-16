import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { eNetwork } from '../src/types';
import { ConfigUtil } from '../src/utilities/config';
import { network } from 'hardhat';
import { ConfigNames, MARKET_NAME } from '../src/helpers/env';
import { DeployHelper } from '../src/helpers/deploy-helper';

const func: DeployFunction = async function ({ deployments, getNamedAccounts, ...hre }) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    const assets = ConfigUtil.getReserveAssets(configuration, network);

    // Only deploy assets do not already have an address configured
    const assetsOraclesToDeploy = assets.filter((asset) => asset.oracleAddr === undefined);

    for (let index = 0; index < assetsOraclesToDeploy.length; index++) {
        const { symbol } = assetsOraclesToDeploy[index];
        await DeployHelper.deployMockOracle(symbol, treasuryAdmin);
    }
};

export default func;
func.dependencies = [];
func.id = "MockPriceOracles";
func.tags = ["oracles", "core", "test"];
func.skip = async (env: HardhatRuntimeEnvironment) => network.live;