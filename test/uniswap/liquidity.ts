import { expect } from 'chai';
import { ethers } from 'hardhat';
/* import { solidity } from 'ethereum-waffle';

import { UniswapV2Factory } from '../build/UniswapV2Factory.json';
import { UniswapV2Router02 } from '../build/UniswapV2Router02.json';
import { TokenA, TokenB } from '../build/Token.json'; 

describe('UniswapV2', () => {
let factory: ethers.Contract;
  let router: ethers.Contract;
  let tokenA: ethers.Contract;
  let tokenB: ethers.Contract;

  beforeEach(async () => {
    // Deploy contracts
    [factory, router, tokenA, tokenB] = await ethers.getContracts(
      UniswapV2Factory,
      UniswapV2Router02,
      TokenA,
      TokenB,
    );
  });

  it('should add liquidity', async () => {
    // Add liquidity to the pool
    const tx = await router.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther('1'),
      ethers.utils.parseEther('1'),
      ethers.constants.AddressZero,
      ethers.utils.parseEther('1'),
      ethers.utils.parseEther('1'),
      { value: ethers.utils.parseEther('1') },
    );

    // Check events
    const events = await tx.events();
    expect(events.length).to.eq(1);
    expect(events[0].event).to.eq('AddLiquidity');

    // Check balances
    const tokenABalance = await tokenA.balanceOf(events[0].args[0]);
    const tokenBBalance = await tokenB.balanceOf(events[0].args[0]);
    expect(tokenABalance.toString()).to.eq(ethers.utils.parseEther('1').toString());
    expect(tokenBBalance.toString()).to.eq(ethers.utils.parseEther('1').toString());
  });

  it('should remove liquidity', async () => {
    // Add liquidity to the pool
    await router.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther('1'),
      ethers.utils.parseEther('1'),
      ethers.constants.AddressZero,
      ethers.utils.parseEther('1'),
      ethers.utils.parseEther('1'),
      { value: ethers.utils.parseEther('1') },
    );

    // Remove liquidity from the pool
    const tx = await router.removeLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther('1'),
      ethers.utils.parseEther('1'))
    
  });

});

 */