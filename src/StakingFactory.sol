// SPDX-License-Identifier: None
pragma solidity ^0.6;

import './Util/MinerManager.sol';

contract StakingFactory is MinerManager {
    constructor() public MinerManager() {}
}