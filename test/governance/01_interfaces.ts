import { deployments, ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { FERC20, FERC20Votes, FERC20VotesGovernor } from "../../typechain";
import { ConfigUtil } from "../../src/utilities/config";
import { ConfigNames, MARKET_NAME } from "../../src/helpers/env";
import { ZERO } from "../../src/helpers/constants";
import { BigNumber, Contract } from "ethers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";

enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}

enum VoteType {
    Against,
    For,
    Abstain
}

describe("Governance Events", function () {
    let tokenInstance: FERC20Votes;
    let governorInstance: FERC20VotesGovernor;
    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const { id, tokenId } = configuration.Governance;

    beforeEach(async () => {
        await deployments.fixture(['core']);
        tokenInstance = await DeployHelper.getDeployedContract(tokenId) as FERC20Votes;
        governorInstance = await DeployHelper.getDeployedContract(id) as FERC20VotesGovernor;
    });

    describe("VotingDelay", function () {
        it("Should return the voting delay", async function () {
            const votingDelay = await governorInstance.votingDelay();
        });
    });

    describe("VotingPeriod", function () {
        it("Should return the voting period", async function () {
            const votingPeriod = await governorInstance.votingPeriod();
        });
    });

    describe("Quorum", function () {
        it("Should return the quorum", async function () {
        });
    });

    describe("State", function () {
        it("Should return the state", async function () {
            const grant = ethers.utils.parseUnits("500.0", 18);
            const [deployer, notDeployer] = await ethers.getSigners();

            const newProposal = {
                descriptionHash: ethers.utils.id("Proposal #2: Give admin some tokens"),
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [notDeployer.address, grant]),
            };

            const proposeTx = await (governorInstance as Contract).connect(deployer).propose(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            );

            const tx = await proposeTx.wait(1);
            const proposalId = tx.events[0].args.proposalId;

            const state = await governorInstance.state(proposalId);
            expect(state).to.equal(ProposalState.Pending);
        });
    });

    describe("Propose", function () {
        it("Contract deployer account should be able to propose", async function () {
            const grant = ethers.utils.parseUnits("500.0", 18);
            const [deployer, notDeployer] = await ethers.getSigners();

            const newProposal = {
                descriptionHash: ethers.utils.id("Proposal #2: Give admin some tokens"),
                transferCalldata: tokenInstance.interface.encodeFunctionData('transfer', [notDeployer.address, grant]),
            };

            await expect(
                (governorInstance as Contract).connect(deployer).propose(
                    [tokenInstance.address],
                    [0],
                    [newProposal.transferCalldata],
                    newProposal.descriptionHash,
                )
            ).to.not.be.rejectedWith(Error);
        });

        it("Anyone should also be able to propose", async function () {
            const grant = ethers.utils.parseUnits("500.0", 18);
            const [deployer, notDeployer] = await ethers.getSigners();

            const newProposal = {
                descriptionHash: ethers.utils.id("Proposal #2: Give admin some tokens"),
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [deployer.address, grant]),
            };

            await expect(
                (governorInstance as Contract).connect(notDeployer).propose(
                    [tokenInstance.address],
                    [0],
                    [newProposal.transferCalldata],
                    newProposal.descriptionHash,
                )
            ).to.not.be.rejectedWith(Error);
        });
    });

    describe("CastVote", function () {
        it("Contract deployer should be able to cast a vote", async function () {
            const grant = ethers.utils.parseUnits("500.0", 18);
            const [deployer, notDeployer] = await ethers.getSigners();

            const newProposal = {
                descriptionHash: ethers.utils.id("Proposal #2: Give admin some tokens"),
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [notDeployer.address, grant]),
            };

            const proposeTx = await (governorInstance as Contract).connect(deployer).propose(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            );

            const tx = await proposeTx.wait(1);
            const proposalId = tx.events[0].args.proposalId;

            await tokenInstance.delegate(deployer.address);

            await expect(
                governorInstance.connect(deployer).castVote(proposalId, VoteType.For)
            ).to.not.be.rejectedWith(Error);
        });

        it("Anyone should be able to cast a vote", async function () {
            const grant = ethers.utils.parseUnits("100.0", 18);
            const [deployer, notDeployer, voter] = await ethers.getSigners();

            const newProposal = {
                descriptionHash: ethers.utils.id("Proposal #2: Give admin some tokens"),
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [notDeployer.address, grant]),
            };

            const proposeTx = await (governorInstance as Contract).connect(deployer).propose(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            );

            const tx = await proposeTx.wait(1);
            const proposalId = tx.events[0].args.proposalId;

            await tokenInstance.delegate(voter.address);

            await expect(
                governorInstance.connect(voter).castVote(proposalId, VoteType.For)
            ).to.not.be.rejectedWith(Error);
        });
    });

    describe("Execute", function () {
        it("Contract deployer account should be able to execute", async function () {

            const grant = ethers.utils.parseUnits("100.0", 18);
            const amountToMint = ethers.utils.parseUnits("100.0", 18);
            const [deployer, notDeployer, voter1, voter2] = await ethers.getSigners();

            let tx = await (tokenInstance as Contract).mint(deployer.address, amountToMint);
            tx = await tokenInstance.mint(notDeployer.address, amountToMint);
            tx = await tokenInstance.mint(voter1.address, amountToMint);
            tx = await tokenInstance.mint(voter2.address, amountToMint);

            tx = await tx.wait(1)

            tx = await tokenInstance.delegate(deployer.address);
            tx = await tokenInstance.delegate(notDeployer.address);
            tx = await tokenInstance.delegate(voter1.address);
            tx = await tokenInstance.delegate(voter2.address);

            tx = await tx.wait(1)

            const newProposal = {
                descriptionHash: "Proposal #2: Give admin some tokens",
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [notDeployer.address, grant]),
            };

            tx = await (governorInstance as Contract).connect(deployer).propose(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            );

            let txReceipt = await tx.wait(1);
            const proposalId = txReceipt.events[0].args.proposalId;

            let state = await governorInstance.state(proposalId);
            console.log(`Proposal id: ${proposalId}, state:${state}`);

            await mine(5);

            tx = await tx.wait(1)

            tx = await governorInstance.connect(deployer).castVote(proposalId, VoteType.For);
            tx = await governorInstance.connect(voter1).castVote(proposalId, VoteType.For);
            tx = await governorInstance.connect(notDeployer).castVote(proposalId, VoteType.For);
            tx = await governorInstance.connect(voter2).castVote(proposalId, VoteType.For);

            expect(await tx.wait(1));
            const hasVoted = await governorInstance.hasVoted(proposalId, deployer.address)
            expect(hasVoted).to.equal(true);

            state = await governorInstance.state(proposalId);
            console.log(`Proposal id: ${proposalId}, state:${state}`);

            console.log("---------------------------------------------------------------")
            console.log(`AgainstVotes: ${(await governorInstance.proposalVotes(proposalId)).againstVotes.toString()}`)
            console.log(`ForVotes: ${(await governorInstance.proposalVotes(proposalId)).forVotes.toString()}`)
            console.log(`AbstainVotes: ${(await governorInstance.proposalVotes(proposalId)).abstainVotes.toString()}`)
            console.log("---------------------------------------------------------------")


            tx = await tx.wait(1);

            await mine(10);

            state = await governorInstance.state(proposalId);
            console.log(`Proposal id: ${proposalId}, state:${state}`);

            await governorInstance.queue(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                ethers.utils.id(newProposal.descriptionHash),
            );

            await governorInstance.execute(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                ethers.utils.id(newProposal.descriptionHash),
            )
        });

        it("Anyone else should also be able to execute", async function () {
        });
    });
});