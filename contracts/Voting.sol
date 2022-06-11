// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Voting {

    mapping (uint256 => mapping (address => int256)) public votings;

    struct Voter {
        address voter;
        mapping (uint256 => bool) voted;
        mapping (uint256 => address) candidate;
    }

    address public owner;
    mapping (uint => uint256) public createTime;

    mapping (address => Voter) public voters;
    mapping (uint256 => address payable []) public candidates;

    constructor () {
        owner = msg.sender;
    }

    function addVoting(uint256 votingId, address payable [] memory votees) external {
        require (msg.sender == owner, "Only admin can create new votings");
        createTime[votingId] = block.timestamp;
        for (uint i = 0; i < votees.length; i++) {
            votings[votingId][votees[i]] = -1;
            candidates[votingId].push(votees[i]);
        }
    }

    function vote(uint256 votingId, address payable votee) public payable {
        address voter = msg.sender;
        require (msg.value >= 0.01 ether, "You must send at least 0.01 ETH");
        require (votings[votingId][votee] != 0, "You can vote only in created votings");
        require (voters[voter].voted[votingId] != true, "You have already voted");
        require (voter != votee, "You cannot vote for yourself");
        voters[voter].voted[votingId] = true;
        if (votings[votingId][votee] == -1) {
            votings[votingId][votee] = 1;
        } else {
            votings[votingId][votee] += 1;
        }
    }

    function finishVoting(uint256 votingId) public{
        require (block.timestamp >= (createTime[votingId] + 10 seconds), "3 days should pass before closing the voting");
        address payable winner;
        int256 votes = -1;
        int256 totalVotes = 0;
        address payable [] memory pretendents = candidates[votingId];
        for (uint i = 0; i < pretendents.length; i++){
            int256 curVotes = votings[votingId][pretendents[i]];
            if (curVotes > votes) {
                votes = curVotes;
                winner = pretendents[i];
            }
            if (curVotes > -1) {
                totalVotes += curVotes;
            }
            votings[votingId][pretendents[i]] = 0;
        }
        winner.transfer(uint256(totalVotes) * 9000000 gwei); 
    }

    function showFees() public{

    }
}