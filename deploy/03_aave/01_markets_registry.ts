import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../src';
import { EMPTY_STRING } from '../../src/helpers/constants';
import { ConfigNames, MARKET_NAME } from '../../src/helpers/env';
import { DeployAaveMarketsRegistryService } from '../../src/services/aave/deploy_registry';
import { DeployServiceContext } from '../../src/types';
import { ConfigUtil } from '../../src/utilities/config';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    await serviceExecutor
        .executeService<DeployServiceContext, Promise<void>>(
            {
                data: {
                    id: EMPTY_STRING,
                    configuration,
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeployAaveMarketsRegistryService.serviceName
            });
};

export default func;
func.dependencies = [];
func.id = "AaveMarketsRegistry";
func.tags = ["aaveMarketsRegistry", "aave", "core"];