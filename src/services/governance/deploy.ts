import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import * as TYPES from "../../types";
import { serviceExecutor } from "../..";
import { DeployTimelockService } from "./deploy-timelock";
import { DeployGovernorService } from "./deploy-governor";
import { DeployHelper } from "../../helpers/deploy-helper";
import { FERC20VotesGovernor, FERC20VotesGovernorTimelock } from "../../../typechain";

@IsService()
export class DeployGovernanceService {

    public static serviceName = 'DeployGovernanceService';

    async execute(context: IServiceContext<TYPES.DeployGovernanceServiceContext>): Promise<FERC20VotesGovernor> {
        const {
            id,
            hre,
            deployer,
            tokenId,
            timelockId,
            timelockDelay,
            proposers,
            executors,
            initialVotingDelay,
            initialVotingPeriod,
            initialProposalThreshold,
            initialQuorumFraction,
            configuration,
        } = context.data;

        const tokenInstance = await DeployHelper.getDeployedERC20Token(tokenId);

        const timelockInstance = await serviceExecutor
            .executeService<TYPES.DeployTimelockServiceContext, Promise<FERC20VotesGovernorTimelock>>(
                {
                    data: {
                        hre,
                        id: timelockId,
                        proposers,
                        executors,
                        timelockDelay,
                        configuration
                    }, serviceName: DeployTimelockService.serviceName
                });

        const governorInstance = await serviceExecutor
            .executeService<TYPES.DeployGovernorServiceContext, Promise<FERC20VotesGovernor>>(
                {
                    data: {
                        id,
                        hre,
                        deployer,
                        initialVotingDelay,
                        initialVotingPeriod,
                        initialProposalThreshold,
                        initialQuorumFraction,
                        tokenAddr: tokenInstance.address,
                        timelockAddr: timelockInstance.address,
                        configuration
                    }, serviceName: DeployGovernorService.serviceName
                });

        const tokenMinterRole = await tokenInstance.MINTER_ROLE();
        const timelockProposerRole = await timelockInstance.PROPOSER_ROLE();
        const timelockExecutorRole = await timelockInstance.EXECUTOR_ROLE();
        const timelockCancellerRole = await timelockInstance.CANCELLER_ROLE();

        await timelockInstance.grantRole(timelockProposerRole, governorInstance.address);
        await timelockInstance.grantRole(timelockExecutorRole, governorInstance.address);
        await timelockInstance.grantRole(timelockCancellerRole, governorInstance.address);

        await tokenInstance.grantRole(tokenMinterRole, timelockInstance.address);

        return governorInstance;
    }
}

export const DeployGovernanceServiceInfo = {
    serviceName: DeployGovernanceService.serviceName,
    serviceContructor: DeployGovernanceService
};