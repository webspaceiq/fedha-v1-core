import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../../src';
import { ConfigUtil } from '../../../src/utilities/config';
import { EMPTY_STRING } from '../../../src/helpers/constants';
import { ConfigNames, MARKET_NAME } from '../../../src/helpers/env';
import * as TYPES from '../../../src/types';
import { DeployAFERC20Service } from '../../../src/services/fedha/token/deploy-aferc20';
import { FERC20, ITokenOracle } from '../../../typechain';
import * as DEPLOY_ID from '../../../src/helpers/deploy-ids';
import { DeployFERC20Service } from '../../../src/services/fedha/token/deploy-ferc20';
import { DeploySimpleTokenOracleService } from '../../../src/services/fedha/oracle/deploy-simple';
import { DeployNAFERC20Service } from '../../../src/services/fedha/token/deploy-naferc20';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as TYPES.eNetwork;

    const id = EMPTY_STRING;
    const assets = ConfigUtil.getReserveAssets(configuration, network);

    const data: TYPES.DeployServiceContext = {
        id,
        configuration,
        hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
    };
    // Deploy FERC2O
    const assetInstance = await serviceExecutor
        .executeService<TYPES.DeployFERC20ServiceContext, Promise<FERC20>>(
            {
                data: {
                    ...data,
                    id: `${DEPLOY_ID.TEST_ASSET_ID}`,
                    tokenName: DEPLOY_ID.TEST_ASSET_NAME,
                    tokenSymbol: DEPLOY_ID.TEST_ASSET_SYMBOL,
                }, serviceName: DeployFERC20Service.serviceName
            }
        );

    // Deploy AFERC2O
    const price = ethers.BigNumber.from(12);
    const oracleInstance = await serviceExecutor
        .executeService<TYPES.DeploySimpleTokenOracleServiceContext, Promise<ITokenOracle>>(
            {
                data: {
                    ...data,
                    price,
                    id: `${DEPLOY_ID.TEST_TOKEN_SYMBOL}${DEPLOY_ID.PRICE_ORACLE_ID_SUFFIX}`,

                }, serviceName: DeploySimpleTokenOracleService.serviceName
            }
        );

    await serviceExecutor
        .executeService<TYPES.DeployAFERC20ServiceContext, Promise<void>>(
            {
                data: {
                    ...data,
                    id: DEPLOY_ID.TEST_TOKEN_ID,
                    tokenName: DEPLOY_ID.TEST_TOKEN_NAME,
                    tokenSymbol: DEPLOY_ID.TEST_TOKEN_SYMBOL,
                    tokenAddr: assetInstance.address,
                    oracleAddr: oracleInstance.address,
                }, serviceName: DeployAFERC20Service.serviceName
            }
        );
    // Deploy NAFERC2Oconst price = ethers.BigNumber.from(12);
    const naferc20OracleInstance = await serviceExecutor
        .executeService<TYPES.DeploySimpleTokenOracleServiceContext, Promise<ITokenOracle>>(
            {
                data: {
                    ...data,
                    price,
                    id: `${DEPLOY_ID.TEST_NAFERC20_TOKEN_ID}${DEPLOY_ID.PRICE_ORACLE_ID_SUFFIX}`,

                }, serviceName: DeploySimpleTokenOracleService.serviceName
            }
        );
    await serviceExecutor
        .executeService<TYPES.DeployNAFERC20ServiceContext, Promise<void>>(
            {
                data: {
                    ...data,
                    id: DEPLOY_ID.TEST_NAFERC20_TOKEN_ID,
                    tokenName: DEPLOY_ID.TEST_NAFERC20_TOKEN_NAME,
                    tokenSymbol: DEPLOY_ID.TEST_NAFERC20_TOKEN_SYMBOL,
                    oracleAddr: naferc20OracleInstance.address,
                }, serviceName: DeployNAFERC20Service.serviceName
            }
        );
};

export default func;
func.dependencies = [];
func.id = "TestToken";
func.tags = ["testToken", "test"];