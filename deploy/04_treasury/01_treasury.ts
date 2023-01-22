import { DeployFunction } from 'hardhat-deploy/types';
import { ITreasury } from '../../typechain';
import { serviceExecutor } from '../../src';
import { ConfigUtil } from '../../src/utilities/config';
import { DeployHelper } from '../../src/helpers/deploy-helper';
import { DeployTreasuryServiceContext } from '../../src/types';
import { TREASURY_TYPE_MINT } from '../../src/helpers/constants';
import { ConfigNames, MARKET_NAME } from '../../src/helpers/env';
import { DeployTreasuryService } from '../../src/services/treasury/deploy';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const {
        id,
        type,
        tokenId,
        oracleId,
    } = configuration.Treasury;

    const [deployer] = await ethers.getSigners();

    const tokenInstance = await DeployHelper.getDeployedERC20Token(tokenId);
    const oracleInstance = await DeployHelper.getDeployedPriceOracle(oracleId);

    const treasuryInstance = await serviceExecutor
        .executeService<DeployTreasuryServiceContext, Promise<ITreasury>>(
            {
                data: {
                    id,
                    type,
                    configuration,
                    deployer: deployer.address,
                    tokenAddr: tokenInstance.address,
                    oracleAddr: oracleInstance.address,
                    hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
                }, serviceName: DeployTreasuryService.serviceName
            });

    // This looks out of place here
    if (type === TREASURY_TYPE_MINT) {
        const { utils } = ethers;
        const minterRole = utils.keccak256(utils.toUtf8Bytes("MINTER_ROLE"));
        await tokenInstance.grantRole(minterRole, treasuryInstance.address);
    }
};

export default func;
func.dependencies = [];
func.id = "Treasury";
func.tags = ["treasury", "treasuryProd", "core"];