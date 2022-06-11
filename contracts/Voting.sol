// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Voting {

    mapping (uint256 => mapping (address => int256)) public votings;

    struct Voter {
        address voter;
        mapping (uint256 => bool) voted;
    }

    address payable public owner;
    mapping (uint => uint256) public createTime;
    uint256 comission;

    mapping (address => Voter) public voters;
    mapping (uint256 => address payable []) public candidates;
    mapping (uint256 => address) public winners;

    constructor () {
        owner = payable(msg.sender);
        comission = 0;
    }

    function addVoting(uint256 votingId, address payable [] memory votees) external {
        require (msg.sender == owner, "Only admin can create new votings");
        createTime[votingId] = block.timestamp;
        for (uint i = 0; i < votees.length; i++) {
            votings[votingId][votees[i]] = -1;
            candidates[votingId].push(votees[i]);
        }
    }

    function vote(uint256 votingId, address payable votee) external payable {
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

    function finishVoting(uint256 votingId) external {
        //Here, since we cannot forge block timestamps, for the sake of time, and ability to test the contract, 
        //I changed the time required to finish the voting, so the user can finish the voting after 3 seconds, but not 3 days
        require (block.timestamp >= (createTime[votingId] + 3 seconds), "3 seconds should pass before closing the voting");
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
        comission += uint256(totalVotes) * 1000000 gwei;
        winner.transfer(uint256(totalVotes) * 9000000 gwei); 
        winners[votingId] = winner;
    }

    function withdraw() external {
        require (msg.sender == owner, "Only admin can withdraw the comission");
        owner.transfer(comission);
    }

    function showInfo(uint256 votingId) external view returns (string memory){
        address payable [] memory curCandidates = candidates[votingId];
        uint256 n = curCandidates.length;
        if (n == 0) {
            return "The voting has not started yet";
        }
        if (n != 0 && votings[votingId][curCandidates[0]] == 0) {
            string memory message = "The voting has already ended, winner is ";
            string memory win = Strings.toHexString(uint160(winners[votingId]), 20);
            return string(abi.encodePacked(message, win));
        } else {
            string memory message = "The voting is still in progress, preliminary results are:\n";
            for (uint i = 0; i < n; i++) {
                string memory candidate = Strings.toHexString(uint160(address(curCandidates[i])), 20);
                uint256 votes;
                if (votings[votingId][curCandidates[i]] == -1){
                    votes = 0;    
                } else {
                    votes = uint256(votings[votingId][curCandidates[i]]);
                }
                string memory tmp = string(abi.encodePacked(candidate, " - ", Strings.toHexString(votes)));
                message = string(abi.encodePacked(message, tmp, "\n"));
            }
            return message;
        }
    }
}