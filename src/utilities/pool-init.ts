import { HardhatRuntimeEnvironment } from "hardhat/types";

export class PoolInitUtil {
    public static async addMarketToRegistry(hre: HardhatRuntimeEnvironment, providerId: number, addressesProvider: any) {

        const providerRegistry = await hre.deployments.get("PoolAddressesProviderRegistry");
        const providerRegistryInstance = (await hre.ethers.getContractAt(providerRegistry.abi, providerRegistry.address));
        const providerRegistryOwner = await providerRegistryInstance.owner();

        const signer = await hre.ethers.getSigner(providerRegistryOwner);
        // 1. Set the provider at the Registry
        await providerRegistryInstance
            .connect(signer)
            .registerAddressesProvider(addressesProvider, providerId);

        console.log(`Added LendingPoolAddressesProvider with address "${addressesProvider}" to registry located at ${providerRegistry.address}`);
    };

    public static async getPoolLibraries(hre: HardhatRuntimeEnvironment) {
        const supplyLibraryArtifact = await hre.deployments.get("SupplyLogic");
        const borrowLibraryArtifact = await hre.deployments.get("BorrowLogic");
        const liquidationLibraryArtifact = await hre.deployments.get("LiquidationLogic");
        const eModeLibraryArtifact = await hre.deployments.get("EModeLogic");
        const bridgeLibraryArtifact = await hre.deployments.get("BridgeLogic");
        const flashLoanLogicArtifact = await hre.deployments.get("FlashLoanLogic");
        const poolLogicArtifact = await hre.deployments.get("PoolLogic");
        return {
            LiquidationLogic: liquidationLibraryArtifact.address,
            SupplyLogic: supplyLibraryArtifact.address,
            EModeLogic: eModeLibraryArtifact.address,
            FlashLoanLogic: flashLoanLogicArtifact.address,
            BorrowLogic: borrowLibraryArtifact.address,
            BridgeLogic: bridgeLibraryArtifact.address,
            PoolLogic: poolLogicArtifact.address,
        };
    };
}