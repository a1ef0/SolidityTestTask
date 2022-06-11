# Solidity Test Task for CryptonAcademy

The Voting contract implementation.

Try running some of the following tasks:

```shell
npx hardhat addvoting `DEPLOYED_CONTRACT_ADDRESS` `VOTING_ID` `...CANDIDATES`
npx hardhat vote `DEPLOYED_CONTRACT_ADDRESS` `VOTING_ID` `CANDIDATE`
npx hardhat finishvoting `DEPLOYED_CONTRACT_ADDRESS` `VOTING_ID`
npx hardhat withdraw `DEPLOYED_CONTRACT_ADDRESS` 
npx hardhat showinfo `DEPLOYED_CONTRACT_ADDRESS` `VOTING_ID`
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage --network NETWORK
npx hardhat run scripts/deploy.js
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network (in this project the deployment occurs to the rinkeby testnet).

In this project, fill the file named .env with your Etherscan API key, your Rinkeby node URL (eg from Alchemy), and the mnemotic of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network rinkeby scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
