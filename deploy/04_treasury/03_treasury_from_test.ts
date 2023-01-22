import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber } from 'ethers';
import { ITreasury } from '../../typechain';
import { serviceExecutor } from '../../src';
import { ConfigUtil } from '../../src/utilities/config';
import * as TYPES from '../../src/types';
import { ConfigNames, MARKET_NAME } from '../../src/helpers/env';
import { DeployTreasuryService } from '../../src/services/treasury/deploy';
import { DeployFERC20Service } from '../../src/services/token/deploy-ferc20';
import { DeploySimplePriceOracleService } from '../../src/services/oracle/deploy-simple';
import { TEST_TRANSFER_FROM_TREASURY_ID } from '../../src/helpers/deploy-ids';
import { TREASURY_TYPE_TRANSFER_FROM } from '../../src/helpers/constants';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const {
        id,
        type,
    } = configuration.Treasury;

    const [deployer, notDeployer, vault] = await ethers.getSigners();

    const tokenInstance = await serviceExecutor
        .executeService<TYPES.DeployFERC20ServiceContext, Promise<ITreasury>>(
            {
                data: {
                    id: "FRAULEIN",
                    configuration,
                    tokenName: "HELGA",
                    tokenSymbol: "HELGA",
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeployFERC20Service.serviceName
            });

    const oracleInstance = await serviceExecutor
        .executeService<TYPES.DeploySimplePriceOracleServiceContext, Promise<ITreasury>>(
            {
                data: {
                    id: "CYNTHIA_LYNN",
                    price: BigNumber.from(12),
                    configuration,
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeploySimplePriceOracleService.serviceName
            });;

    const treasuryInstance = await serviceExecutor
        .executeService<TYPES.DeployTreasuryServiceContext, Promise<ITreasury>>(
            {
                data: {
                    id: TEST_TRANSFER_FROM_TREASURY_ID,
                    type: TREASURY_TYPE_TRANSFER_FROM,
                    configuration,
                    deployer: deployer.address,
                    tokenAddr: tokenInstance.address,
                    oracleAddr: oracleInstance.address,
                    vaultAddr: vault.address,
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeployTreasuryService.serviceName
            });
};

export default func;
func.dependencies = [];
func.id = "Treasury";
func.tags = ["treasuryTransferFromTest", "treasuryTest", "test"];