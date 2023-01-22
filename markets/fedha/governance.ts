import { IGovernanceConfiguration } from "../../src/types"

export const Governance: IGovernanceConfiguration = {
    id: "FedhaGovernor",
    tokenId: "FEDHA",
    timelockId: "FedhaTimelock",
    timelockDelay: "0",
    initialVotingDelay: "1",
    initialVotingPeriod: "10",
    initialProposalThreshold: "0",
    initialQuorumFraction: "0",
}