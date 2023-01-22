import { expect } from "chai";
import { Contract } from "ethers";
import { deployments, ethers } from "hardhat";
import { mine } from "@nomicfoundation/hardhat-network-helpers";

import { GovernanceProposalState, GovernanceVoteType } from "../../src/types";
import { ConfigUtil } from "../../src/utilities/config";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { ConfigNames, MARKET_NAME } from "../../src/helpers/env";
import { FERC20Votes, FERC20VotesGovernor, ITreasury } from "../../typechain";

describe("Governance Execute", function () {

    const grant = ethers.utils.parseUnits("100.0", 18);
    const voter1Mint = ethers.utils.parseUnits("300.0", 18);
    const voter2Mint = ethers.utils.parseUnits("400.0", 18);
    const deployerMint = ethers.utils.parseUnits("100.0", 18);
    const notDeployerMint = ethers.utils.parseUnits("200.0", 18);

    let tokenInstance: FERC20Votes;
    let treasuryInstance: ITreasury;
    let governorInstance: FERC20VotesGovernor;

    const configuration = ConfigUtil.getMarketConfiguration(MARKET_NAME as ConfigNames);
    const { id, tokenId } = configuration.Governance;
    const treasuryConfig = configuration.Treasury;

    beforeEach(async () => {
        await deployments.fixture(['core']);
        const [deployer, notDeployer, voter1, voter2] = await ethers.getSigners();

        tokenInstance = await DeployHelper.getDeployedContract(tokenId) as FERC20Votes;
        governorInstance = await DeployHelper.getDeployedContract(id) as FERC20VotesGovernor;
        treasuryInstance = await DeployHelper.getDeployedContract(treasuryConfig.id) as ITreasury;

        await tokenInstance.mint(voter1.address, voter1Mint);
        await tokenInstance.mint(deployer.address, deployerMint);
        await tokenInstance.mint(notDeployer.address, notDeployerMint);
        let tx = await (tokenInstance as Contract).mint(voter2.address, voter2Mint);

        tx = await tx.wait(1)

        await tokenInstance.delegate(deployer.address);
        await tokenInstance.delegate(notDeployer.address);
        await tokenInstance.delegate(voter1.address);
        tx = await tokenInstance.delegate(voter2.address);

        tx = await tx.wait(1);

    });

    it("Should allow deployer to create, queue, and execute a proposal", async function () {
        const { BigNumber } = ethers;
        const [deployer, notDeployer, voter1, voter2] = await ethers.getSigners();

        const initialTreasuryBalance = await tokenInstance.balanceOf(treasuryInstance.address);
        expect(initialTreasuryBalance).to.equal(BigNumber.from(0));

        const proposalData = {
            descriptionHash: "Proposal #2: Give admin some tokens",
            transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [treasuryInstance.address, grant]),
        };

        let tx = await (governorInstance as Contract).connect(deployer).propose(
            [tokenInstance.address],
            [0],
            [proposalData.transferCalldata],
            proposalData.descriptionHash,
        );

        let txReceipt = await tx.wait(1);
        const proposalId = txReceipt.events[0].args.proposalId;

        await mine(5);

        await governorInstance.connect(deployer).castVote(proposalId, GovernanceVoteType.For);
        await governorInstance.connect(voter1).castVote(proposalId, GovernanceVoteType.For);
        await governorInstance.connect(notDeployer).castVote(proposalId, GovernanceVoteType.For);
        tx = await governorInstance.connect(voter2).castVote(proposalId, GovernanceVoteType.For);

        await tx.wait(1);

        const hasVoted = await governorInstance.hasVoted(proposalId, deployer.address);

        expect(hasVoted).to.equal(true);

        await mine(10);

        await governorInstance.queue(
            [tokenInstance.address],
            [0],
            [proposalData.transferCalldata],
            ethers.utils.id(proposalData.descriptionHash),
        );

        await governorInstance.execute(
            [tokenInstance.address],
            [0],
            [proposalData.transferCalldata],
            ethers.utils.id(proposalData.descriptionHash),
        );
        
        const state = await governorInstance.state(proposalId);
        expect(state).to.equal(GovernanceProposalState.Executed);

        const finalTreasuryBalance = await tokenInstance.balanceOf(treasuryInstance.address);
        expect(finalTreasuryBalance).to.equal(grant);

    });

});

