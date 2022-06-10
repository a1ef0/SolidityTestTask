const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", function () {

    let Voting;
    let votingContract;
    let notOwnerContract;
    let ownerContract;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Voting = await ethers.getContractFactory("Voting");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens once its transaction has been
        // mined.
        notOwnerContract = await (await Voting.deploy()).connect(addr1);
        ownerContract = await Voting.deploy();
        await notOwnerContract.deployed();
        await ownerContract.deployed();
    });

    describe("addVoting functionality", function() {
        it("Only owner is able to create new votings", async function() {
            expect(await ownerContract.addVoting(1, [addr2.address]));
            await expect(notOwnerContract.addVoting(2, [addr2.address]))
                .to.be.revertedWith('Only admin can create new votings');
        })

        it("Voting has been successfully created", async function () {
            for (let i = 0; i < 100; ++i) {
                //await expect(notOwnerContract.addVoting(2, [addr2.address]))
                //.to.be.revertedWith('Only admin can create new votings');
                await expect(ownerContract.addVoting(i, [addrs[i % addrs.length].address]))
                .to.not.be.reverted;
                //await ownerContract.addVoting(i, [addrs[i % addrs.length].address]);
            }
        })
    })

})