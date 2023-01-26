import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../src';
import { EMPTY_STRING } from '../../src/helpers/constants';
import { MARKET_NAME, ConfigNames } from '../../src/helpers/env';
import { DeployUniswapPairsV2Service } from '../../src/services/uniswap/deploy-pairs';
import { DeployUniswapPairsV2ServiceContext, eNetwork } from '../../src/types';
import { ConfigUtil } from '../../src/utilities/config';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

    const id = EMPTY_STRING;
    const assetPairs = ConfigUtil.getAssetPairs(configuration, network);

    const data: DeployUniswapPairsV2ServiceContext = {
        id,
        assetPairs,
        configuration,
        hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
    };

    await serviceExecutor
        .executeService<DeployUniswapPairsV2ServiceContext, Promise<void>>(
            { data, serviceName: DeployUniswapPairsV2Service.serviceName });
};

export default func;
func.id = "UniswapPairsV2";
func.tags = ["uniswap", "uniwapPairsV2", "core"];
func.dependencies = ["tokens", "uniwapFactoryV2"];