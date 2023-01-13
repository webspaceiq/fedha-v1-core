"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function ({ deployments, getNamedAccounts, ...hre }) {
    const { deploy } = deployments;
    const { treasuryAdmin } = await getNamedAccounts();
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
};
exports.default = func;
func.dependencies = [];
func.id = 'Libraries';
func.tags = ["core", "libraries"];
