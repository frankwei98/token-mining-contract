// SPDX-License-Identifier: GPL v3
pragma solidity ^0.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply
    ) public ERC20(name, symbol) {
        _setupDecimals(decimals);
        _mint(msg.sender, initialSupply);
    }
}