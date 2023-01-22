import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { FERC20 } from "../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployFERC20ServiceContext } from "../../types";

@IsService()
export class DeployFERC20Service {

    public static serviceName = 'DeployFERC20Service';

    async execute(context: IServiceContext<DeployFERC20ServiceContext>): Promise<FERC20> {
        let {
            id,
            hre,
            tokenName,
            tokenSymbol,
        } = context.data;

        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();

        const tokenDeployment = await deployments.deploy(id, {
            contract: "FERC20",
            from: deployer,
            args: [tokenName, tokenSymbol],
            ...COMMON_DEPLOY_PARAMS
        });

        return await ethers.getContractAt(
            tokenDeployment.abi, tokenDeployment.address) as FERC20;
    }

}
export const DeployFERC20ServiceInfo = {
    serviceName: DeployFERC20Service.serviceName,
    serviceContructor: DeployFERC20Service
};