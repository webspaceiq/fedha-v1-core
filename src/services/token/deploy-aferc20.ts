import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { AFERC20 } from "../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployAFERC20ServiceContext } from "../../types";

@IsService()
export class DeployAFERC20Service {

    public static serviceName = 'DeployAFERC20Service';

    async execute(context: IServiceContext<DeployAFERC20ServiceContext>): Promise<AFERC20> {
        let {
            id,
            hre,
            tokenName,
            tokenSymbol,
            oracleAddr,
            tokenAddr,
        } = context.data;

        const { deployments, getNamedAccounts } = hre;

        const { deployer } = await getNamedAccounts();

        const tokenDeployment = await deployments.deploy(id, {
            contract: "AFERC20",
            from: deployer,
            args: [
                tokenName,
                tokenSymbol,
                oracleAddr,
                tokenAddr
            ],
            ...COMMON_DEPLOY_PARAMS
        });

        return await ethers.getContractAt(
            tokenDeployment.abi, tokenDeployment.address) as AFERC20;
    }

}
export const DeployAFERC20ServiceInfo = {
    serviceName: DeployAFERC20Service.serviceName,
    serviceContructor: DeployAFERC20Service
};