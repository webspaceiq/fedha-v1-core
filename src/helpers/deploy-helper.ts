import { deployments, ethers } from "hardhat";
import * as TYPES from "../../src/types";
import * as TYPECHAIN from "../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../src/helpers/env";
import { AAVE_POOL_CONFIGURATOR_PROXY_ID, PRICE_ORACLE_ID } from "./deploy-ids";
import { Contract } from "ethers";
import { ConfigUtil } from "../utilities/config";

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

    public static async getDeployedTimelock(id: string): Promise<TYPECHAIN.FERC20VotesGovernorTimelock> {
        const { abi, address } = await deployments.get(id);
        return await ethers.getContractAt(abi, address) as TYPECHAIN.FERC20VotesGovernorTimelock;
    }

    public static async getDeployedERC20Token(id: string): Promise<TYPECHAIN.FERC20> {
        const { abi, address } = await deployments.get(id);
        return await ethers.getContractAt(abi, address) as TYPECHAIN.FERC20;
    }

    public static async getDeployedTokenOracle(id: string): Promise<TYPECHAIN.ITokenOracle> {
        const { abi, address } = await deployments.get(id);
        return await ethers.getContractAt(abi, address) as TYPECHAIN.ITokenOracle;
    }

    public static async getDeployedChainlinkMockOracle(id: string): Promise<TYPECHAIN.MockOracle> {
        const { abi, address } = await deployments.get(id);
        return await ethers.getContractAt(abi, address) as TYPECHAIN.MockOracle;
    }

    public static async getDeployedTreasury(id: string): Promise<TYPECHAIN.ITreasury> {
        const { abi, address } = await deployments.get(id);
        return await ethers.getContractAt(abi, address) as TYPECHAIN.ITreasury;
    }

    public static async getDeployedGovernor(id: string): Promise<TYPECHAIN.FERC20VotesGovernor> {
        const { abi, address } = await deployments.get(id);
        return await ethers.getContractAt(abi, address) as TYPECHAIN.FERC20VotesGovernor;
    }

    public static async getDeployedContract(id: string): Promise<Contract> {
        const { abi, address } = await deployments.get(id);
        return await ethers.getContractAt(abi, address) as Contract;
    }

    public static async deployMockOracle(id: string, owner: TYPES.tEthereumAddress): Promise<TYPECHAIN.ITokenOracle> {
        const priceOracleDeployment = await deployments.deploy(`${id}${PRICE_ORACLE_ID}`, {
            contract: "MockTokenOracle",
            from: owner,
            args: [12],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(
            priceOracleDeployment.abi, priceOracleDeployment.address) as TYPECHAIN.ITokenOracle;
    }

    public static async deployTokenOracle(options: TYPES.TokenOracleOptions): Promise<TYPECHAIN.ITokenOracle> {
        const priceOracleDeployment = await deployments.deploy(`${options.id}${PRICE_ORACLE_ID}`, {
            contract: "TokenOracle",
            from: options.owner,
            args: [
                options.httpUrl,
                options.jobId,
                options.oracleOperatorAddr,
                options.linkTokenAddr
            ],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(
            priceOracleDeployment.abi, priceOracleDeployment.address) as TYPECHAIN.ITokenOracle;
    }

    public static async getContract<ContractType extends Contract>(
        id: string,
        address?: TYPES.tEthereumAddress
    ): Promise<ContractType> {
        const artifact = await deployments.getArtifact(id);
        return ethers.getContractAt(
            artifact.abi,
            address || (await (await deployments.get(id)).address)
        ) as any as ContractType;
    };

    public static async getPoolConfiguratorProxy(address?: TYPES.tEthereumAddress): Promise<TYPECHAIN.PoolConfigurator> {
        return DeployHelper.getContract(
            "PoolConfigurator",
            address || (await deployments.get(AAVE_POOL_CONFIGURATOR_PROXY_ID)).address
        );
    }

    public static async getAddressesOfAllAssets(
        configuration: TYPES.IFedhaConfiguration, network: TYPES.eNetwork): Promise<TYPES.ITokenAddress> {
        const assets = ConfigUtil.getReserveAssets(configuration, network);

        const tokenAddresses: TYPES.ITokenAddress = {};
        for (let index = 0; index < assets.length; index++) {
            const { symbol } = assets[index];
            const { address } = await this.getDeployedContract(symbol);
            tokenAddresses[symbol] = address;
        }
        return tokenAddresses;
    }


}