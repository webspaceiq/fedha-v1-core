import { BigNumber } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { FERC20VotesGovernor } from "../typechain";

export type tEthereumAddress = string;
export type tStringTokenBigUnits = string; // 1 ETH, or 10e6 USDC or 10e18 DAI
export type tBigNumberTokenBigUnits = BigNumber;
export type tStringTokenSmallUnits = string; // 1 wei, or 1 basic unit of USDC, or 1 basic unit of DAI
export type tBigNumberTokenSmallUnits = BigNumber;


export interface ITokenAddress {
    [token: string]: tEthereumAddress;
  }
  
  export interface ITokenDecimals {
    [token: string]: number;
  }
export interface iAssetCommon<T> {
    [key: string]: T;
}

export interface iAssetBase<T> {
    WETH: T;
    DAI: T;
    TUSD: T;
    USDC: T;
    USDT: T;
    SUSD: T;
    AAVE: T;
    BAT: T;
    MKR: T;
    LINK: T;
    KNC: T;
    WBTC: T;
    MANA: T;
    ZRX: T;
    SNX: T;
    BUSD: T;
    YFI: T;
    UNI: T;
    USD: T;
    REN: T;
    ENJ: T;
    UniDAIWETH: T;
    UniWBTCWETH: T;
    UniAAVEWETH: T;
    UniBATWETH: T;
    UniDAIUSDC: T;
    UniCRVWETH: T;
    UniLINKWETH: T;
    UniMKRWETH: T;
    UniRENWETH: T;
    UniSNXWETH: T;
    UniUNIWETH: T;
    UniUSDCWETH: T;
    UniWBTCUSDC: T;
    UniYFIWETH: T;
    BptWBTCWETH: T;
    BptBALWETH: T;
    WMATIC: T;
    STAKE: T;
    xSUSHI: T;
    AVAX: T;
}

export type iAssetsWithoutETH<T> = Omit<iAssetBase<T>, "ETH">;

export type iAssetsWithoutUSD<T> = Omit<iAssetBase<T>, "USD">;

export type iAavePoolAssets<T> = Pick<
    iAssetsWithoutUSD<T>,
    "DAI" | "USDC" | "AAVE" | "LINK" | "WBTC" | "WETH"
>;

export type iLpPoolAssets<T> = Pick<
    iAssetsWithoutUSD<T>,
    | "DAI"
    | "USDC"
    | "USDT"
    | "WBTC"
    | "WETH"
    | "UniDAIWETH"
    | "UniWBTCWETH"
    | "UniAAVEWETH"
    | "UniBATWETH"
    | "UniDAIUSDC"
    | "UniCRVWETH"
    | "UniLINKWETH"
    | "UniMKRWETH"
    | "UniRENWETH"
    | "UniSNXWETH"
    | "UniUNIWETH"
    | "UniUSDCWETH"
    | "UniWBTCUSDC"
    | "UniYFIWETH"
    | "BptWBTCWETH"
    | "BptBALWETH"
>;

export type iMaticPoolAssets<T> = Pick<
    iAssetsWithoutUSD<T>,
    "DAI" | "USDC" | "USDT" | "WBTC" | "WETH" | "WMATIC" | "AAVE"
>;

export type iXDAIPoolAssets<T> = Pick<
    iAssetsWithoutUSD<T>,
    "DAI" | "USDC" | "USDT" | "WBTC" | "WETH" | "STAKE"
>;

export type iAvalanchePoolAssets<T> = Pick<
    iAssetsWithoutUSD<T>,
    "WETH" | "DAI" | "USDC" | "USDT" | "AAVE" | "WBTC" | "AVAX"
>;

export type iMultiPoolsAssets<T> = iAssetCommon<T> | iAavePoolAssets<T>;

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

export interface IAssetPairConfigutation {
    tokenA: string;
    tokenB: string;
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
    ProviderId: number;
    ATokenNamePrefix: string;
    StableDebtTokenNamePrefix: string;
    VariableDebtTokenNamePrefix: string;
    SymbolPrefix: string;
    OracleQuoteCurrency: string;
    OracleQuoteUnit: string;
    OracleQuoteCurrencyAddress: tEthereumAddress;
    Treasury: ITreasuryConfiguration;
    Governance: IGovernanceConfiguration;
    LinkTokenConfig: iParamsPerNetwork<string>;
    TokenOracles: SymbolMap<IOracleConfigutation>;
    ReserveAssets: iParamsPerNetwork<SymbolMap<IAssetConfigutation>>;
    ReservesConfig: SymbolMap<any>;
    AssetPairs: iParamsPerNetwork<SymbolMap<IAssetPairConfigutation>>;
    FlashLoanPremiums: {
        total: number;
        protocol: number;
    };
    RateStrategies: IStrategy;
};

// AAVE
export enum eContractid {
    Example = "Example",
    PoolAddressesProvider = "PoolAddressesProvider",
    MintableERC20 = "MintableERC20",
    MintableDelegationERC20 = "MintableDelegationERC20",
    PoolAddressesProviderRegistry = "PoolAddressesProviderRegistry",
    PoolConfigurator = "PoolConfigurator",
    ValidationLogic = "ValidationLogic",
    ReserveLogic = "ReserveLogic",
    GenericLogic = "GenericLogic",
    Pool = "Pool",
    PriceOracle = "PriceOracle",
    Proxy = "Proxy",
    MockAggregator = "MockAggregator",
    AaveOracle = "AaveOracle",
    DefaultReserveInterestRateStrategy = "DefaultReserveInterestRateStrategy",
    LendingPoolCollateralManager = "LendingPoolCollateralManager",
    InitializableAdminUpgradeabilityProxy = "InitializableAdminUpgradeabilityProxy",
    MockFlashLoanReceiver = "MockFlashLoanReceiver",
    WalletBalanceProvider = "WalletBalanceProvider",
    AToken = "AToken",
    MockAToken = "MockAToken",
    DelegationAwareAToken = "DelegationAwareAToken",
    MockStableDebtToken = "MockStableDebtToken",
    MockVariableDebtToken = "MockVariableDebtToken",
    AaveProtocolDataProvider = "AaveProtocolDataProvider",
    IERC20Detailed = "IERC20Detailed",
    StableDebtToken = "StableDebtToken",
    VariableDebtToken = "VariableDebtToken",
    FeeProvider = "FeeProvider",
    TokenDistributor = "TokenDistributor",
    StableAndVariableTokensHelper = "StableAndVariableTokensHelper",
    ATokensAndRatesHelper = "ATokensAndRatesHelper",
    UiPoolDataProviderV3 = "UiPoolDataProviderV3",
    WrappedTokenGatewayV3 = "WrappedTokenGatewayV3",
    WETH = "WETH",
}

export interface IReserveParams
    extends IReserveBorrowParams,
    IReserveCollateralParams {
    aTokenImpl: eContractid;
    reserveFactor: string;
    supplyCap: string;
    strategy: IInterestRateStrategyParams;
}

export interface IStrategy {
    [key: string]: IInterestRateStrategyParams;
}

export interface IInterestRateStrategyParams {
    name: string;
    optimalUsageRatio: string;
    baseVariableBorrowRate: string;
    variableRateSlope1: string;
    variableRateSlope2: string;
    stableRateSlope1: string;
    stableRateSlope2: string;
    baseStableRateOffset: string;
    stableRateExcessOffset: string;
    optimalStableToTotalDebtRatio: string;
}

export interface IReserveBorrowParams {
    borrowingEnabled: boolean;
    stableBorrowRateEnabled: boolean;
    reserveDecimals: string;
    borrowCap: string;
    debtCeiling: string;
    borrowableIsolation: boolean;
    flashLoanEnabled: boolean;
}

export interface IReserveCollateralParams {
    baseLTVAsCollateral: string;
    liquidationThreshold: string;
    liquidationBonus: string;
    liquidationProtocolFee?: string;
}



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

export type TokenOracleOptions = DeployOptions & {
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

export type DeployGovernanceOptions = {
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
export type DeployUniswapPairsV2ServiceContext = DeployServiceContext & {
    assetPairs: IAssetPairConfigutation[];
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

export type DeploySimpleTokenOracleServiceContext = DeployServiceContext & {
    price: BigNumber;
}

export type DeployChainlinkTokenOracleServiceContext = DeployServiceContext & {
    jobId?: string;
    httpUrl?: string;
    linkTokenAddr: tEthereumAddress;
    oracleOperatorAddr: tEthereumAddress;
}

export type DeployChainlinkOracleOperatorServiceContext = DeployServiceContext & {
    linkTokenAddr: tEthereumAddress;
    deployer: tEthereumAddress;
}

export type DeployChainlinkOracleAndOpratorServiceContext = Omit<DeployChainlinkTokenOracleServiceContext, "oracleOperatorAddr"> & {
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