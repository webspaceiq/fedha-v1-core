import { eEthereumNetwork, ePolygonNetwork, IFedhaConfiguration } from "../../src/types";
import { ReserveAssets } from "./assets";
import { PriceOracles } from "./oracles";

export const FedhaMarket: IFedhaConfiguration = {
    MarketId: "Fedha_Treasury",
    ReserveAssets,
    LinkTokenConfig: {
        [eEthereumNetwork.main]: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        [eEthereumNetwork.görli]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [eEthereumNetwork.hardhat]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [ePolygonNetwork.polygon]: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        [ePolygonNetwork.mumbai]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    },
    PriceOracles,
}