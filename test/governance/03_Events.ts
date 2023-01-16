import { deployments, ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { Fixtures } from "./Fixtures";

describe("Governance Events", function () {

    describe("Propose", function () {

        it("Shoul emit an event when a proposal is created", async function () {
            const fixture = deployments.createFixture(Fixtures.fixture());
            const { governorInstance, tokenInstance } = await fixture();

            const { utils } = ethers;
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin } = await getNamedAccounts();
            const grant = ethers.utils.parseUnits("500.0", 18);

            const newProposal = {
                grantAmount: grant,
                transferCalldata: tokenInstance.interface.encodeFunctionData('mint', [treasuryAdmin, grant]),
                descriptionHash: utils.id("Proposal #2: Give admin some tokens")
            };

            await expect(
                governorInstance.connect(owner).propose(
                    [tokenInstance.address],
                    [0],
                    [newProposal.transferCalldata],
                    newProposal.descriptionHash,
                )
            ).to.emit(governorInstance, "ProposalCreated");
        });
    });
});