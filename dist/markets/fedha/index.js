"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FedhaMarket = void 0;
const types_1 = require("../../src/types");
const assets_1 = require("./assets");
const oracles_1 = require("./oracles");
exports.FedhaMarket = {
    MarketId: "Fedha_Treasury",
    ReserveAssets: assets_1.ReserveAssets,
    LinkTokenConfig: {
        [types_1.eEthereumNetwork.main]: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        [types_1.eEthereumNetwork.görli]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [types_1.eEthereumNetwork.hardhat]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        [types_1.ePolygonNetwork.polygon]: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        [types_1.ePolygonNetwork.mumbai]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    },
    PriceOracles: oracles_1.PriceOracles,
};
