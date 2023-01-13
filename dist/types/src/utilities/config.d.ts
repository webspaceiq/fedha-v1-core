import { Contract } from "ethers";
import { ConfigNames } from "../helpers/env";
import * as TYPES from "../types";
export declare class ConfigUtil {
    static getMarketConfiguration(configName: ConfigNames): TYPES.IFedhaConfiguration;
    static getReserveAssets(configuration: TYPES.IFedhaConfiguration, network: TYPES.eNetwork): TYPES.IAssetConfigutation[];
    static getPriceOracles(configuration: TYPES.IFedhaConfiguration): TYPES.IOracleConfigutation[];
    static getRequiredParamPerNetwork: <T>(configuration: TYPES.IFedhaConfiguration, key: keyof TYPES.IFedhaConfiguration, network: TYPES.eNetwork) => T;
    static getContract: <ContractType extends Contract>(id: string, address?: TYPES.tEthereumAddress) => Promise<ContractType>;
}
