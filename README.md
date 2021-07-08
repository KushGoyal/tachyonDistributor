# Tachyon Tokens Merkle Distributor


### Generate the merkle tree from the list of addresses and amounts

I generated a wallet seed and created a list of addresses with token amounts to be distributed.

I used [uniswap](https://github.com/Uniswap/merkle-distributor/blob/master/scripts/generate-merkle-root.ts) merkle generator to create the merkle tree.

Clone the [repo](https://github.com/Uniswap/merkle-distributor) and install the below libs to run the command
```shell
npm install -g typescript
npm install -g ts-node
```

Then generate the merkle tree from the addresses.json file

```shell
ts-node scripts/generate-merkle-root.ts --input scripts/addresses.json
```

I used the generated merkle tree to verify that if the address and amount are valid.

The merkle root will be used in the merkle distributor contract.

### Tachyon token

An [ERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/95e54173e9473fbee19bd173c751febad7062fc9/contracts/token/ERC20/ERC20.sol) token with symbol TAC

total supply = 100,000

To be distributed = 19,940

Then I deployed the token contract on the [Rinkeby](https://rinkeby.etherscan.io/) network.

Contract address: 0xA57F5ffe48c7079A98c08701D0b63Ec20Ef29B29 (Rinkeby network)

This contract will send the total supply to the creator's address.

### Merkle distributor contract

The merkle distributor contract has been taken from [uniswap](https://github.com/Uniswap/merkle-distributor/blob/master/contracts/MerkleDistributor.sol).

To deploy the contract I used the address of the TAC token and the merkle root.

Contract address: 0x710a25efF5A9CB435664084b98bD7b5359bEf25e (Rinkeby network)

I transferred TAC tokens to the merkle distributor contract so that users can claim them using the contract.

I used the merkle distributor contract's address in the frontend code to claim the tokens.

### How to claim the tokens

Clone this repo and open index.html from the src folder in your browser. Browser must have metamask installed.

1. Set the network to Rinkeby.
2. Import the seed shared in the email in metamask wallet
3. In metamask wallet go to assets tab and add the TAC token by using the contract 0xA57F5ffe48c7079A98c08701D0b63Ec20Ef29B29
4. Open index.html and click on "claim tokens" button
5. After successful claim you will see your TAC token balance in metamask wallet
6. Create multiple accounts in the metamask wallet and try each one by one to claim tokens


After a successful claim the same address cannot claim tokens again.

Only eligible addresses can claim tokens.


#### Referred links:
https://docs.ethers.io/v5/  
https://docs.metamask.io/guide/provider-migration.html