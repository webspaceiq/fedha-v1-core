
import { assets } from "./assets";
import { TokenOracles } from "./oracles";
import { Governance } from "./governance";
import { TREASURY_TYPE_TRANSFER } from "../../src/helpers/constants";
import { eEthereumNetwork, ePolygonNetwork, IFedhaConfiguration } from "../../src/types";

export const FedhaMarket: IFedhaConfiguration = {
    MarketId: "Fedha_Treasury",
    Governance,
    ReserveAssets: {
        [eEthereumNetwork.main]: assets,
        [eEthereumNetwork.goerli]: assets,
        [eEthereumNetwork.hardhat]: assets,
        [ePolygonNetwork.polygon]: assets,
        [ePolygonNetwork.mumbai]: assets,
    },
    LinkTokenConfig: {
        [eEthereumNetwork.main]: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        [eEthereumNetwork.goerli]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [eEthereumNetwork.hardhat]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [ePolygonNetwork.polygon]: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        [ePolygonNetwork.mumbai]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    },
    TokenOracles,
    Treasury: {
        id: "FedhaTreasury",
        type: TREASURY_TYPE_TRANSFER,
        tokenId: "FEDHA",
        oracleId: "NGNCTokenOracle",
    }
}