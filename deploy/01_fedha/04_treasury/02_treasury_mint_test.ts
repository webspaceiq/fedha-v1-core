import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../../src';
import * as TYPES from '../../../src/types';
import { ConfigUtil } from '../../../src/utilities/config';
import { ConfigNames, MARKET_NAME } from '../../../src/helpers/env';
import { FERC20, ITokenOracle, ITreasury } from '../../../typechain';
import { DeployTreasuryService } from '../../../src/services/fedha/treasury/deploy';
import { DeployFERC20Service } from '../../../src/services/fedha/token/deploy-ferc20';
import { DeploySimpleTokenOracleService } from '../../../src/services/fedha/oracle/deploy-simple';
import { BigNumber } from 'ethers';
import { TEST_MINT_TREASURY_ID } from '../../../src/helpers/deploy-ids';
import { TREASURY_TYPE_MINT } from '../../../src/helpers/constants';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const {
        id,
        type,
    } = configuration.Treasury;

    const [deployer] = await ethers.getSigners();

    const tokenInstance = await serviceExecutor
        .executeService<TYPES.DeployFERC20ServiceContext, Promise<FERC20>>(
            {
                data: {
                    id: "KLINK",
                    configuration,
                    tokenName: "KLINK",
                    tokenSymbol: "KLINK",
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeployFERC20Service.serviceName
            });

    const oracleInstance = await serviceExecutor
        .executeService<TYPES.DeploySimpleTokenOracleServiceContext, Promise<ITokenOracle>>(
            {
                data: {
                    id: "STALAG13",
                    price: BigNumber.from(12),
                    configuration,
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeploySimpleTokenOracleService.serviceName
            });;

    const treasuryInstance = await serviceExecutor
        .executeService<TYPES.DeployTreasuryServiceContext, Promise<ITreasury>>(
            {
                data: {
                    id:TEST_MINT_TREASURY_ID,
                    type: TREASURY_TYPE_MINT,
                    configuration,
                    deployer: deployer.address,
                    tokenAddr: tokenInstance.address,
                    oracleAddr: oracleInstance.address,
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeployTreasuryService.serviceName
            });

    const { utils } = ethers;
    const minterRole = utils.keccak256(utils.toUtf8Bytes("MINTER_ROLE"));
    await tokenInstance.grantRole(minterRole, treasuryInstance.address);
};

export default func;
func.dependencies = [];
func.id = "Treasury";
func.tags = ["treasuryMintTest", "treasuryTest", "test"];