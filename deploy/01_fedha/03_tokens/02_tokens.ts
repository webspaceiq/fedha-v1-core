import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../../src';
import { ConfigUtil } from '../../../src/utilities/config';
import { EMPTY_STRING } from '../../../src/helpers/constants';
import { ConfigNames, MARKET_NAME } from '../../../src/helpers/env';
import { DeployTokensServiceContext, eNetwork } from '../../../src/types';
import { DeployTokensService } from '../../../src/services/fedha/token/deploy-tokens';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

    const id = EMPTY_STRING;
    const assets = ConfigUtil.getReserveAssets(configuration, network);

    const data: DeployTokensServiceContext = {
        id,
        assets,
        configuration,
        hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
    };

    await serviceExecutor
        .executeService<DeployTokensServiceContext, Promise<void>>(
            { data, serviceName: DeployTokensService.serviceName });
};

export default func;
func.id = "Tokens";
func.tags = [ "tokens", "core"];
func.dependencies = ["tokenOracles"];