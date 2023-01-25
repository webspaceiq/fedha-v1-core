import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { ITokenOracle } from "../../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import { DeploySimpleTokenOracleServiceContext } from "../../../types";

/**
 * This service deploys a SimpleTokenOracle contract
 */
@IsService()
export class DeploySimpleTokenOracleService {

    public static serviceName = 'DeploySimpleTokenOracleService';

    async execute(context: IServiceContext<DeploySimpleTokenOracleServiceContext>): Promise<ITokenOracle> {
        let { id, hre, price } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { deployer  } = await getNamedAccounts();

        const priceOracleDeployment = await deployments.deploy(id, {
            contract: "SimpleTokenOracle",
            from: deployer,
            args: [price],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(
            priceOracleDeployment.abi, priceOracleDeployment.address) as ITokenOracle;
    }
}

export const DeploySimpleTokenOracleServiceInfo = {
    serviceName: DeploySimpleTokenOracleService.serviceName,
    serviceContructor: DeploySimpleTokenOracleService
};