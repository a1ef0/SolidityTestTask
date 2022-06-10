pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Voting {

    mapping (uint => mapping (address => uint)) votings;

    struct Voter {
        address voter;
        bool [] voted;
        address [] candidate;
    }

    struct Votee {
        address candidate;
        uint256 votes;
    }

    address public owner;
    mapping (address => Voter) public voters;
    constructor () {
        owner = msg.sender;
    }

    function addVoting(uint votingId, address [] memory votees) external {
        require (msg.sender == owner, "Only admin can create new votings");
        //console.log(owner);
        for (uint i = 0; i < votees.length; i++) {
            //console.log(votees.length);
            votings[votingId][votees[i]] = 0;
        }
    }

    function vote(uint256 votingId, address votee) public payable {

    }

    function finishVoting() public{

    }

    function showFees() public{

    }
}