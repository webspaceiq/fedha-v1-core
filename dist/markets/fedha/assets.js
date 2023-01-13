"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveAssets = void 0;
const types_1 = require("../../src/types");
exports.ReserveAssets = {
    [types_1.eEthereumNetwork.hardhat]: {
        NGNC: {
            name: "Naira Tethered",
            symbol: "NGNC",
        },
        KESC: {
            name: "Kenya Shilling",
            symbol: "KESC",
        },
    }
};
