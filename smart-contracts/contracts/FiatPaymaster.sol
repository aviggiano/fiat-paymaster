// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {UserOperation} from "@account-abstraction/contracts/interfaces/UserOperation.sol";
import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {TokenPaymaster} from "@account-abstraction/contracts/samples/TokenPaymaster.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FiatPaymaster is TokenPaymaster {
    uint256 public ethToUsd = type(uint256).max;

    constructor(
        address accountFactory,
        string memory _symbol,
        IEntryPoint _entryPoint
    ) TokenPaymaster(accountFactory, _symbol, _entryPoint) {}

    function getTokenValueOfEth(
        uint256 valueEth
    ) internal view virtual override returns (uint256 valueToken) {
        return (valueEth * ethToUsd) / 1 ether;
    }

    function setTokenValueOfEth(uint256 _ethToUsd) external onlyOwner {
        ethToUsd = _ethToUsd;
    }
}
