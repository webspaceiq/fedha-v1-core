import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { IPriceOracle } from "../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployChainlinkPriceOracleServiceContext } from "../../types";

/**
 * This service deploys both the Chainlink 
 * price oracle ONLY (WITHOUT a price oracle operator)
 */
@IsService()
export class DeployChainlinkPriceOracleService {

    public static serviceName = 'DeployChainlinkPriceOracleService';

    async execute(context: IServiceContext<DeployChainlinkPriceOracleServiceContext>): Promise<IPriceOracle> {
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
            contract: "PriceOracle",
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
        ) as IPriceOracle;
    }
}

export const DeployChainlinkPriceOracleServiceInfo = {
    serviceName: DeployChainlinkPriceOracleService.serviceName,
    serviceContructor: DeployChainlinkPriceOracleService
};