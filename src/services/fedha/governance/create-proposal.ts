import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { DeployHelper } from "../../../helpers/deploy-helper";
import { CreateProposalServiceContext } from "../../../types";
import { FERC20Votes, FERC20VotesGovernor } from "../../../../typechain";

@IsService()
export class CreateProposalService {

    public static serviceName = 'CreateProposalService';

    async execute(context: IServiceContext<CreateProposalServiceContext>): Promise<string> {
        const { deployer, descriptionHash, hre, id, tokenId,  transferCalldata } = context.data;

        const proposer = await ethers.getSigner(deployer)
        const tokenInstance = await DeployHelper.getDeployedContract(tokenId) as FERC20Votes;
        const governorInstance = await DeployHelper.getDeployedContract(id) as FERC20VotesGovernor;

        const proposeTx = await (governorInstance as Contract).connect(proposer).propose(
            [tokenInstance.address],
            [0],
            [transferCalldata],
            descriptionHash,
        );

        const tx = await proposeTx.wait(1);
        const proposalId = tx.events[0].args.proposalId;
        return proposalId
    }

}

export const CreateProposalServiceInfo = {
    serviceName: CreateProposalService.serviceName,
    serviceContructor: CreateProposalService
};