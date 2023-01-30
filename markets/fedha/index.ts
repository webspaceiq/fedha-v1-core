
import * as CONSTANTS from "../../src/helpers/constants";
import { eEthereumNetwork, ePolygonNetwork, IFedhaConfiguration } from "../../src/types";
import { rateStrategyStableOne, rateStrategyStableTwo, rateStrategyVolatileOne } from "./rateStrategies";
import { strategyStableOne, strategyVolatileOne } from "./reservesConfigs";

export const FedhaMarket: IFedhaConfiguration = {
    MarketId: "Fedha_Treasury",
    ProviderId: 1,
    ATokenNamePrefix: "Ethereum",
    StableDebtTokenNamePrefix: "Ethereum",
    VariableDebtTokenNamePrefix: "Ethereum",
    SymbolPrefix: "Eth",
    OracleQuoteCurrencyAddress: CONSTANTS.ZERO_ADDRESS,
    OracleQuoteCurrency: "USD",
    OracleQuoteUnit: "8",
    FlashLoanPremiums: {
      total: 0.0005e4,
      protocol: 0.0004e4,
    },
    Governance: {
        id: "FedhaGovernor",
        tokenId: "FEDHA",
        timelockId: "FedhaTimelock",
        timelockDelay: "0",
        initialVotingDelay: "1",
        initialVotingPeriod: "10",
        initialProposalThreshold: "0",
        initialQuorumFraction: "0",
    },
    ReserveAssets: {
        [eEthereumNetwork.main]: {
            AOAC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Angolan Kwanza", symbol: "AOAC", },
            CEDIC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Ghanaian Cedi", symbol: "CEDIC", },
            DZDC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Algerian Dinar", symbol: "DZDC", },
            EGPC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Egyptian Pound", symbol: "EGPC", },
            ETBC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Ethiopian Birr", symbol: "ETBC" },
            KESC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Kenyan Shilling", symbol: "KESC", },
            NGNC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Nigerian Naira", symbol: "NGNC", },
            MADC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Moroccan Dirham", symbol: "MADC", },
            TZSC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Tanzanian Shilling", symbol: "TZSC", },
            ZARC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "South African Rand", symbol: "ZARC", },
            FEDHA: { type: CONSTANTS.ASSET_TYPE_ERC20_VOTES, name: "FEDHA", symbol: "FEDHA", },
        },
        [eEthereumNetwork.hardhat]: {
            AOAC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Angolan Kwanza", symbol: "AOAC", },
            CEDIC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Ghanaian Cedi", symbol: "CEDIC", },
            DZDC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Algerian Dinar", symbol: "DZDC", },
            EGPC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Egyptian Pound", symbol: "EGPC", },
            ETBC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Ethiopian Birr", symbol: "ETBC" },
            KESC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Kenyan Shilling", symbol: "KESC", },
            NGNC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Nigerian Naira", symbol: "NGNC", },
            MADC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Moroccan Dirham", symbol: "MADC", },
            TZSC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "Tanzanian Shilling", symbol: "TZSC", },
            ZARC: { type: CONSTANTS.ASSET_TYPE_NAFERC20, name: "South African Rand", symbol: "ZARC", },
            FEDHA: { type: CONSTANTS.ASSET_TYPE_ERC20_VOTES, name: "FEDHA", symbol: "FEDHA", },
        },
    },
    AssetPairs: {
        [eEthereumNetwork.main]: {
            NGNC_KESC: { tokenA: "NGNC", tokenB: "KESC", },
            MADC_ZAR: { tokenA: "MADC", tokenB: "KESC", },
            TZSC_DZDC: { tokenA: "TZSC", tokenB: "DZDC", },
            NGNC_EGPC: { tokenA: "NGNC", tokenB: "EGPC", },
            NGNC_ETBC: { tokenA: "NGNC", tokenB: "ETBC", }
        },
        [eEthereumNetwork.hardhat]: {
            NGNC_KESC: { tokenA: "NGNC", tokenB: "KESC", },
            MADC_ZAR: { tokenA: "MADC", tokenB: "KESC", },
            TZSC_DZDC: { tokenA: "TZSC", tokenB: "DZDC", },
            NGNC_EGPC: { tokenA: "NGNC", tokenB: "EGPC", },
            NGNC_ETBC: { tokenA: "NGNC", tokenB: "ETBC", }
        },
    },
    ReservesConfig: {
        AOAC: strategyStableOne,
        CEDIC: strategyStableOne,
        DZDC: strategyStableOne,
        EGPC: strategyStableOne,
        ETBC: strategyStableOne,
        KESC: strategyStableOne,
        NGNC: strategyStableOne,
        MADC: strategyStableOne,
        TZSC: strategyStableOne,
        ZARC: strategyStableOne,
        FEDHA: strategyVolatileOne,
    },
    RateStrategies: {
      rateStrategyVolatileOne,
      rateStrategyStableOne,
      rateStrategyStableTwo,
    },
    LinkTokenConfig: {
        [eEthereumNetwork.main]: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        [eEthereumNetwork.goerli]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [eEthereumNetwork.hardhat]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [ePolygonNetwork.polygon]: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        [ePolygonNetwork.mumbai]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    },
    TokenOracles: {
        AOAC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        CEDIC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        DZDC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        EGPC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        ETBC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        KESC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        NGNC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        MADC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        TZSC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        ZARC: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        FEDHA: { type: CONSTANTS.ORACLE_TYPE_SIMPLE, price: "5", },
        /*  KESC: {
             type: ORACLE_TYPE_CHAINLINK,
             jobId: "45045aFc77CF20eC7A532E3120E0F10x326C977E6efc",
             httpUrl: "http://fedhabank/api/v1/feed?NGN",
         }, */
    },
    Treasury: {
        id: "FedhaTreasury",
        type: CONSTANTS.TREASURY_TYPE_TRANSFER,
        tokenId: "FEDHA",
        oracleId: "NGNCTokenOracle",
    }
}