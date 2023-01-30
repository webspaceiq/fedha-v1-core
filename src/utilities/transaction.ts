import { ContractTransaction } from "ethers";

export class TxnHelper {

    public static waitForTx = async (tx: ContractTransaction) => await tx.wait(1) 
}