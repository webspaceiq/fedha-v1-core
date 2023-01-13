import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { FedhaMarket } from '../markets/fedha';
import { ConfigUtil } from '../src/utilities/config';
import { eNetwork } from '../src/types';

const func: DeployFunction = async function (
    { deployments, getNamedAccounts, ethers, upgrades, ...hre }
) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

};
export default func;
func.dependencies = [];
func.id = 'NAFERC20';
func.tags = ["core", "governance"];