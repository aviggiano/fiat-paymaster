// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {FiatPaymaster} from "./FiatPaymaster.sol";

contract FiatPaymasterFactory {
    FiatPaymaster public immutable fiatPaymaster;

    constructor(address accountFactory, string memory _symbol, IEntryPoint _entryPoint, bytes32 salt) {
        fiatPaymaster = new FiatPaymaster{salt: salt}(accountFactory, _symbol, _entryPoint);
    }
}
