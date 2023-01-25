import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { ITokenOracle } from "../../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import { DeployChainlinkTokenOracleServiceContext } from "../../../types";

/**
 * This service deploys both the Chainlink 
 * price oracle ONLY (WITHOUT a price oracle operator)
 */
@IsService()
export class DeployChainlinkTokenOracleService {

    public static serviceName = 'DeployChainlinkTokenOracleService';

    async execute(context: IServiceContext<DeployChainlinkTokenOracleServiceContext>): Promise<ITokenOracle> {
        let {
            id,
            hre,
            jobId,
            httpUrl,
            linkTokenAddr,
            oracleOperatorAddr
        } = context.data;

        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();

        const priceOracleDeployment = await deployments.deploy(id, {
            contract: "TokenOracle",
            from: deployer,
            args: [
                httpUrl,
                jobId,
                oracleOperatorAddr,
                linkTokenAddr,
            ],
            ...COMMON_DEPLOY_PARAMS
        });
        
        return await ethers.getContractAt(
            priceOracleDeployment.abi, priceOracleDeployment.address
        ) as ITokenOracle;
    }
}

export const DeployChainlinkTokenOracleServiceInfo = {
    serviceName: DeployChainlinkTokenOracleService.serviceName,
    serviceContructor: DeployChainlinkTokenOracleService
};