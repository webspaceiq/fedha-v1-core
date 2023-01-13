import { deployments, ethers } from "hardhat";
import { COMMON_DEPLOY_PARAMS } from "../../src/helpers/env";
import { AFERC20Options, NAFERC20Options, PriceOracleOptions, tEthereumAddress } from "../../src/types";
import { AFERC20, FERC20, IPriceOracle, LinkToken, NAFERC20 } from "../../typechain";
import { PRICE_ORACLE_ID } from "./deploy-ids";

export class DeployHelper {

    public static async deployTestLinkToken(id: string, owner: tEthereumAddress): Promise<LinkToken> {
        const { abi, address } = await deployments.deploy(id, {
            contract: "LinkToken",
            from: owner,
            args: [],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(abi, address) as LinkToken;
    }

    public static async getDeployedPriceOracle(assetSymbol: string): Promise<IPriceOracle> {
        const { abi, address } = await deployments.get(`${assetSymbol}${PRICE_ORACLE_ID}`);
        return await ethers.getContractAt(abi, address) as IPriceOracle;
    }
    
    public static async deployMockOracle(id: string, owner: tEthereumAddress): Promise<IPriceOracle> {
        const priceOracleDeployment = await deployments.deploy(`${id}${PRICE_ORACLE_ID}`, {
            contract: "MockPriceOracle",
            from: owner,
            args: [12],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(priceOracleDeployment.abi, priceOracleDeployment.address) as IPriceOracle;
    }
    
    public static async deployPriceOracle(options: PriceOracleOptions): Promise<IPriceOracle> {
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
        return await ethers.getContractAt(priceOracleDeployment.abi, priceOracleDeployment.address) as IPriceOracle;
    }

    public static async deployFERC20(id: string, owner: tEthereumAddress, name: string, symbol: string): Promise<FERC20> {
        const tokeneDeployment = await deployments.deploy(id, {
            contract: "FERC20",
            from: owner,
            args: [name, symbol],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(tokeneDeployment.abi, tokeneDeployment.address) as FERC20;
    }

    public static async deployAFERC20(options: AFERC20Options): Promise<AFERC20> {
        const {
            id,
            owner,
            name,
            symbol,
            oracleAddr,
            assetAddr } = options;

        const tokeneDeployment = await deployments.deploy(id, {
            contract: "AFERC20",
            from: owner,
            args: [name, symbol, oracleAddr, assetAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(tokeneDeployment.abi, tokeneDeployment.address) as AFERC20;
    }

    public static async deployNAFERC20(options: NAFERC20Options): Promise<NAFERC20> {
        const {
            id,
            owner,
            name,
            symbol,
            oracleAddr } = options;

        const tokeneDeployment = await deployments.deploy(id, {
            contract: "NAFERC20",
            from: owner,
            args: [name, symbol, oracleAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(tokeneDeployment.abi, tokeneDeployment.address) as NAFERC20;
    }
}