import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import { DEFAULT_NAMED_ACCOUNTS } from "./src/helpers/constants";

require('dotenv').config();

const MAINNET_RPC_URL =
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    process.env.INFURA_MAINNET_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/Q19ExJWkeqnIgRYFDwAJ6paDc7rojKzM";

const POLYGON_MAINNET_RPC_URL =
    process.env.ALCHEMY_POLYGON_MAINNET_RPC_URL || 
    process.env.INFURA_POLYGON_MAINNET_RPC_URL ||
    "https://polygon-mainnet.g.alchemy.com/v2/C8AHOAEAsuaF9zPJr3iwOmltHCivx3Nn";


const POLYGON_MUMBAI_RPC_URL =
process.env.ALCHEMY_POLYGON_MUMBAI_RPC_URL || 
process.env.INFURA_POLYGON_MUMBAI_RPC_URL ||
"https://polygon-mumbai.g.alchemy.com/v2/enKVRaOWmra6OVMZuBq2tBuJ1f8PXIUx";

const GOERLI_RPC_URL =
    process.env.ALCHEMY_GOERLI_RPC_URL || 
    process.env.INFURA_GOERLI_RPC_URL ||
    "https://eth-goerli.alchemyapi.io/v2/Q19ExJWkeqnIgRYFDwAJ6paDc7rojKzM";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "Your key"
// optional
const MNEMONIC = process.env.MNEMONIC || "Your mnemonic"

let FORKING_BLOCK_NUMBER = 0
if (process.env.FORKING_BLOCK_NUMBER)
    FORKING_BLOCK_NUMBER = parseInt(process.env.FORKING_BLOCK_NUMBER)

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false


const config: HardhatUserConfig = {
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
        /* goerli: {
            url: GOERLI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 5,
        },
        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
        mumbai: {
            url: POLYGON_MUMBAI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        }
        localhost: {
            chainId: 31337,
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
        ...DEFAULT_NAMED_ACCOUNTS,
    },
};

export default config;
