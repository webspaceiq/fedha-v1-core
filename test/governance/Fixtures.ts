import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { EMPTY_STRING } from "../../src/helpers/constants";

export class Fixtures {

    public static fixture() {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments

            const { BigNumber } = ethers;
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin, other } = await getNamedAccounts();
            const timelockDelay = BigNumber.from(1)

            const tokenInstance = await DeployHelper.deployFERC20Votes({
                id: DEPLOY_IDS.GOVERNANCE_TOKEN_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.GOVERNANCE_TOKEN_NAME,
                symbol: DEPLOY_IDS.GOVERNANCE_TOKEN_SYMBOL
            });

            await tokenInstance.connect(owner).delegate(treasuryAdmin);

            const timelockInstance = await DeployHelper.deployTimelockController({
                id: DEPLOY_IDS.GOVERNANCE_TIMELOCK_ID,
                owner: treasuryAdmin,
                minDelay: timelockDelay,
                proposers: [],
                executors: [],
                admin: treasuryAdmin
            });

            const governorInstance = await DeployHelper.deployGovernor({
                id: DEPLOY_IDS.GOVERNOR_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.GOVERNOR_NAME,
                tokenAddr: tokenInstance.address,
                timelockAddr: timelockInstance.address
            });


            return {
                other,
                treasuryAdmin,
                tokenInstance,
                timelockInstance,
                governorInstance,
            };
        }
    }
}