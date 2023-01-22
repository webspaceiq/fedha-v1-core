import { ASSET_TYPE_ERC20_VOTES, ASSET_TYPE_NAFERC20 } from "../../src/helpers/constants";
import { 
    eEthereumNetwork, 
    IAssetConfigutation, 
    iParamsPerNetwork, 
    SymbolMap 
} from "../../src/types";

export const ReserveAssets: iParamsPerNetwork<SymbolMap<IAssetConfigutation>> = {
    [eEthereumNetwork.hardhat]: {
        NGNC: {
            type: ASSET_TYPE_NAFERC20,
            name: "Naira Tethered",
            symbol: "NGNC",
        },
        KESC: {
            type: ASSET_TYPE_NAFERC20,
            name: "Kenya Shilling",
            symbol: "KESC",
        },
        FEDHA: {
            type: ASSET_TYPE_ERC20_VOTES,
            name: "FEDHA",
            symbol: "FEDHA",
        },
    },
    [eEthereumNetwork.goerli]: {
        NGNC: {
            type: ASSET_TYPE_NAFERC20,
            name: "Naira Tethered",
            symbol: "NGNC",
        },
        KESC: {
            type: ASSET_TYPE_NAFERC20,
            name: "Kenya Shilling",
            symbol: "KESC",
        },
        FEDHA: {
            type: ASSET_TYPE_ERC20_VOTES,
            name: "FEDHA",
            symbol: "FEDHA",
        },
    }
}