import { Contract, utils } from "ethers";
import { ethers, getNamedAccounts } from "hardhat";
import { EMPTY_STRING, ZERO_ADDRESS } from "../../src/helpers/constants";
import { DeployHelper } from "../../src/helpers/deploy-helper";
import { PRICE_ORACLE_ID } from "../../src/helpers/deploy-ids";

export class Fixtures {

    public static async Fixture() {

        const httpUrl = 'httpURL';
        const jobId = 'jobId';
        const fundAmount = "1000000000000000000";
        const adminRole = utils.keccak256(utils.toUtf8Bytes("ORACLE_ADMIN"));
        const assetOneAddr = '0x28FAA621c3348823D6c6548981a19716bcDc740e';

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        const { treasuryAdmin } = await getNamedAccounts();

        const lToken = await DeployHelper.deployTestLinkToken("LinkTokenX1", treasuryAdmin);
        const lToken2 = await DeployHelper.deployTestLinkToken("LinkTokenX2", treasuryAdmin);

        const mockOracleFactory = await ethers.getContractFactory("MockOracle")
        const mockOracle = await mockOracleFactory.connect(owner).deploy(lToken.address)
        const anotherMockOracle = await mockOracleFactory.connect(owner).deploy(lToken.address)

        const oracle = await DeployHelper.deployPriceOracle({
            id: 'Pricey',
            jobId,
            httpUrl,
            owner: treasuryAdmin,
            linkTokenAddr: lToken.address,
            oracleOperatorAddr: mockOracle.address,
        }) as Contract;

        await lToken.connect(owner).transfer(oracle.address, fundAmount);

        return {
            oracle,
            httpUrl,
            jobId,
            owner,
            adminRole,
            otherAccount,
            assetOneAddr,
            mockOracle,
            anotherMockOracle,
            linkToken: lToken,
            linkTokenAddr: lToken.address,
            anotherLinkTokenAddr: lToken2.address,
        };
    }

    public static async invalidHttpUrlFixture() {
        const { treasuryAdmin } = await getNamedAccounts();
        const oracle = await DeployHelper.deployPriceOracle({
            id: PRICE_ORACLE_ID,
            httpUrl: EMPTY_STRING,
            jobId: ZERO_ADDRESS,
            owner: treasuryAdmin,
            linkTokenAddr: "0x28FAA621c3348823D6c6548981a19716bcDc740e",
            oracleOperatorAddr: "0x28FAA621c3348823D6c6548981a19716bcDc740e",
        });
        return { oracle };
    }

    public static async invalidJobIdFixture() {
        const { treasuryAdmin } = await getNamedAccounts();
        const oracle = await DeployHelper.deployPriceOracle({
            id: PRICE_ORACLE_ID,
            httpUrl: ZERO_ADDRESS,
            jobId: EMPTY_STRING,
            owner: treasuryAdmin,
            linkTokenAddr: "0x28FAA621c3348823D6c6548981a19716bcDc740e",
            oracleOperatorAddr: "0x28FAA621c3348823D6c6548981a19716bcDc740e",
        })
        return { oracle };

    }

    public static async invalidOperatorAddrFixture() {
        const { treasuryAdmin } = await getNamedAccounts();
        const oracle = await DeployHelper.deployPriceOracle({
            id: PRICE_ORACLE_ID,
            httpUrl: ZERO_ADDRESS,
            jobId: ZERO_ADDRESS,
            owner: treasuryAdmin,
            linkTokenAddr: "0x28FAA621c3348823D6c6548981a19716bcDc740e",
            oracleOperatorAddr: ZERO_ADDRESS,
        })
        return { oracle };
    }

    public static async invalidLinkAddrFixture() {
        const { treasuryAdmin } = await getNamedAccounts();
        const oracle = await DeployHelper.deployPriceOracle({
            id: PRICE_ORACLE_ID,
            httpUrl: ZERO_ADDRESS,
            jobId: ZERO_ADDRESS,
            owner: treasuryAdmin,
            linkTokenAddr: ZERO_ADDRESS,
            oracleOperatorAddr: "0x28FAA621c3348823D6c6548981a19716bcDc740e",
        })
        return { oracle };
    }
}