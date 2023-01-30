import { parseUnits } from "ethers/lib/utils";
import { IInterestRateStrategyParams } from "../../src/types";

export const rateStrategyVolatileOne: IInterestRateStrategyParams = {
  name: "rateStrategyVolatileOne",
  optimalUsageRatio: parseUnits("0.45", 27).toString(),
  baseVariableBorrowRate: "0",
  variableRateSlope1: parseUnits("0.07", 27).toString(),
  variableRateSlope2: parseUnits("3", 27).toString(),
  stableRateSlope1: parseUnits("0.07", 27).toString(),
  stableRateSlope2: parseUnits("3", 27).toString(),
  baseStableRateOffset: parseUnits("0.02", 27).toString(),
  stableRateExcessOffset: parseUnits("0.05", 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits("0.2", 27).toString(),
};

export const rateStrategyStableOne: IInterestRateStrategyParams = {
  name: "rateStrategyStableOne",
  optimalUsageRatio: parseUnits("0.9", 27).toString(),
  baseVariableBorrowRate: parseUnits("0", 27).toString(),
  variableRateSlope1: parseUnits("0.04", 27).toString(),
  variableRateSlope2: parseUnits("0.6", 27).toString(),
  stableRateSlope1: parseUnits("0.005", 27).toString(),
  stableRateSlope2: parseUnits("0.6", 27).toString(),
  baseStableRateOffset: parseUnits("0.01", 27).toString(),
  stableRateExcessOffset: parseUnits("0.08", 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits("0.2", 27).toString(),
};

export const rateStrategyStableTwo: IInterestRateStrategyParams = {
  name: "rateStrategyStableTwo",
  optimalUsageRatio: parseUnits("0.8", 27).toString(),
  baseVariableBorrowRate: parseUnits("0", 27).toString(),
  variableRateSlope1: parseUnits("0.04", 27).toString(),
  variableRateSlope2: parseUnits("0.75", 27).toString(),
  stableRateSlope1: parseUnits("0.005", 27).toString(),
  stableRateSlope2: parseUnits("0.75", 27).toString(),
  baseStableRateOffset: parseUnits("0.01", 27).toString(),
  stableRateExcessOffset: parseUnits("0.08", 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits("0.2", 27).toString(),
};
