import { ServiceExecutor, ServiceRepository } from "@webspaceiq/service-objects";
import { DeployTokensServiceInfo } from "./services/token/deploy-tokens";
import { DeployTreasuryServiceInfo } from "./services/treasury/deploy";
import { DeployFERC20ServiceInfo } from "./services/token/deploy-ferc20";
import { DeployAFERC20ServiceInfo } from "./services/token/deploy-aferc20";
import { DeployNAFERC20ServiceInfo } from "./services/token/deploy-naferc20";
import { DeployOraclesServiceInfo } from "./services/oracle/deploy-oracles";
import { DeployGovernanceServiceInfo } from "./services/governance/deploy";
import { DeploySimplePriceOracleServiceInfo } from "./services/oracle/deploy-simple";
import { DeployChainlinkPriceOracleServiceInfo } from "./services/oracle/deploy-chainlink-oracle";
import { DeployChainlinkOracleAndOpratorServiceInfo } from "./services/oracle/deploy-chainlink";
import { DeployChainlinkOracleOperatorServiceInfo } from "./services/oracle/deploy-chainlink-operator";
import { DeployTimelockServiceInfo } from "./services/governance/deploy-timelock";
import { DeployGovernorServiceInfo } from "./services/governance/deploy-governor";
import { CreateProposalServiceInfo } from "./services/governance/create-proposal";

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
    DeploySimplePriceOracleServiceInfo,
    DeployChainlinkPriceOracleServiceInfo,
    DeployChainlinkOracleOperatorServiceInfo,
    DeployChainlinkOracleAndOpratorServiceInfo,
    CreateProposalServiceInfo
]);
export const serviceExecutor = new ServiceExecutor(repository);