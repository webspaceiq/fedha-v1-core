import { ServiceExecutor, ServiceRepository } from "@webspaceiq/service-objects";
import { DeployTokensServiceInfo } from "./services/fedha/token/deploy-tokens";
import { DeployTreasuryServiceInfo } from "./services/fedha/treasury/deploy";
import { DeployFERC20ServiceInfo } from "./services/fedha/token/deploy-ferc20";
import { DeployAFERC20ServiceInfo } from "./services/fedha/token/deploy-aferc20";
import { DeployNAFERC20ServiceInfo } from "./services/fedha/token/deploy-naferc20";
import { DeployOraclesServiceInfo } from "./services/fedha/oracle/deploy-oracles";
import { DeployGovernanceServiceInfo } from "./services/fedha/governance/deploy";
import { DeploySimpleTokenOracleServiceInfo } from "./services/fedha/oracle/deploy-simple";
import { DeployChainlinkTokenOracleServiceInfo } from "./services/fedha/oracle/deploy-chainlink-oracle";
import { DeployChainlinkOracleAndOpratorServiceInfo } from "./services/fedha/oracle/deploy-chainlink";
import { DeployChainlinkOracleOperatorServiceInfo } from "./services/fedha/oracle/deploy-chainlink-operator";
import { DeployTimelockServiceInfo } from "./services/fedha/governance/deploy-timelock";
import { DeployGovernorServiceInfo } from "./services/fedha/governance/deploy-governor";
import { CreateProposalServiceInfo } from "./services/fedha/governance/create-proposal";
import { DeployUniswapFactoryV2ServiceInfo } from "./services/uniswap/deploy-factory";
import { DeployUniswapPairsV2ServiceInfo } from "./services/uniswap/deploy-pairs";

export const repository = new ServiceRepository([
    DeployTokensServiceInfo,
    DeployFERC20ServiceInfo,
    DeployAFERC20ServiceInfo,
    DeployNAFERC20ServiceInfo,
    DeployTreasuryServiceInfo,
    DeployGovernanceServiceInfo,
    DeployTimelockServiceInfo,
    DeployGovernorServiceInfo,
    DeployOraclesServiceInfo,
    DeploySimpleTokenOracleServiceInfo,
    DeployChainlinkTokenOracleServiceInfo,
    DeployChainlinkOracleOperatorServiceInfo,
    DeployChainlinkOracleAndOpratorServiceInfo,
    CreateProposalServiceInfo,
    DeployUniswapFactoryV2ServiceInfo,
    DeployUniswapPairsV2ServiceInfo
]);
export const serviceExecutor = new ServiceExecutor(repository);