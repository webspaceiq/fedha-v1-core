"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
const constants_1 = require("./src/helpers/constants");
require('dotenv').config();
const MAINNET_RPC_URL = process.env.INFURA_MAINNET_RPC_URL ||
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const POLYGON_MAINNET_RPC_URL = process.env.INFURA_POLYGON_MAINNET_RPC_URL ||
    process.env.ALCHEMY_POLYGON_MAINNET_RPC_URL ||
    "https://polygon-mainnet.alchemyapi.io/v2/your-api-key";
const GOERLI_RPC_URL = process.env.INFURA_GOERLI_RPC_URL ||
    process.env.ALCHEMY_GOERLI_RPC_URL ||
    "https://eth-goerli.alchemyapi.io/v2/your-api-key";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "Your key";
// optional
const MNEMONIC = process.env.MNEMONIC || "Your mnemonic";
let FORKING_BLOCK_NUMBER = 0;
if (process.env.FORKING_BLOCK_NUMBER)
    FORKING_BLOCK_NUMBER = parseInt(process.env.FORKING_BLOCK_NUMBER);
// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key";
const REPORT_GAS = process.env.REPORT_GAS || false;
const config = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 9999,
                    },
                    metadata: {
                        bytecodeHash: "none",
                    },
                },
            },
            {
                version: "0.7.6",
                settings: {},
            },
            {
                version: "0.6.6",
            },
            {
                version: "0.5.5",
            },
            { version: "0.4.24", },
        ],
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
    networks: {
        hardhat: {
            hardfork: "merge",
            // If you want to do some forking set `enabled` to true
            forking: {
                url: MAINNET_RPC_URL,
                blockNumber: FORKING_BLOCK_NUMBER,
                enabled: false,
            },
            chainId: 31337,
        },
        /* localhost: {
            chainId: 31337,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 5,
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 1,
        },
        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 137,
        }, */
    },
    defaultNetwork: "hardhat",
    paths: {
        deploy: 'deploy',
        deployments: 'deployments',
        imports: 'imports'
    },
    namedAccounts: {
        ...constants_1.DEFAULT_NAMED_ACCOUNTS,
    },
};
exports.default = config;
