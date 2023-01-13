import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { eNetwork } from '../src/types';
import { ConfigUtil } from '../src/utilities/config';
import { network } from 'hardhat';
import { COMMON_DEPLOY_PARAMS, ConfigNames, MARKET_NAME } from '../src/helpers/env';
import { DeployHelper } from '../src/helpers/deploy-helper';

const func: DeployFunction = async function ({ deployments, getNamedAccounts, ...hre }) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const symbols = Object.keys(configuration.PriceOracles);

    const linkTokenAddr = ConfigUtil
        .getRequiredParamPerNetwork<string>(configuration, "LinkTokenConfig", network);

    // Deploy chainlink operator contract
    const operatorArtifact = await deploy('ChainlinkOperator', {
        from: treasuryAdmin,
        args: [linkTokenAddr, treasuryAdmin],
        ...COMMON_DEPLOY_PARAMS
    });

    // Deploy the oracles that have a HTTP endpoint configured
    for (let index = 0; index < symbols.length; index++) {
        const assetSymbol = symbols[index];
        const oracleConfig = configuration.PriceOracles[assetSymbol];

        if (!oracleConfig || !oracleConfig.address) continue;

        const { httpUrl, jobId } = oracleConfig;

        if (!httpUrl) continue;

        await DeployHelper.deployPriceOracle({
            jobId,
            httpUrl,
            linkTokenAddr,
            id: assetSymbol,
            owner: treasuryAdmin,
            oracleOperatorAddr: operatorArtifact.address
        });
    }
};
export default func;
func.dependencies = [];
func.id = 'MockPriceOracle';
func.tags = ["core", "oracles"];
func.skip = async (env: HardhatRuntimeEnvironment) => !network.live;