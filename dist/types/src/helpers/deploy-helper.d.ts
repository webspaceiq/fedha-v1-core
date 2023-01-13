import { AFERC20Options, NAFERC20Options, PriceOracleOptions, tEthereumAddress } from "../../src/types";
import { AFERC20, FERC20, IPriceOracle, LinkToken, NAFERC20 } from "../../typechain";
export declare class DeployHelper {
    static deployTestLinkToken(id: string, owner: tEthereumAddress): Promise<LinkToken>;
    static getDeployedPriceOracle(assetSymbol: string): Promise<IPriceOracle>;
    static deployMockOracle(id: string, owner: tEthereumAddress): Promise<IPriceOracle>;
    static deployPriceOracle(options: PriceOracleOptions): Promise<IPriceOracle>;
    static deployFERC20(id: string, owner: tEthereumAddress, name: string, symbol: string): Promise<FERC20>;
    static deployAFERC20(options: AFERC20Options): Promise<AFERC20>;
    static deployNAFERC20(options: NAFERC20Options): Promise<NAFERC20>;
}
