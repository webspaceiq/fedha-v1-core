import { IServiceContext, IsService } from "@webspaceiq/service-objects";
import { AToken, DelegationAwareAToken, PoolAddressesProvider, StableDebtToken, VariableDebtToken } from "../../../typechain";
import { ZERO_ADDRESS } from "../../helpers/constants";
import { DeployHelper } from "../../helpers/deploy-helper";
import { AAVE_ATOKEN_IMPL_ID, AAVE_DELEGATION_AWARE_ATOKEN_IMPL_ID, AAVE_POOL_ADDRESSES_PROVIDER_ID, AAVE_STABLE_DEBT_TOKEN_IMPL_ID, AAVE_VARIABLE_DEBT_TOKEN_IMPL_ID } from "../../helpers/deploy-ids";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { DeployServiceContext } from "../../types";
import { TxnHelper } from "../../utilities/transaction";

@IsService()
export class DeployAaveTokensService {

    public static serviceName = 'DeployAaveTokensService';

    async execute(context: IServiceContext<DeployServiceContext>): Promise<void> {
        let { hre } = context.data;
        const { deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();

        const { deploy } = deployments;

          const addressesProviderInstance = (await DeployHelper.getDeployedContract(
            AAVE_POOL_ADDRESSES_PROVIDER_ID
          )) as PoolAddressesProvider;
        
          const poolAddress = await addressesProviderInstance.getPool();
        
          const aTokenArtifact = await deploy(AAVE_ATOKEN_IMPL_ID, {
            contract: "AToken",
            from: deployer,
            args: [poolAddress],
            ...COMMON_DEPLOY_PARAMS,
          });
        
          const aToken = (await hre.ethers.getContractAt(
            aTokenArtifact.abi,
            aTokenArtifact.address
          )) as AToken;
          await TxnHelper.waitForTx(
            await aToken.initialize(
              poolAddress, // initializingPool
              ZERO_ADDRESS, // treasury
              ZERO_ADDRESS, // underlyingAsset
              ZERO_ADDRESS, // incentivesController
              0, // aTokenDecimals
              "ATOKEN_IMPL", // aTokenName
              "ATOKEN_IMPL", // aTokenSymbol
              "0x00" // params
            )
          );
        
          const delegationAwareATokenArtifact = await deploy(
            AAVE_DELEGATION_AWARE_ATOKEN_IMPL_ID,
            {
              contract: "DelegationAwareAToken",
              from: deployer,
              args: [poolAddress],
              ...COMMON_DEPLOY_PARAMS,
            }
          );
        
          const delegationAwareAToken = (await hre.ethers.getContractAt(
            delegationAwareATokenArtifact.abi,
            delegationAwareATokenArtifact.address
          )) as DelegationAwareAToken;
          await TxnHelper.waitForTx(
            await delegationAwareAToken.initialize(
              poolAddress, // initializingPool
              ZERO_ADDRESS, // treasury
              ZERO_ADDRESS, // underlyingAsset
              ZERO_ADDRESS, // incentivesController
              0, // aTokenDecimals
              "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenName
              "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenSymbol
              "0x00" // params
            )
          );
        
          const stableDebtTokenArtifact = await deploy(AAVE_STABLE_DEBT_TOKEN_IMPL_ID, {
            contract: "StableDebtToken",
            from: deployer,
            args: [poolAddress],
            ...COMMON_DEPLOY_PARAMS,
          });
        
          const stableDebtToken = (await hre.ethers.getContractAt(
            stableDebtTokenArtifact.abi,
            stableDebtTokenArtifact.address
          )) as StableDebtToken;
          await TxnHelper.waitForTx(
            await stableDebtToken.initialize(
              poolAddress, // initializingPool
              ZERO_ADDRESS, // underlyingAsset
              ZERO_ADDRESS, // incentivesController
              0, // debtTokenDecimals
              "STABLE_DEBT_TOKEN_IMPL", // debtTokenName
              "STABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
              "0x00" // params
            )
          );
        
          const variableDebtTokenArtifact = await deploy(AAVE_VARIABLE_DEBT_TOKEN_IMPL_ID, {
            contract: "VariableDebtToken",
            from: deployer,
            args: [poolAddress],
            ...COMMON_DEPLOY_PARAMS,
          });
        
          const variableDebtToken = (await hre.ethers.getContractAt(
            variableDebtTokenArtifact.abi,
            variableDebtTokenArtifact.address
          )) as VariableDebtToken;
          await TxnHelper.waitForTx(
            await variableDebtToken.initialize(
              poolAddress, // initializingPool
              ZERO_ADDRESS, // underlyingAsset
              ZERO_ADDRESS, // incentivesController
              0, // debtTokenDecimals
              "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenName
              "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
              "0x00" // params
            )
          );
    }
}
export const DeployAaveTokensServiceInfo = {
    serviceName: DeployAaveTokensService.serviceName,
    serviceContructor: DeployAaveTokensService
};