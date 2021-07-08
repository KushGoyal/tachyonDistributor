// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TachyonToken is ERC20 {

    constructor (string memory name_, string memory symbol_, uint amountToMint) ERC20(name_, symbol_) public {
        _mint(msg.sender, amountToMint);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

}
