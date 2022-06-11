const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", function () {

    let Voting;
    let voting;
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
        voting = await Voting.deploy();
        await voting.deployed();
    });

    describe("addVoting functionality", function() {
        it("Only owner is able to create new votings", async function() {
            expect(await voting.addVoting(1, [addr2.address]));
            await expect(voting.connect(addr1).addVoting(2, [addr2.address]))
                .to.be.revertedWith('Only admin can create new votings');
        })

        it("Voting has been successfully created", async function () {
            for (let i = 0; i < 100; ++i) {
                await expect(voting.addVoting(i, [addrs[i % addrs.length].address]))
                .to.not.be.reverted;
            }
        })
    })

    describe("vote functionality", function() {
        let amount = {
            value: ethers.utils.parseEther("0.01")   
        };

        it ("User can vote only for at least 0.01 ETH", async function() {
            let amount = {
                value: ethers.utils.parseEther("0.001")   
            };  
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await expect(voting.connect(addr2).vote(1, addr1.address, amount))
            .to.be.revertedWith("You must send at least 0.01 ETH");
        })

        it("User can vote only for created votings", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await expect(voting.connect(addr2).vote(1231, addr1.address, amount))
            .to.be.revertedWith("You can vote only in created votings");
        })

        it("User can vote only once", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await voting.connect(addr2).vote(1, addr1.address, amount);
            await expect(voting.connect(addr2).vote(1, addr1.address, amount))
            .to.be.revertedWith("You have already voted");
        })

        it("User cannot vote for himself", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await expect(voting.connect(addr2).vote(1, addr2.address, amount))
            .to.be.revertedWith("You cannot vote for yourself");            
        })
    })

})