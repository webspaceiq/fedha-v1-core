import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { ITreasury } from "../../../../typechain";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import { DeployTreasuryServiceContext } from "../../../types";
import { TREASURY_TYPE_MINT, TREASURY_TYPE_TRANSFER, TREASURY_TYPE_TRANSFER_FROM } from "../../../helpers/constants";

@IsService()
export class DeployTreasuryService {

    public static serviceName = 'DeployTreasuryService';

    async execute(context: IServiceContext<DeployTreasuryServiceContext>): Promise<ITreasury> {
        const { type } = context.data;

        switch (type) {
            case TREASURY_TYPE_TRANSFER:
                return await this.deployTreasury(context);
            case TREASURY_TYPE_TRANSFER_FROM:
                return await this.deployTransferFromTreasury(context);
            case TREASURY_TYPE_MINT:
                return await this.deployTreasury(context);
            default:
                throw new Error("Invalid treasury type");
        }
    }

    private async deployTransferFromTreasury(context: IServiceContext<DeployTreasuryServiceContext>) {
        const {
            id,
            hre,
            deployer,
            tokenAddr,
            vaultAddr,
            oracleAddr,
        } = context.data;

        const { deployments } = hre;

        const { abi, address } = await deployments.deploy(id, {
            from: deployer,
            contract: "TransferFromFERC20Treasury",
            args: [tokenAddr, oracleAddr, vaultAddr],
            ...COMMON_DEPLOY_PARAMS
        });
        return await ethers.getContractAt(abi, address) as ITreasury;
    }

    private async deployTreasury(context: IServiceContext<DeployTreasuryServiceContext>) {
        const {
            id,
            hre,
            type,
            deployer,
            tokenAddr,
            oracleAddr,
        } = context.data;

        const { deployments } = hre;

        const contract = (type === TREASURY_TYPE_TRANSFER) ? "Treasury" : "MintFERC20Treasury";

        const { abi, address } = await deployments.deploy(id, {
            contract,
            from: deployer,
            args: [tokenAddr, oracleAddr],
            ...COMMON_DEPLOY_PARAMS
        });

        return await ethers.getContractAt(abi, address) as ITreasury;
    }
}

export const DeployTreasuryServiceInfo = {
    serviceName: DeployTreasuryService.serviceName,
    serviceContructor: DeployTreasuryService
};