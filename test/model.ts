export interface ContractConfig {
    address: string;
}

export type NAERC20Config = ContractConfig & {
    name: string;
    symbol: string;
}

export type  PriceOracleConfig =   NAERC20Config & {
    assetAddr: string;
}