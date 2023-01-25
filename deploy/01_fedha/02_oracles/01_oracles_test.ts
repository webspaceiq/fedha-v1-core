import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../../src';
import { ConfigUtil } from '../../../src/utilities/config';
import { FAKE_BYTES } from '../../../src/helpers/constants';
import { DeployChainlinkOracleAndOpratorServiceContext } from '../../../src/types';
import { COMMON_DEPLOY_PARAMS, ConfigNames, MARKET_NAME } from '../../../src/helpers/env';
import { TEST_LINK_TOKEN_ID, TEST_PRICE_ORACLE_ID } from '../../../src/helpers/deploy-ids';
import { DeployChainlinkOracleAndOpratorService } from '../../../src/services/fedha/oracle/deploy-chainlink';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { ethers } = hre;
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    const [ deployer ] = await ethers.getSigners();

    const { abi, address } = await hre.deployments.deploy(TEST_LINK_TOKEN_ID, {
        contract: "LinkToken",
        from: deployer.address,
        args: [],
        ...COMMON_DEPLOY_PARAMS
    });

    await serviceExecutor
        .executeService<DeployChainlinkOracleAndOpratorServiceContext, Promise<void>>(
            {
                data: {
                    id: TEST_PRICE_ORACLE_ID,
                    hre,
                    configuration,
                    linkTokenAddr: address,
                    httpUrl: FAKE_BYTES,
                    jobId: FAKE_BYTES
                },
                serviceName: DeployChainlinkOracleAndOpratorService.serviceName
            });

};

export default func;
func.dependencies = [];
func.id = "TestChainlinkTokenOracles";
func.tags = ["priceOracle", "testChainlinkTokenOracles"];