import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { IPriceOracle } from "../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployChainlinkOracleOperatorServiceContext } from "../../types";

/**
 * This service deploys ONLY the Chainlink price oracle operator
 */
@IsService()
export class DeployChainlinkOracleOperatorService {

    public static serviceName = 'DeployChainlinkOracleOperatorService';

    async execute(context: IServiceContext<DeployChainlinkOracleOperatorServiceContext>): Promise<IPriceOracle> {
        const { id, hre, linkTokenAddr, deployer } = context.data;
        const { deployments } = hre;

        const priceOracleDeployment = await deployments.deploy(id, {
            contract: "MockOracle",
            from: deployer,
            args: [linkTokenAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(
            priceOracleDeployment.abi, priceOracleDeployment.address) as IPriceOracle;
    }
}

export const DeployChainlinkOracleOperatorServiceInfo = {
    serviceName: DeployChainlinkOracleOperatorService.serviceName,
    serviceContructor: DeployChainlinkOracleOperatorService
};