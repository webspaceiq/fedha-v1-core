import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import 'hardhat-dependency-compiler';
import "hardhat-deploy";
import { DEFAULT_NAMED_ACCOUNTS } from "./src/helpers/constants";

require('dotenv').config();

const MAINNET_RPC_URL =
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    process.env.INFURA_MAINNET_RPC_URL;

const POLYGON_MAINNET_RPC_URL =
    process.env.ALCHEMY_POLYGON_MAINNET_RPC_URL ||
    process.env.INFURA_POLYGON_MAINNET_RPC_URL;


const POLYGON_MUMBAI_RPC_URL =
    process.env.ALCHEMY_POLYGON_MUMBAI_RPC_URL ||
    process.env.INFURA_POLYGON_MUMBAI_RPC_URL;

const GOERLI_RPC_URL =
    process.env.ALCHEMY_GOERLI_RPC_URL ||
    process.env.INFURA_GOERLI_RPC_URL;

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
                version: "0.8.10",
                settings: {
                    optimizer: { enabled: true, runs: 100_000 },
                    evmVersion: "berlin",
                },
            },
            {
                version: "0.8.4",
                settings: {
                    optimizer: { enabled: true, runs: 200 },
                },
            },
            {
                version: "0.7.6",
                settings: {
                    optimizer: { enabled: true, runs: 200 },
                },
            },
            {
                version: "0.6.6",
                settings: {
                    optimizer: { enabled: true, runs: 200 },
                },
            },
            {
                version: "0.5.16",
                settings: {
                    optimizer: { enabled: true, runs: 200 },
                },
            },
            {
                version: "0.5.5",
                settings: {
                    optimizer: { enabled: true, runs: 200 },
                },
            },
            {
                version: "0.4.24",
                settings: {
                    optimizer: { enabled: true, runs: 200 },
                },
            },
        ],
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
    networks: {
        hardhat: {
            hardfork: "merge",
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
    dependencyCompiler: {
        paths: [
            "@aave/core-v3/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol",
            "@aave/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol",
            "@aave/core-v3/contracts/misc/AaveOracle.sol",
            "@aave/core-v3/contracts/protocol/tokenization/AToken.sol",
            "@aave/core-v3/contracts/protocol/tokenization/DelegationAwareAToken.sol",
            "@aave/core-v3/contracts/protocol/tokenization/StableDebtToken.sol",
            "@aave/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/GenericLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/ValidationLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/CalldataLogic.sol",
            "@aave/core-v3/contracts/protocol/pool/Pool.sol",
            "@aave/core-v3/contracts/protocol/pool/L2Pool.sol",
            "@aave/core-v3/contracts/protocol/pool/PoolConfigurator.sol",
            "@aave/core-v3/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol",
            "@aave/core-v3/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol",
            "@aave/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol",
            "@aave/core-v3/contracts/deployments/ReservesSetupHelper.sol",
            "@aave/core-v3/contracts/misc/AaveProtocolDataProvider.sol",
            "@aave/core-v3/contracts/misc/L2Encoder.sol",
            "@aave/core-v3/contracts/protocol/configuration/ACLManager.sol",
            "@aave/core-v3/contracts/dependencies/weth/WETH9.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockIncentivesController.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockReserveConfiguration.sol",
            "@aave/core-v3/contracts/mocks/oracle/CLAggregators/MockAggregator.sol",
            "@aave/core-v3/contracts/mocks/tokens/MintableERC20.sol",
            "@aave/core-v3/contracts/mocks/flashloan/MockFlashLoanReceiver.sol",
            "@aave/core-v3/contracts/mocks/tokens/WETH9Mocked.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockVariableDebtToken.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockAToken.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockStableDebtToken.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockInitializableImplementation.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockPool.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockL2Pool.sol",
            "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol",
            "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol",
            "@aave/core-v3/contracts/mocks/oracle/PriceOracle.sol",
            "@aave/core-v3/contracts/mocks/tokens/MintableDelegationERC20.sol",
            "@uniswap/v2-core/contracts/UniswapV2Factory.sol",
            "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol",
            
        ],
    }
};

export default config;
