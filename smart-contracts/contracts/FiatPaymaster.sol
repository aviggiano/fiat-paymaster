// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {UserOperation} from "@account-abstraction/contracts/interfaces/UserOperation.sol";
import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {TokenPaymaster} from "@account-abstraction/contracts/samples/TokenPaymaster.sol";
import {IConnext} from "@connext/interfaces/core/IConnext.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FiatPaymaster is TokenPaymaster {
    IConnext public connext;
    uint256 public ethToUsd = type(uint256).max;

    event TokenValueOfEthChanged(uint256 previousValue, uint256 newValue);
    event ConnextChanged(IConnext indexed previousValue, IConnext indexed newValue);

    constructor(
        address accountFactory,
        string memory _symbol,
        IEntryPoint _entryPoint,
        address _owner
    ) TokenPaymaster(accountFactory, _symbol, _entryPoint) {
        transferOwnership(_owner);
    }

    function getTokenValueOfEth(uint256 valueEth) internal view virtual override returns (uint256 valueToken) {
        return (valueEth * ethToUsd) / 1 ether;
    }

    function setTokenValueOfEth(uint256 _ethToUsd) external onlyOwner {
        emit TokenValueOfEthChanged(ethToUsd, _ethToUsd);
        ethToUsd = _ethToUsd;
    }

    function setConnext(IConnext _connext) external onlyOwner {
        emit ConnextChanged(connext, _connext);
        connext = _connext;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == address(connext));
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public {
        require(msg.sender == address(connext));
        _burn(to, amount);
    }
}
