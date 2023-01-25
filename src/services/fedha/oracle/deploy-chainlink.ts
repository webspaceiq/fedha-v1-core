import { IsService, IServiceContext } from "@webspaceiq/service-objects";
import { ethers } from "hardhat";
import * as TYPES from "../../../types";
import { serviceExecutor } from "../../..";
import { ITokenOracle } from "../../../../typechain";
import { DeployChainlinkTokenOracleService } from "./deploy-chainlink-oracle";
import { DeployChainlinkOracleOperatorService } from "./deploy-chainlink-operator";
import { PRICE_ORACLE_OPERATOR_ID_SUFFIX } from "../../../helpers/deploy-ids";

/**
 * This service deploys both the Chainlink 
 * price oracle and the price oracle's operator
 */
@IsService()
export class DeployChainlinkOracleAndOpratorService {

    public static serviceName = 'DeployChainlinkOracleAndOpratorService';

    async execute(context: IServiceContext<TYPES.DeployChainlinkOracleAndOpratorServiceContext>): Promise<ITokenOracle> {
        let {
            id,
            hre,
            jobId,
            httpUrl,
            configuration,
            linkTokenAddr
        } = context.data;
        const [deployer] = await ethers.getSigners();

        const operatorInstance = await serviceExecutor
            .executeService<TYPES.DeployChainlinkOracleOperatorServiceContext, Promise<ITokenOracle>>(
                {
                    data: {
                        id: `${id}${PRICE_ORACLE_OPERATOR_ID_SUFFIX}`,
                        hre,
                        configuration,
                        linkTokenAddr,
                        deployer: deployer.address,
                    }, serviceName: DeployChainlinkOracleOperatorService.serviceName
                }
            );

        return await serviceExecutor
            .executeService<TYPES.DeployChainlinkTokenOracleServiceContext, Promise<ITokenOracle>>(
                {
                    data: {
                        id,
                        hre,
                        jobId,
                        httpUrl,
                        linkTokenAddr,
                        configuration,
                        oracleOperatorAddr: operatorInstance.address,
                    }, serviceName: DeployChainlinkTokenOracleService.serviceName
                }
            );

    }
}

export const DeployChainlinkOracleAndOpratorServiceInfo = {
    serviceName: DeployChainlinkOracleAndOpratorService.serviceName,
    serviceContructor: DeployChainlinkOracleAndOpratorService
};