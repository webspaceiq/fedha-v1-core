import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { FedhaMarket } from '../markets/fedha';
import { ConfigUtil } from '../src/utilities/config';
import { eNetwork } from '../src/types';
import { ConfigNames, MARKET_NAME } from '../src/helpers/env';
import { DeployHelper } from '../src/helpers/deploy-helper';
import * as DEPLOY_IDS from '../src/helpers/deploy-ids';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const { deploy } = deployments;
    const [owner] = await ethers.getSigners();
    const timelockDelay = ethers.BigNumber.from(1);
    const { treasuryAdmin, other } = await getNamedAccounts();

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);

    const tokenInstance = await DeployHelper.deployFERC20Votes({
        id: DEPLOY_IDS.GOVERNANCE_TOKEN_ID,
        owner: treasuryAdmin,
        name: DEPLOY_IDS.GOVERNANCE_TOKEN_NAME,
        symbol: DEPLOY_IDS.GOVERNANCE_TOKEN_SYMBOL
    });

    await tokenInstance.connect(owner).delegate(treasuryAdmin);

    const timelockInstance = await DeployHelper.deployTimelockController({
        id: DEPLOY_IDS.GOVERNANCE_TIMELOCK_ID,
        owner: treasuryAdmin,
        minDelay: timelockDelay,
        proposers: [],
        executors: [],
        admin: treasuryAdmin
    });

    const governorInstance = await DeployHelper.deployGovernor({
        id: DEPLOY_IDS.GOVERNOR_ID,
        owner: treasuryAdmin,
        name: DEPLOY_IDS.GOVERNOR_NAME,
        tokenAddr: tokenInstance.address,
        timelockAddr: timelockInstance.address
    });

};
export default func;
func.dependencies = [];
func.id = "Governance";
func.tags = ["governance", "core"];