import {expect, use} from "chai"
import {Contract, utils, Wallet, BigNumber} from "ethers"
import {
    deployContract,
    MockProvider,
    solidity,
} from "ethereum-waffle"
import BalanceTree from '../utils/balance-tree'

import MerkleDistributor from "../build/MerkleDistributor.json";
import TachyonToken from "../build/TachyonToken.json";

use(solidity);

const overrides = {
    gasLimit: 3999999,
}

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

const provider = new MockProvider();
const wallets = provider.getWallets()
const [wallet0, wallet1] = wallets

describe("MerkleDistributor", () => {

    let token: Contract
    beforeEach('deploy token', async () => {
        token = await deployContract(wallet0, TachyonToken, ['Tachyon', 'TAC', 100000])
    })

    describe('#token', () => {
        it('returns the token address from the merkle distributor contract', async () => {
            const distributor = await deployContract(wallet0, MerkleDistributor, [token.address, ZERO_BYTES32])
            expect(await distributor.token()).to.eq(token.address)
        })
    })

    describe('#merkleRoot', () => {
        it('returns the zero merkle root from the merkle distributor contract', async () => {
            const distributor = await deployContract(wallet0, MerkleDistributor, [token.address, ZERO_BYTES32])
            expect(await distributor.merkleRoot()).to.eq(ZERO_BYTES32)
        })
    })

    describe('larger tree', () => {
        let distributor: Contract
        let tree: BalanceTree
        beforeEach('deploy', async () => {
            tree = new BalanceTree(
                wallets.map((wallet, ix) => {
                    return {account: wallet.address, amount: BigNumber.from((ix + 1) * 100)}
                })
            )
            distributor = await deployContract(wallet0, MerkleDistributor, [token.address, tree.getHexRoot()])
            await token.transfer(distributor.address, 20100)
        })

        it('claim index 4', async () => {
            const proof = tree.getProof(4, wallets[4].address, BigNumber.from(5 * 100))
            await expect(distributor.claim(4, wallets[4].address, 5 * 100, proof, overrides))
                .to.emit(distributor, 'Claimed')
                .withArgs(4, wallets[4].address, 5 * 100)
        })

        it('claim index 9', async () => {
            const proof = tree.getProof(9, wallets[9].address, BigNumber.from(10 * 100))
            await expect(distributor.claim(9, wallets[9].address, 10 * 100, proof, overrides))
                .to.emit(distributor, 'Claimed')
                .withArgs(9, wallets[9].address, 10 * 100)
        })

        it('cannot claim more than proof', async () => {
            const proof = tree.getProof(9, wallets[9].address, BigNumber.from(10 * 100))
            await expect(distributor.claim(0, wallet0.address, 11 * 100, proof))
                .to.be.revertedWith('MerkleDistributor: Invalid proof.')
        })

        it('no double claims', async () => {
            const proof = tree.getProof(2, wallets[2].address, BigNumber.from(3 * 100))
            await distributor.claim(2, wallets[2].address, 300, proof, overrides)
            await expect(distributor.claim(2, wallets[2].address, 300, proof, overrides))
                .to.be.revertedWith('MerkleDistributor: Drop already claimed.')
        })
    })

})

