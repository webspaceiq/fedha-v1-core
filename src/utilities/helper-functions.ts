import { ContractTransaction, ethers } from "ethers";

export class HelperFunctions {

    public static stringToBytes32(text: string) {
        var result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text));
        while (result.length < 66) { result += '0'; }
        if (result.length !== 66) { throw new Error("invalid web3 implicit bytes32"); }
        return result;
    }

    public static numToBytes32(num: number) {
        const hexNum = ethers.utils.hexlify(num)
        const strippedNum = HelperFunctions.stripHexPrefix(hexNum)
        if (strippedNum.length > 32 * 2) {
            throw Error(
                "Cannot convert number to bytes32 format, value is greater than maximum bytes32 value"
            )
        }
        return HelperFunctions.addHexPrefix(strippedNum.padStart(32 * 2, "0"))
    }

    public static stripHexPrefix(hex: string) {
        if (!ethers.utils.isHexString(hex)) {
            throw Error(`Expected valid hex string, got: "${hex}"`)
        }
        return hex.replace("0x", "")
    }

    public static addHexPrefix(hex: string) {
        return hex.startsWith("0x") ? hex : `0x${hex}`
    }


    public static waitForTx = async (tx: ContractTransaction) => await tx.wait(1) 

}