"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function ({ deployments, getNamedAccounts, ethers, upgrades, ...hre }) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
};
exports.default = func;
func.dependencies = [];
func.id = 'NAFERC20';
func.tags = ["core", "governance"];
