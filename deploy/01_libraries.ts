import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { eNetwork } from '../src/types';

const func: DeployFunction = async function ({ deployments, getNamedAccounts, ...hre }) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();

    const network = (
        process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

};
export default func;
func.dependencies = [];
func.id = 'Libraries';
func.tags = ["core", "libraries"];