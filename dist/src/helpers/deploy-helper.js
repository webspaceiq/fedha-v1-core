"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployHelper = void 0;
const hardhat_1 = require("hardhat");
const env_1 = require("../../src/helpers/env");
const deploy_ids_1 = require("./deploy-ids");
class DeployHelper {
    static async deployTestLinkToken(id, owner) {
        const { abi, address } = await hardhat_1.deployments.deploy(id, {
            contract: "LinkToken",
            from: owner,
            args: [],
            ...env_1.COMMON_DEPLOY_PARAMS
        });
        return await hardhat_1.ethers.getContractAt(abi, address);
    }
    static async getDeployedPriceOracle(assetSymbol) {
        const { abi, address } = await hardhat_1.deployments.get(`${assetSymbol}${deploy_ids_1.PRICE_ORACLE_ID}`);
        return await hardhat_1.ethers.getContractAt(abi, address);
    }
    static async deployMockOracle(id, owner) {
        const priceOracleDeployment = await hardhat_1.deployments.deploy(`${id}${deploy_ids_1.PRICE_ORACLE_ID}`, {
            contract: "MockPriceOracle",
            from: owner,
            args: [12],
            ...env_1.COMMON_DEPLOY_PARAMS
        });
        return await hardhat_1.ethers.getContractAt(priceOracleDeployment.abi, priceOracleDeployment.address);
    }
    static async deployPriceOracle(options) {
        const priceOracleDeployment = await hardhat_1.deployments.deploy(`${options.id}${deploy_ids_1.PRICE_ORACLE_ID}`, {
            contract: "PriceOracle",
            from: options.owner,
            args: [
                options.httpUrl,
                options.jobId,
                options.oracleOperatorAddr,
                options.linkTokenAddr
            ],
            ...env_1.COMMON_DEPLOY_PARAMS
        });
        return await hardhat_1.ethers.getContractAt(priceOracleDeployment.abi, priceOracleDeployment.address);
    }
    static async deployFERC20(id, owner, name, symbol) {
        const tokeneDeployment = await hardhat_1.deployments.deploy(id, {
            contract: "FERC20",
            from: owner,
            args: [name, symbol],
            ...env_1.COMMON_DEPLOY_PARAMS
        });
        return await hardhat_1.ethers.getContractAt(tokeneDeployment.abi, tokeneDeployment.address);
    }
    static async deployAFERC20(options) {
        const { id, owner, name, symbol, oracleAddr, assetAddr } = options;
        const tokeneDeployment = await hardhat_1.deployments.deploy(id, {
            contract: "AFERC20",
            from: owner,
            args: [name, symbol, oracleAddr, assetAddr],
            ...env_1.COMMON_DEPLOY_PARAMS
        });
        return await hardhat_1.ethers.getContractAt(tokeneDeployment.abi, tokeneDeployment.address);
    }
    static async deployNAFERC20(options) {
        const { id, owner, name, symbol, oracleAddr } = options;
        const tokeneDeployment = await hardhat_1.deployments.deploy(id, {
            contract: "NAFERC20",
            from: owner,
            args: [name, symbol, oracleAddr],
            ...env_1.COMMON_DEPLOY_PARAMS
        });
        return await hardhat_1.ethers.getContractAt(tokeneDeployment.abi, tokeneDeployment.address);
    }
}
exports.DeployHelper = DeployHelper;
