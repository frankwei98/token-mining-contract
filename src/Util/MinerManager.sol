// SPDX-License-Identifier: None

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MinerManager is Ownable {
    mapping (address => bool) public miners;

    constructor() internal Ownable() {}

    function addMiner(address _minter) public onlyOwner {
        miners[_minter] = true;
    }
    function removeMiner(address _minter) public onlyOwner {
        miners[_minter] = false;
    }

    modifier onlyMiner() {
        require(miners[msg.sender], "Error: only miner");
        _;
    }
}
