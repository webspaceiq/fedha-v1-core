import { 
    eEthereumNetwork, 
    IAssetConfigutation, 
    iParamsPerNetwork, 
    SymbolMap 
} from "../../src/types";

export const ReserveAssets: iParamsPerNetwork<SymbolMap<IAssetConfigutation>> = {
    [eEthereumNetwork.hardhat]: {
        NGNC: {
            name: "Naira Tethered",
            symbol: "NGNC",
        },
        KESC: {
            name: "Kenya Shilling",
            symbol: "KESC",
        },
    }
}