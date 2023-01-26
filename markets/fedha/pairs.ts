import { IAssetPairConfigutation, SymbolMap } from "../../src/types";

export const assetPairs: SymbolMap<IAssetPairConfigutation> = {
    NGNC_KESC: {
        tokenA: "NGNC",
        tokenB: "KESC",
    },
    MADC_ZAR: {
        tokenA: "MADC",
        tokenB: "KESC",
    },
    TZSC_DZDC: {
        tokenA: "TZSC",
        tokenB: "DZDC",
    },
    NGNC_EGPC: {
        tokenA: "NGNC",
        tokenB: "EGPC",
    },
    NGNC_ETBC: {
        tokenA: "NGNC",
        tokenB: "ETBC",
    }
}