import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../../src';
import { DeployServiceContext } from '../../../src/types';
import { ConfigUtil } from '../../../src/utilities/config';
import { ConfigNames, MARKET_NAME } from '../../../src/helpers/env';
import { DeployOraclesService } from '../../../src/services/fedha/oracle/deploy-oracles';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const {
        id,
    } = configuration.Governance;

    const data: DeployServiceContext = {
        id,
        configuration,
        hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
    };

    await serviceExecutor
        .executeService<DeployServiceContext, Promise<void>>(
            { data, serviceName: DeployOraclesService.serviceName });

};

export default func;
func.dependencies = [];
func.id = "TokenOracles";
func.tags = ["tokenOracle", "core"];