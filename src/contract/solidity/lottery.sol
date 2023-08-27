// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.9;

contract Lottery {
    address public  manager;
    address payable[] participant;

    constructor () {
        manager = msg.sender;
    }

    function participate() public payable {
        require(msg.value > .01 ether);
        participant.push(payable(msg.sender));
    }

    function getParticipant() public view returns (address payable[] memory){
        return participant;
    }

    function widthdraw(address payable _to) public restricted payable {
        // require(amount < msg.value);
        _to.transfer(address(this).balance);
    }

    function random() private view returns (uint256) {
        return uint(keccak256(abi.encode(block.difficulty, block.timestamp, participant)));
    }

    function pickWinner() public restricted {
        require(participant.length > 0, "Participant must not be empty");
        uint index = random() % participant.length;
        address payable selectedWinner = participant[index];
        selectedWinner.transfer(address(this).balance);
        participant = new address payable[](0);
    }

    modifier restricted() {
        require(manager == msg.sender, "Not enought privilege");
        _;
    }
}