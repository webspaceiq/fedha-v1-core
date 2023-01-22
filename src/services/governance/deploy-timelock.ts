import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployTimelockServiceContext } from "../../types";
import { FERC20VotesGovernorTimelock } from "../../../typechain";

@IsService()
export class DeployTimelockService {

    public static serviceName = 'DeployTimelockService';

    async execute(context: IServiceContext<DeployTimelockServiceContext>): Promise<FERC20VotesGovernorTimelock> {
        const {
            id,
            hre,
            timelockDelay,
            proposers,
            executors,
        } = context.data;

        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();

        const { abi, address} = await deployments.deploy(id, {
            contract: "FERC20VotesGovernorTimelock",
            from: deployer,
            args: [timelockDelay, proposers, executors, deployer],
            ...COMMON_DEPLOY_PARAMS
        });

        return await ethers.getContractAt(abi, address) as FERC20VotesGovernorTimelock
    }
}

export const DeployTimelockServiceInfo = {
    serviceName: DeployTimelockService.serviceName,
    serviceContructor: DeployTimelockService
};