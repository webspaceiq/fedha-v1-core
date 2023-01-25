import { ORACLE_TYPE_SIMPLE } from "../../src/helpers/constants";
import { IOracleConfigutation, SymbolMap } from "../../src/types";

export const TokenOracles: SymbolMap<IOracleConfigutation> = {
    AOAC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    CEDIC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    DZDC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    EGPC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    ETBC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    KESC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    NGNC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    MADC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    TZSC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    ZARC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
    FEDHA: {
        type: ORACLE_TYPE_SIMPLE,
        price: "5",
    },
   /*  KESC: {
        type: ORACLE_TYPE_CHAINLINK,
        jobId: "45045aFc77CF20eC7A532E3120E0F10x326C977E6efc",
        httpUrl: "http://fedhabank/api/v1/feed?NGN",
    }, */
}