import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../src';
import { EMPTY_STRING } from '../../src/helpers/constants';
import { ConfigNames, MARKET_NAME } from '../../src/helpers/env';
import { DeployAaveMarketACLManagerService } from '../../src/services/aave/deploy_acl';
import { DeployFedhaOracleService } from '../../src/services/aave/deploy_oracles';
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
                }, serviceName: DeployFedhaOracleService.serviceName
            });
};

export default func;
func.dependencies = ["tokens"];
func.id = "AaveMarketACLManager";
func.tags = ["aaveMarketACLManager", "aave", "core"];