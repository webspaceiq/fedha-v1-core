import { TREASURY_TYPE_TRANSFER } from "../../src/helpers/constants";
import { eEthereumNetwork, ePolygonNetwork, IFedhaConfiguration } from "../../src/types";
import { ReserveAssets } from "./assets";
import { Governance } from "./governance";
import { PriceOracles } from "./oracles";

export const FedhaMarket: IFedhaConfiguration = {
    MarketId: "Fedha_Treasury",
    Governance,
    ReserveAssets,
    LinkTokenConfig: {
        [eEthereumNetwork.main]: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        [eEthereumNetwork.goerli]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [eEthereumNetwork.hardhat]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [ePolygonNetwork.polygon]: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        [ePolygonNetwork.mumbai]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    },
    PriceOracles,
    Treasury: {
        id: "FedhaTreasury",
        type: TREASURY_TYPE_TRANSFER,
        tokenId: "FEDHA",
        oracleId: "NGNCPriceOracle",
    }
}