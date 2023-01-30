import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("AaveV3Pool", () => {
  let aaveV3Pool: Contract;

  /* before(async () => {
    aaveV3Pool = await ethers.getContractAt("AaveV3Pool", "0x...");
  });

  it("should have the correct total supply", async () => {
    const totalSupply = await aaveV3Pool.totalSupply();
    expect(totalSupply.toNumber()).to.be.greaterThan(0);
  });

  it("should allow adding liquidity", async () => {
    const balanceBefore = await ethers.provider.getBalance(aaveV3Pool.address);
    await aaveV3Pool.addLiquidity(10, { value: 100 });
    const balanceAfter = await ethers.provider.getBalance(aaveV3Pool.address);
    expect(balanceAfter.sub(balanceBefore).toNumber()).to.be.greaterThan(99);
  });

  it("should allow removing liquidity", async () => {
    const balanceBefore = await ethers.provider.getBalance(aaveV3Pool.address);
    await aaveV3Pool.removeLiquidity(10);
    const balanceAfter = await ethers.provider.getBalance(aaveV3Pool.address);
    expect(balanceBefore.sub(balanceAfter).toNumber()).to.be.greaterThan(9);
  }); */
});
