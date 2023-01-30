import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../src';
import { EMPTY_STRING } from '../../src/helpers/constants';
import { ConfigNames, MARKET_NAME } from '../../src/helpers/env';
import { InitializeAavePoolServiceInfo } from '../../src/services/aave/init_pool';
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
                }, serviceName: InitializeAavePoolServiceInfo.serviceName
            });
};

export default func;
func.dependencies = [];
func.id = "InitializeAavePool";
func.tags = ["aaveInitialixePool", "aave", "core"];