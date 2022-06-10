// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Voting {

    mapping (uint => mapping (address => int256)) votings;

    struct Voter {
        address voter;
        mapping (uint => bool) voted;
        mapping (uint => address) candidate;
    }
    /*
    struct Votee {
        address candidate;
        int256 votes;
    }
    */
    address public owner;
    uint price;

    mapping (address => Voter) public voters;
    mapping (uint => address []) public candidates;

    constructor () {
        owner = msg.sender;
        price = 0.01 ether;
    }

    function addVoting(uint votingId, address [] memory votees) external {
        require (msg.sender == owner, "Only admin can create new votings");
        for (uint i = 0; i < votees.length; i++) {
            votings[votingId][votees[i]] = -1;
            candidates[votingId].push(votees[i]);
        }
    }

    function vote(uint256 votingId, address votee) public payable {
        address voter = msg.sender;
        require (msg.value >= 0.01 ether, "You must send at least 0.01 ETH");
        require (voters[voter].voted[votingId] != true, "You have already voted");
        require (voter != votee, "You cannot vote for yourself");
        voters[voter].voted[votingId] = true;
        if (votings[votingId][votee] == -1) {
            votings[votingId][votee] = 1;
        } else {
            votings[votingId][votee] += 1;
        }
    }

    function finishVoting() public{

    }

    function showFees() public{

    }
}