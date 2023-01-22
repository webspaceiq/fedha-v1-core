import { ORACLE_TYPE_SIMPLE } from "../../src/helpers/constants";
import { IOracleConfigutation, SymbolMap } from "../../src/types";

export const PriceOracles: SymbolMap<IOracleConfigutation> = {
    NGNC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "12",
    },
    KESC: {
        type: ORACLE_TYPE_SIMPLE,
        price: "10",
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