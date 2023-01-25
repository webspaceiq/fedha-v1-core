import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { NAFERC20 } from "../../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import { DeployNAFERC20ServiceContext } from "../../../types";

@IsService()
export class DeployNAFERC20Service {

    public static serviceName = 'DeployNAFERC20Service';

    async execute(context: IServiceContext<DeployNAFERC20ServiceContext>): Promise<NAFERC20> {
        let {
            id,
            hre,
            tokenName,
            tokenSymbol,
            oracleAddr,
        } = context.data;

        const { deployments, getNamedAccounts } = hre;
        
        const { deployer } = await getNamedAccounts();

        const tokenDeployment = await deployments.deploy(id, {
            contract: "NAFERC20",
            from: deployer,
            args: [
                tokenName,
                tokenSymbol,
                oracleAddr
            ],
            ...COMMON_DEPLOY_PARAMS
        });

        return await ethers.getContractAt(
            tokenDeployment.abi, tokenDeployment.address) as NAFERC20;
    }

}
export const DeployNAFERC20ServiceInfo = {
    serviceName: DeployNAFERC20Service.serviceName,
    serviceContructor: DeployNAFERC20Service
};