// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint public counter;
    address public owner;

    constructor(uint x) {
        counter = x;
        owner = msg.sender;
    }

    modifier OnlyOwner {                                
        require(owner == msg.sender, "Only owner can call");   
        _;
    }

    function count() public OnlyOwner {
        counter = counter + 1;
    }
}