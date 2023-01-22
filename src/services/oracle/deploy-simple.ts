import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { IPriceOracle } from "../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeploySimplePriceOracleServiceContext } from "../../types";

/**
 * This service deploys a SimplePriceOracle contract
 */
@IsService()
export class DeploySimplePriceOracleService {

    public static serviceName = 'DeploySimplePriceOracleService';

    async execute(context: IServiceContext<DeploySimplePriceOracleServiceContext>): Promise<IPriceOracle> {
        let { id, hre, price } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { deployer  } = await getNamedAccounts();

        const priceOracleDeployment = await deployments.deploy(id, {
            contract: "SimplePriceOracle",
            from: deployer,
            args: [price],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(
            priceOracleDeployment.abi, priceOracleDeployment.address) as IPriceOracle;
    }
}

export const DeploySimplePriceOracleServiceInfo = {
    serviceName: DeploySimplePriceOracleService.serviceName,
    serviceContructor: DeploySimplePriceOracleService
};