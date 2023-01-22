import { BigNumber } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { FERC20VotesGovernor } from "../typechain";

export type tEthereumAddress = string;
export type tStringTokenBigUnits = string; // 1 ETH, or 10e6 USDC or 10e18 DAI
export type tBigNumberTokenBigUnits = BigNumber;
export type tStringTokenSmallUnits = string; // 1 wei, or 1 basic unit of USDC, or 1 basic unit of DAI
export type tBigNumberTokenSmallUnits = BigNumber;

export interface SymbolMap<T> {
    [symbol: string]: T;
}

export type eNetwork = eEthereumNetwork | ePolygonNetwork | eHarmonyNetwork;

export enum eEthereumNetwork {
    buidlerevm = "buidlerevm",
    kovan = "kovan",
    ropsten = "ropsten",
    main = "main",
    coverage = "coverage",
    hardhat = "hardhat",
    tenderly = "tenderly",
    rinkeby = "rinkeby",
    goerli = "goerli",
}

export enum ePolygonNetwork {
    polygon = "polygon",
    mumbai = "mumbai",
}

export enum eHarmonyNetwork {
    main = "harmony",
    testnet = "harmony-testnet",
}

export enum EthereumNetworkNames {
    kovan = "kovan",
    ropsten = "ropsten",
    main = "main",
    matic = "matic",
    mumbai = "mumbai",
    xdai = "xdai",
    avalanche = "avalanche",
    fuji = "fuji",
}

export type iParamsPerNetwork<T> = {
    [k in eNetwork]?: T;
};

export interface IOracleConfigutation {
    type: string;
    price?: string;
    jobId?: string;
    httpUrl?: string;
    address?: tEthereumAddress;
}

export interface IAssetConfigutation {
    type: string;
    name: string;
    symbol: string;
    decimals?: BigNumber;
    address?: tEthereumAddress;
    oracleAddr?: tEthereumAddress;
}

export interface ITreasuryConfiguration {
    id: string;
    type: string;
    tokenId: string;
    oracleId: string;
    vaultAddr?: tEthereumAddress;
}

export interface IGovernanceConfiguration {
    id: string;
    tokenId: string;
    timelockId: string;
    timelockDelay: string;
    initialVotingDelay: string;
    initialVotingPeriod: string;
    initialProposalThreshold: string;
    initialQuorumFraction: string;
}

export type IFedhaConfiguration = {
    MarketId: string;
    Treasury: ITreasuryConfiguration;
    Governance: IGovernanceConfiguration;
    LinkTokenConfig: iParamsPerNetwork<string>;
    PriceOracles: SymbolMap<IOracleConfigutation>;
    ReserveAssets: iParamsPerNetwork<SymbolMap<IAssetConfigutation>>;
};

export enum GovernanceProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}

export enum GovernanceVoteType {
    Against,
    For,
    Abstain
}

export type DeployOptions = {
    id: string;
    owner: tEthereumAddress;
};

export type FERC20Options = DeployOptions & {
    id: string;
    name: string;
    symbol: string;
};

export type AFERC20Options = FERC20Options & {
    oracleAddr: tEthereumAddress;
    assetAddr: tEthereumAddress;
};

export type NAFERC20Options = FERC20Options & {
    oracleAddr: tEthereumAddress;
};

export type PriceOracleOptions = DeployOptions & {
    jobId: string;
    httpUrl?: string;
    linkTokenAddr: tEthereumAddress;
    oracleOperatorAddr: tEthereumAddress;
};

export type TreasuryDeployOptions = DeployOptions & {
    tokenAddr: tEthereumAddress;
    oracleAddr: tEthereumAddress;
};

export type TransferFromFERC20TreasuryDeployOptions = TreasuryDeployOptions & {
    vaultAddr: tEthereumAddress;
};

export type DeployGovernanceOptions =  {
    owner: any;
    governorId: string;
    governorName: string;
    tokenId: string;
    timelockId: string;
    timelockDelay: BigNumber;
    initialVotingDelay: BigNumber;
    initialVotingPeriod: BigNumber;
    initialProposalThreshold: BigNumber;
    initialQuorumFraction: BigNumber;
};

export type ProposalRequest = {
    governorInstance: FERC20VotesGovernor, 
    targets: tEthereumAddress[];
    values: BigNumber[];
    calldatas: any[];
    descriptionHash: string;
}

export type DeployServiceContext = {
    id: string;
    hre: HardhatRuntimeEnvironment;
    configuration: IFedhaConfiguration;
}

export type DeployTokensServiceContext = DeployServiceContext & {
    assets: IAssetConfigutation[];
}

export type DeployTreasuryServiceContext = DeployServiceContext & {
    type: string;
    deployer: tEthereumAddress;
    tokenAddr: tEthereumAddress;
    oracleAddr: tEthereumAddress;
    vaultAddr?: tEthereumAddress;
}

export type DeployFERC20ServiceContext = DeployServiceContext & {
    tokenName: string;
    tokenSymbol: string;
}

export type DeployNAFERC20ServiceContext = DeployFERC20ServiceContext & {
    oracleAddr: tEthereumAddress;
}

export type DeployAFERC20ServiceContext = DeployNAFERC20ServiceContext & {
    tokenAddr: tEthereumAddress;
}

export type DeploySimplePriceOracleServiceContext = DeployServiceContext & {
    price: BigNumber;
}

export type DeployChainlinkPriceOracleServiceContext = DeployServiceContext & {
    jobId?: string;
    httpUrl?: string;
    linkTokenAddr: tEthereumAddress;
    oracleOperatorAddr: tEthereumAddress;
}

export type DeployChainlinkOracleOperatorServiceContext = DeployServiceContext & {
    linkTokenAddr: tEthereumAddress;
    deployer: tEthereumAddress;
}

export type DeployChainlinkOracleAndOpratorServiceContext = Omit<DeployChainlinkPriceOracleServiceContext, "oracleOperatorAddr"> & {
}


export type DeployTimelockServiceContext = DeployServiceContext & {
    timelockDelay: BigNumber,
    proposers: tEthereumAddress[];
    executors: tEthereumAddress[];
}

export type DeployGovernorServiceContext = DeployServiceContext & {
    deployer: tEthereumAddress;
    tokenAddr: tEthereumAddress;
    timelockAddr: tEthereumAddress;
    initialVotingDelay: BigNumber;
    initialVotingPeriod: BigNumber;
    initialProposalThreshold: BigNumber;
    initialQuorumFraction: BigNumber;
}

export type DeployGovernanceServiceContext = DeployTimelockServiceContext & Omit<DeployGovernorServiceContext, "tokenAddr" | "timelockAddr"> & {
    tokenId: string;
    timelockId: string;
    treasuryId: string;
}

export type CreateProposalServiceContext = DeployServiceContext & {
    tokenId: string;
    transferCalldata: any,
    descriptionHash: string,
    deployer: tEthereumAddress;
}