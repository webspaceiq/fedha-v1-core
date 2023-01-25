import { DeployFunction } from 'hardhat-deploy/types';
import { serviceExecutor } from '../../../src';
import { FERC20VotesGovernor } from '../../../typechain';
import { ConfigUtil } from '../../../src/utilities/config';
import { ConfigNames, MARKET_NAME } from '../../../src/helpers/env';
import { DeployGovernanceService } from '../../../src/services/fedha/governance/deploy';
import { DeployGovernanceServiceContext, DeployServiceContext } from '../../../src/types';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const { BigNumber } = ethers;
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    
    const govConfig = configuration.Governance;
    const treasuryConfig = configuration.Treasury;

    const [deployer] = await ethers.getSigners();

    const data: DeployGovernanceServiceContext = {
        configuration,
        proposers: [],
        executors: [],
        id: govConfig.id,
        treasuryId: treasuryConfig.id,
        deployer: deployer.address,
        tokenId: govConfig.tokenId,
        timelockId: govConfig.timelockId,
        timelockDelay: BigNumber.from(govConfig.timelockDelay),
        initialVotingDelay: BigNumber.from(govConfig.initialVotingDelay),
        initialVotingPeriod: BigNumber.from(govConfig.initialVotingPeriod),
        initialProposalThreshold: BigNumber.from(govConfig.initialProposalThreshold),
        initialQuorumFraction: BigNumber.from(govConfig.initialQuorumFraction),
        hre: { deployments, getNamedAccounts, ethers, upgrades, ...hre }
    };

    await serviceExecutor
        .executeService<DeployServiceContext, Promise<FERC20VotesGovernor>>(
            { data, serviceName: DeployGovernanceService.serviceName });

};

export default func;
func.dependencies = [];
func.id = "FERC20Governance";
func.tags = ["ferc20Governance", "governance", "core"];