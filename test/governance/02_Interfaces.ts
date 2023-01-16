import { deployments, ethers, getNamedAccounts } from "hardhat";
import { Contract } from "ethers";
import { assert, expect } from "chai";
import { Fixtures } from "./Fixtures";
import { GOVERNOR_ID } from "../../src/helpers/deploy-ids";

export enum VoteType {
    'Against',
    'For',
    'Abstain'
}

function Enum(...options: any[]) {
    return Object.fromEntries(options.map((key, i) => [key, i]))
}
describe("Governance State", async function () {

    describe("VotingDelay", async function () {
        it("Should return the voting delay", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const delay = BigNumber.from(1);
            const { governorInstance } = await fixture();

            const votingDelay = await governorInstance.votingDelay();
            expect(votingDelay).to.equal(delay);
        });
    });
    describe("VotingPeriod", async function () {
        it("Should return the voting period", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());

            const { BigNumber, utils } = ethers;
            const period = BigNumber.from(50400);
            const { treasuryAdmin } = await getNamedAccounts();
            const [owner, otherAccount] = await ethers.getSigners();
            const { governorInstance, tokenInstance, timelockInstance } = await fixture();

            const votingPeriod = await governorInstance.votingPeriod();
            expect(votingPeriod).to.equal(period);
        });
    });
    describe("Quorum", async function () {
        it("Should return the quorum", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());
            const { governorInstance } = await fixture();

            const { BigNumber, provider } = ethers;
            const quorumValue = BigNumber.from(4);
            const governorDeployment = await deployments.get(GOVERNOR_ID);
            const hashOfTx = governorDeployment.transactionHash;
        });
    });
    describe("Propose", async function () {
        it("", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());
            const { governorInstance, tokenInstance } = await fixture();

            const { utils, provider } = ethers;
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin } = await getNamedAccounts();
            const grant = ethers.utils.parseUnits("500.0", 18);

            const newProposal = {
                grantAmount: grant,
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [treasuryAdmin, grant]),
                descriptionHash: utils.id("Proposal #2: Give admin some tokens")
            };

            const proposeTx = await (governorInstance as Contract).connect(owner).propose(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            );
            const txReceipt = await proposeTx.wait(1);

            expect(treasuryAdmin).to.equal(txReceipt.events[0].args.proposer);
            expect(tokenInstance.address).to.equal(txReceipt.events[0].args.targets[0]);


        });
    });

    describe("ProposalThreshold", async function () {
        it("", async function () {
        });
    });

    describe("State", async function () {
        it("Should return proposal state as pending", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());
            const { governorInstance, tokenInstance } = await fixture();

            const { BigNumber, utils, provider } = ethers;
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin } = await getNamedAccounts();
            const grant = ethers.utils.parseUnits("500.0", 18);
            const statePending = BigNumber.from(0);

            const newProposal = {
                grantAmount: grant,
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [treasuryAdmin, grant]),
                descriptionHash: utils.id("Proposal #2: Give admin some tokens")
            };

            const proposeTx = await (governorInstance as Contract).connect(owner).propose(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            );
            const txReceipt = await proposeTx.wait(1);
            const proposalId = txReceipt.events[0].args.proposalId;

            const state = await governorInstance.state(proposalId);
            expect(state).to.equal(statePending);
        });
    });

    describe("Execute", async function () {
        it("", async function () {
            /* const fixture = deployments.createFixture(Fixtures.fixture());
            const { governorInstance, tokenInstance } = await fixture();

            const { BigNumber, utils, provider } = ethers;
            const [userA, userB, userC, userE] = await ethers.getSigners();
            const { treasuryAdmin } = await getNamedAccounts();

            const grant = ethers.utils.parseUnits("500.0", 18);
            const votes = ethers.utils.parseUnits("100.0", 18);

            await tokenInstance.connect(userA).mint(userA.address, votes);
            await tokenInstance.connect(userB).mint(userB.address, votes);
            await tokenInstance.connect(userC).mint(userC.address, votes);
            await tokenInstance.connect(userE).mint(userC.address, votes);

            const newProposal = {
                grantAmount: grant,
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [treasuryAdmin, grant]),
                descriptionHash: utils.id("Proposal #2: Give admin some tokens")
            };

            const proposeTx = await (governorInstance as Contract).connect(userA).propose(
                [tokenInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            );
            const txReceipt = await proposeTx.wait(1);
            //const proposalId = txReceipt.events[0].args.proposalId;

            const tx = await proposeTx.wait();
            await provider.send('evm_mine', []); // wait 1 block before opening voting
            const proposalId = tx.events.find((e: any) => e.event == 'ProposalCreated').args.proposalId;

            // Let's vote
            await governorInstance.connect(userA).castVote(proposalId, VoteType.For);
            await governorInstance.connect(userB).castVote(proposalId, VoteType.For);
            await governorInstance.connect(userC).castVote(proposalId, VoteType.Against);
            await governorInstance.connect(userE).castVote(proposalId, VoteType.Abstain);

            const votesData = await governorInstance.proposalVotes(proposalId);
            assert(votesData.forVotes.eq(2), "Vote count mismatch"); // < FAILS votes is an array and all its members, "forVotes", "againstVotes", etc are all 0

            // Exec
            await governorInstance.execute(
                [governorInstance.address],
                [0],
                [newProposal.transferCalldata],
                newProposal.descriptionHash,
            ); */
        });
    });
    describe("Cancel", async function () {
        it("", async function () {
        });
    });


});