import { IOracleConfigutation, SymbolMap } from "../../src/types";

export const PriceOracles: SymbolMap<IOracleConfigutation> = {
    NGNC: {
        jobId: "45045aFc77CF20eC7A532E3120E0F10x326C977E6efc",
        httpUrl: "http://fedhabank/api/v1/feed?NGN",
    },
    KESC: {
        jobId: "45045aFc77CF20eC7A532E3120E0F10x326C977E6efc",
        httpUrl: "http://fedhabank/api/v1/feed?NGN",
    },
}