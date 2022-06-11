import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

task("addvoting", "Adds new voting")
  .addPositionalParam("address", "Contract address")
  .addPositionalParam("votingId", "Id of a new voting")
  .addVariadicPositionalParam("candidates", "List of candidates for voting")
  .setAction(async function(taskArgs, hre) {
    let address = taskArgs["address"];
    let votingId = taskArgs["votingId"];
    let candidates = taskArgs["candidates"];
    let voting = await hre.ethers.getContractAt("Voting", address);
    await voting.addVoting(votingId, candidates);
    console.log("New voting has been successfully created");
  });

task("vote", "Vote for candidate")
  .addPositionalParam("address", "Contract address")
  .addPositionalParam("votingId", "Id of voting")
  .addPositionalParam("candidate", "User's candidate")
  .setAction(async function(taskArgs, hre) {
    let amount = {
      value: hre.ethers.utils.parseEther("0.01")   
    };  
    let address = taskArgs["address"];
    let votingId = taskArgs["votingId"];
    let candidate = taskArgs["candidate"];
    let voting = await hre.ethers.getContractAt("Voting", address);
    await voting.vote(votingId, candidate, amount);
    console.log("You have successfully voted");
  })

task("finishvoting", "Finish the voting")
  .addPositionalParam("address", "Contract address")
  .addPositionalParam("votingId", "Id of voting")
  .setAction(async function(taskArgs, hre) {
    let address = taskArgs["address"];
    let votingId = taskArgs["votingId"];
    let voting = await hre.ethers.getContractAt("Voting", address);
    await voting.finishVoting(votingId);
    console.log("You have finished the voting");
  })

task("withdraw", "Send the comission withdraw to admin")
  .addPositionalParam("address", "Contract address")
  .setAction(async function(taskArgs, hre) {
    let address = taskArgs["address"];
    let voting = await hre.ethers.getContractAt("Voting", address);
    await voting.withdraw();
    console.log("The comission withdraw has benn sent to admin");
  })

task("showinfo", "Prints the info about running voting")
.addPositionalParam("address", "Contract address")
.addPositionalParam("votingId", "Id of voting")
.setAction(async function(taskArgs, hre) {
  let address = taskArgs["address"];
  let votingId = taskArgs["votingId"];
  let voting = await hre.ethers.getContractAt("Voting", address);
  console.log((await voting.showInfo(votingId)).toString());
})


const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: process.env.ROPSTEN_URL || "",
      accounts: {
        mnemonic: process.env.MNEMOTIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
