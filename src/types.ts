import { BigNumber } from "ethers";

export type tEthereumAddress = string;
export type tStringTokenBigUnits = string; // 1 ETH, or 10e6 USDC or 10e18 DAI
export type tBigNumberTokenBigUnits = BigNumber;
export type tStringTokenSmallUnits = string; // 1 wei, or 1 basic unit of USDC, or 1 basic unit of DAI
export type tBigNumberTokenSmallUnits = BigNumber;

export interface SymbolMap<T> {
    [symbol: string]: T;
}

export type eNetwork =
    | eEthereumNetwork
    | ePolygonNetwork
    | eHarmonyNetwork;

export enum eEthereumNetwork {
    buidlerevm = "buidlerevm",
    kovan = "kovan",
    ropsten = "ropsten",
    main = "main",
    coverage = "coverage",
    hardhat = "hardhat",
    tenderly = "tenderly",
    rinkeby = "rinkeby",
    görli = "görli",
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
    jobId: string;
    httpUrl?: string;
    address?: tEthereumAddress;
}

export interface IAssetConfigutation {
    name: string;
    symbol: string;
    decimals?: BigNumber;
    address?: tEthereumAddress;
    oracleAddr?: tEthereumAddress;
}

export type IFedhaConfiguration = {
    MarketId: string;
    LinkTokenConfig: iParamsPerNetwork<string>;
    PriceOracles: SymbolMap<IOracleConfigutation>;
    ReserveAssets: iParamsPerNetwork<SymbolMap<IAssetConfigutation>>;
}

export type DeployOptions = {
    id: string;
    owner: tEthereumAddress;
}

export type FERC20Options = DeployOptions & {
    id: string;
    name: string;
    symbol: string;
}

export type AFERC20Options = FERC20Options & {
    oracleAddr: tEthereumAddress;
    assetAddr: tEthereumAddress
}

export type NAFERC20Options = FERC20Options & {
    oracleAddr: tEthereumAddress;
}

export type PriceOracleOptions = DeployOptions & {
    jobId: string,
    httpUrl?: string,
    linkTokenAddr: tEthereumAddress,
    oracleOperatorAddr: tEthereumAddress,
}