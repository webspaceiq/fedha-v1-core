import { deployments, ethers } from "hardhat";
import { COMMON_DEPLOY_PARAMS } from "../../src/helpers/env";
import * as TYPES from "../../src/types";
import * as TYPECHAIN from "../../typechain";
import { PRICE_ORACLE_ID } from "./deploy-ids";

export class DeployHelper {

    public static async deployTestLinkToken(id: string, owner: TYPES.tEthereumAddress): Promise<TYPECHAIN.LinkToken> {
        const { abi, address } = await deployments.deploy(id, {
            contract: "LinkToken",
            from: owner,
            args: [],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(abi, address) as TYPECHAIN.LinkToken;
    }

    public static async getDeployedPriceOracle(assetSymbol: string): Promise<TYPECHAIN.IPriceOracle> {
        const { abi, address } = await deployments.get(`${assetSymbol}${PRICE_ORACLE_ID}`);
        return await ethers.getContractAt(abi, address) as TYPECHAIN.IPriceOracle;
    }

    public static async deployMockOracle(id: string, owner: TYPES.tEthereumAddress): Promise<TYPECHAIN.IPriceOracle> {
        const priceOracleDeployment = await deployments.deploy(`${id}${PRICE_ORACLE_ID}`, {
            contract: "MockPriceOracle",
            from: owner,
            args: [12],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(priceOracleDeployment.abi, priceOracleDeployment.address) as TYPECHAIN.IPriceOracle;
    }

    public static async deployPriceOracle(options: TYPES.PriceOracleOptions): Promise<TYPECHAIN.IPriceOracle> {
        const priceOracleDeployment = await deployments.deploy(`${options.id}${PRICE_ORACLE_ID}`, {
            contract: "PriceOracle",
            from: options.owner,
            args: [
                options.httpUrl,
                options.jobId,
                options.oracleOperatorAddr,
                options.linkTokenAddr
            ],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(priceOracleDeployment.abi, priceOracleDeployment.address) as TYPECHAIN.IPriceOracle;
    }

    public static async deployFERC20(options: TYPES.FERC20Options): Promise<TYPECHAIN.FERC20> {
        const { id, owner, name, symbol } = options;
        const tokenDeployment = await deployments.deploy(id, {
            contract: "FERC20",
            from: owner,
            args: [name, symbol],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(tokenDeployment.abi, tokenDeployment.address) as TYPECHAIN.FERC20;
    }

    public static async deployFERC20Votes(options: TYPES.FERC20Options): Promise<TYPECHAIN.FERC20Votes> {
        const { id, owner, name, symbol } = options;
        const tokenDeployment = await deployments.deploy(id, {
            contract: "FERC20Votes",
            from: owner,
            args: [name, symbol],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(tokenDeployment.abi, tokenDeployment.address) as TYPECHAIN.FERC20Votes;
    }

    public static async deployAFERC20(options: TYPES.AFERC20Options): Promise<TYPECHAIN.AFERC20> {
        const {
            id,
            owner,
            name,
            symbol,
            oracleAddr,
            assetAddr } = options;

        const tokenDeployment = await deployments.deploy(id, {
            contract: "AFERC20",
            from: owner,
            args: [name, symbol, oracleAddr, assetAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(tokenDeployment.abi, tokenDeployment.address) as TYPECHAIN.AFERC20;
    }

    public static async deployNAFERC20(options: TYPES.NAFERC20Options): Promise<TYPECHAIN.NAFERC20> {
        const {
            id,
            owner,
            name,
            symbol,
            oracleAddr } = options;

        const tokenDeployment = await deployments.deploy(id, {
            contract: "NAFERC20",
            from: owner,
            args: [name, symbol, oracleAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(tokenDeployment.abi, tokenDeployment.address) as TYPECHAIN.NAFERC20;
    }

    public static async deployTreasury(options: TYPES.TreasuryDeployOptions): Promise<TYPECHAIN.Treasury> {
        const { id, owner, tokenAddr, oracleAddr } = options;
        const treasuryDeployment = await deployments.deploy(id, {
            contract: "Treasury",
            from: owner,
            args: [tokenAddr, oracleAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(treasuryDeployment.abi, treasuryDeployment.address) as TYPECHAIN.Treasury;
    }

    public static async deployTransferFromERC20Treasury(options: TYPES.TransferFromFERC20TreasuryDeployOptions): Promise<TYPECHAIN.Treasury> {
        const { id, owner, tokenAddr, oracleAddr, vaultAddr } = options;
        const treasuryDeployment = await deployments.deploy(id, {
            contract: "TransferFromFERC20Treasury",
            from: owner,
            args: [tokenAddr, oracleAddr, vaultAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(treasuryDeployment.abi, treasuryDeployment.address) as TYPECHAIN.Treasury;
    }

    public static async deployMintFERC20Treasury(options: TYPES.TreasuryDeployOptions): Promise<TYPECHAIN.Treasury> {
        const { id, owner, tokenAddr, oracleAddr } = options;
        const treasuryDeployment = await deployments.deploy(id, {
            contract: "MintFERC20Treasury",
            from: owner,
            args: [tokenAddr, oracleAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(treasuryDeployment.abi, treasuryDeployment.address) as TYPECHAIN.Treasury;
    }

    public static async deployTimelockController(options: TYPES.TimelockDeployOptions): Promise<TYPECHAIN.FERC20VotesGovernorTimelock> {
        const { id, owner } = options;
        const timelockDeployment = await deployments.deploy(id, {
            contract: "FERC20VotesGovernorTimelock",
            from: owner,
            args: [options.minDelay, options.proposers, options.executors, options.admin],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(timelockDeployment.abi, timelockDeployment.address) as TYPECHAIN.FERC20VotesGovernorTimelock;
    }

    public static async deployGovernor(options: TYPES.GovernorDeployOptions): Promise<TYPECHAIN.FERC20VotesGovernor> {
        const { id, owner, name, tokenAddr, timelockAddr } = options;

        const govenorDeployment = await deployments.deploy(id, {
            contract: "FERC20VotesGovernor",
            from: owner,
            args: [name, tokenAddr, timelockAddr],
            ...COMMON_DEPLOY_PARAMS
        });


        const hashOfTx = govenorDeployment.transactionHash

        let contract = await ethers.getContractAt(
            govenorDeployment.abi, govenorDeployment.address);
            
        return contract as TYPECHAIN.FERC20VotesGovernor
    }
}