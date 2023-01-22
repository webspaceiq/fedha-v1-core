import { FERC20Votes, FERC20VotesGovernor, FERC20VotesGovernorTimelock } from "../../typechain";

export class GovernanceTestHelper {
    public static  async log(
        proposalId: any,
        tokenInstance: FERC20Votes,
        governorInstance: FERC20VotesGovernor,
        timelockInstance: FERC20VotesGovernorTimelock
    ) {
        const state = await governorInstance.state(proposalId);
        console.log(`Proposal id: ${proposalId}, state:${state}`);
        const adminRole = await tokenInstance.DEFAULT_ADMIN_ROLE();
        const pauserRole = await tokenInstance.PAUSER_ROLE();
        const minterRole = await tokenInstance.MINTER_ROLE();
        const timelockAdminRole = await timelockInstance.DEFAULT_ADMIN_ROLE();
        const timelockExecutorRole = await timelockInstance.EXECUTOR_ROLE();
        const timelockProposerRole = await timelockInstance.PROPOSER_ROLE();
        const timelockCancerRole = await timelockInstance.CANCELLER_ROLE();
    
        console.log("---------------------------------------------------------------");
        console.log(`Token Addr: ${tokenInstance.address}`);
        console.log(`Timelock Addr: ${timelockInstance.address}`);
        console.log(`Governor Addr: ${governorInstance.address}`);
        console.log(`Admin Role: ${adminRole}`);
        console.log(`Pauser Role: ${pauserRole}`);
        console.log(`Minter Role: ${minterRole}`);
        console.log(`Timelock Admin Role: ${timelockAdminRole}`);
        console.log(`Timelock Executor Role: ${timelockExecutorRole}`);
        console.log(`Timelock Proposer Role: ${timelockProposerRole}`);
        console.log(`Timelock Canceller Role: ${timelockCancerRole}`);
        console.log(`ForVotes: ${(await governorInstance.proposalVotes(proposalId)).forVotes.toString()}`);
        console.log(`AgainstVotes: ${(await governorInstance.proposalVotes(proposalId)).againstVotes.toString()}`);
        console.log(`AbstainVotes: ${(await governorInstance.proposalVotes(proposalId)).abstainVotes.toString()}`);
        console.log("---------------------------------------------------------------");
    }
}