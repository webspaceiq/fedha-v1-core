import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as DEPLOY_IDS from "../../src/helpers/deploy-ids";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { EMPTY_STRING } from "../../src/helpers/constants";


export class Fixtures {

    public static fixture() {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin, other } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const tokenInstance = await DeployHelper.deployFERC20({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL
            });

            const treasuryInstance = await DeployHelper.deployTreasury({
                id: DEPLOY_IDS.TREASURY_ID,
                owner: treasuryAdmin,
                tokenAddr: tokenInstance.address,
                oracleAddr: oracleInstance.address
            });

            return { 
                other,
                treasuryInstance, 
                treasuryAdmin, 
                tokenInstance, 
                oracleInstance 
            };
        }
    }
    
    public static transferFromERC20TreasuryFixture() {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const [owner, addr1] = await ethers.getSigners();
            const { treasuryAdmin, other } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const tokenInstance = await DeployHelper.deployFERC20({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL
            });

            const treasuryInstance = await DeployHelper.deployTransferFromERC20Treasury({
                id: DEPLOY_IDS.TREASURY_ID,
                owner: treasuryAdmin,
                tokenAddr: tokenInstance.address,
                oracleAddr: oracleInstance.address,
                vaultAddr: addr1.address
            });

            return { 
                other,
                treasuryInstance, 
                treasuryAdmin, 
                tokenInstance, 
                oracleInstance 
            };
        }
    }
    
    public static mintERC20TreasuryFixture() {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const [owner] = await ethers.getSigners();
            const { utils } = ethers;
            const { treasuryAdmin, other } = await getNamedAccounts();
            const minterRole = utils.keccak256(utils.toUtf8Bytes("MINTER_ROLE"));
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const tokenInstance = await DeployHelper.deployFERC20({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL
            });

            const treasuryInstance = await DeployHelper.deployMintFERC20Treasury({
                id: DEPLOY_IDS.TREASURY_ID,
                owner: treasuryAdmin,
                tokenAddr: tokenInstance.address,
                oracleAddr: oracleInstance.address
            });

            await tokenInstance.grantRole(minterRole, treasuryInstance.address);

            return { 
                other,
                treasuryInstance, 
                treasuryAdmin, 
                tokenInstance, 
                oracleInstance 
            };
        }
    }

    public static invalidTokenAddr() {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const [owner] = await ethers.getSigners();
            const { treasuryAdmin, other } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const tokenInstance = await DeployHelper.deployFERC20({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL
            });

            const treasuryInstance = await DeployHelper.deployTreasury({
                id: DEPLOY_IDS.TREASURY_ID,
                owner: treasuryAdmin,
                tokenAddr: ethers.utils.getAddress(EMPTY_STRING),
                oracleAddr: oracleInstance.address
            });

            return { 
                other,
                treasuryInstance, 
                treasuryAdmin, 
                tokenInstance, 
                oracleInstance 
            };
        }
    }
    public static invalidOracleAddr() {
        return async ({ deployments, getNamedAccounts, ethers }: HardhatRuntimeEnvironment,) => {
            await deployments.fixture(); // ensure you start from a fresh deployments
            const { treasuryAdmin, other } = await getNamedAccounts();
            const oracleInstance = await DeployHelper.deployMockOracle(
                DEPLOY_IDS.MOCK_PRICE_ORACLE_ID, treasuryAdmin);

            const tokenInstance = await DeployHelper.deployFERC20({
                id: DEPLOY_IDS.TEST_ASSET_ID,
                owner: treasuryAdmin,
                name: DEPLOY_IDS.TEST_ASSET_NAME,
                symbol: DEPLOY_IDS.TEST_ASSET_SYMBOL
            });

            const treasuryInstance = await DeployHelper.deployTreasury({
                id: DEPLOY_IDS.TREASURY_ID,
                owner: treasuryAdmin,
                tokenAddr: tokenInstance.address,
                oracleAddr: ethers.utils.getAddress(EMPTY_STRING)
            });

            return { 
                other,
                treasuryInstance, 
                treasuryAdmin, 
                tokenInstance, 
                oracleInstance 
            };
        }
    }
}
