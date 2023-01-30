
export const EMPTY_STRING = "";
export const ZERO = 0;
export const FAKE_BYTES = "0x28FAA621c3348823D6c6548981a19716bcDc740e";
export const FAKE_ADDRESS = "0x28FAA621c3348823D6c6548981a19716bcDc740e";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ZERO_BYTES_32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const DEFAULT_NAMED_ACCOUNTS = {
    deployer: {
        default: 0,
    },
    treasuryAdmin: {
        default: 0,
    },
    aclAdmin: {
        default: 0,
    },
    emergencyAdmin: {
        default: 0,
    },
    poolAdmin: {
        default: 0,
    },
    addressesProviderRegistryOwner: {
        default: 0,
    },
    treasuryProxyAdmin: {
        default: 1,
    },
    incentivesProxyAdmin: {
        default: 1,
    },
    incentivesEmissionManager: {
        default: 0,
    },
    incentivesRewardsVault: {
        default: 0,
    },
    other: {
        default: 1,
    },
};

export const ASSET_TYPE_ERC20 = "erc20";
export const ASSET_TYPE_AFERC20 = "aferc20";
export const ASSET_TYPE_NAFERC20 = "naferc20";
export const ASSET_TYPE_ERC20_VOTES = "erc20Votes";
export const ORACLE_TYPE_SIMPLE = "simpleOracle";
export const ORACLE_TYPE_CHAINLINK = "chainlinkOracle";
export const TREASURY_TYPE_TRANSFER = "transfer";
export const TREASURY_TYPE_TRANSFER_FROM = "transferFrom";
export const TREASURY_TYPE_MINT = "mint";