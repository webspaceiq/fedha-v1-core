import { ASSET_TYPE_ERC20_VOTES, ASSET_TYPE_NAFERC20 } from "../../src/helpers/constants";
import { IAssetConfigutation, SymbolMap } from "../../src/types";

export const assets: SymbolMap<IAssetConfigutation> = {
    AOAC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Angolan Kwanza",
        symbol: "AOAC",
    },
    CEDIC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Ghanaian Cedi",
        symbol: "CEDIC",
    },
    DZDC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Algerian Dinar",
        symbol: "AOAC",
    },
    EGPC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Egyptian Pound",
        symbol: "EGPC",
    },
    ETBC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Ethiopian Birr",
        symbol: "ETBC",
    },
    KESC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Kenyan Shilling",
        symbol: "KESC",
    },
    NGNC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Nigerian Naira",
        symbol: "NGNC",
    },
    MADC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Moroccan Dirham",
        symbol: "MADC",
    },
    TZSC: {
        type: ASSET_TYPE_NAFERC20,
        name: "Tanzanian Shilling",
        symbol: "TZSC",
    },
    ZARC: {
        type: ASSET_TYPE_NAFERC20,
        name: "South African Rand",
        symbol: "ZARC",
    },
    FEDHA: {
        type: ASSET_TYPE_ERC20_VOTES,
        name: "FEDHA",
        symbol: "FEDHA",
    },
}