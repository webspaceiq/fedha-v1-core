import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { FERC20VotesGovernor } from "../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployGovernorServiceContext } from "../../types";

@IsService()
export class DeployGovernorService {

    public static serviceName = 'DeployGovernorService';

    async execute(context: IServiceContext<DeployGovernorServiceContext>): Promise<FERC20VotesGovernor> {
        const {
            id,
            hre,
            deployer,
            tokenAddr,
            timelockAddr,
            initialVotingDelay,
            initialVotingPeriod,
            initialProposalThreshold,
            initialQuorumFraction,
        } = context.data;

        const { deployments } = hre;

        const {abi, address} = await deployments.deploy(id, {
            contract: "FERC20VotesGovernor",
            from: deployer,
            args: [
                id,
                tokenAddr,
                timelockAddr,
                initialVotingDelay,
                initialVotingPeriod,
                initialProposalThreshold,
                initialQuorumFraction,
            ],
            ...COMMON_DEPLOY_PARAMS
        });

        return await ethers.getContractAt(abi, address) as FERC20VotesGovernor
    }

}

export const DeployGovernorServiceInfo = {
    serviceName: DeployGovernorService.serviceName,
    serviceContructor: DeployGovernorService
};