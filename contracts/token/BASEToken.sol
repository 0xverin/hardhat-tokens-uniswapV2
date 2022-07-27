// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BASEToken is ERC20, Ownable {
    constructor() ERC20("BASEToken", "BASEToken") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount * 10**decimals());
    }
}
