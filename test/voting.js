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
    
    let amount = {
        value: ethers.utils.parseEther("0.01")   
    };

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    beforeEach(async function () {
        Voting = await ethers.getContractFactory("Voting");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        
        voting = await Voting.deploy();
        await voting.deployed();
    });

    describe("addVoting() functionality", function() {
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

    describe("vote() functionality", function() {

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

        it("User can vote if everything is ok", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await expect(voting.connect(addr2).vote(1, addr1.address, amount))
            .to.not.be.reverted;
            await expect(voting.connect(addrs[0]).vote(1, addr1.address, amount))
            .to.not.be.reverted;
        })
    })
    
    describe("finishVoting() functionality", function() {

        it("User cannot finish voting before 3 minutes", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await voting.connect(addr2).vote(1, addr1.address, amount);
            await expect(voting.connect(addr2).finishVoting(1))
            .to.be.revertedWith("3 minutes should pass before closing the voting");
        })

        it("User can succesfully finish voting after 3 minutes", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await voting.connect(addr2).vote(1, addr1.address, amount);
            await sleep(4000);
            await expect(voting.connect(addr2).finishVoting(1))
            .to.not.be.reverted;
        })
    })
    
    describe("withdraw() functionality", function() {

        it("User cannot withdraw the comission", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await voting.connect(addr2).vote(1, addr1.address, amount);
            await sleep(4000);
            await voting.connect(addr2).finishVoting(1);
            await expect(voting.connect(addr2).withdraw())
            .to.be.revertedWith("Only admin can withdraw the comission");
        })
        
        it("Admin can withdraw the comission", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await voting.connect(addr2).vote(1, addr1.address, amount);
            await sleep(4000);
            await voting.connect(addr2).finishVoting(1);
            await expect(voting.withdraw())
            .to.not.be.reverted;
        })
    })
    
    describe("showInfo() functionality", function() {

        it("Check for non-existing votings", async function() {
            expect((await voting.showInfo(123)).toString())
            .to.eq("The voting has not started yet");
        })

        it("Check whether the voting has ended", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await voting.connect(addr2).vote(1, addr1.address, amount);
            await sleep(4000);
            await voting.connect(addr2).finishVoting(1);
            expect((await voting.showInfo(1)).toString())
            .to.eq("The voting has already ended, winner is 0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
        })

        it("Check how the voting process is going", async function() {
            await voting.addVoting(1, [addr2.address, addr1.address]);
            await voting.connect(addr2).vote(1, addr1.address, amount);
            expect((await voting.showInfo(1)).toString())
            .to.eq("The voting is still in progress, preliminary results are:\n\
0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc - 0x00\n\
0x70997970c51812dc3a010c7d01b50e0d17dc79c8 - 0x01\n");
        })
    })
})