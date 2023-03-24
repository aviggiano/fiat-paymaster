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
        IEntryPoint _entryPoint
    ) TokenPaymaster(accountFactory, _symbol, _entryPoint) {}

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

    // https://docs.connext.network/developers/examples/simple-bridge
    /**
     * @notice Transfers non-native assets from one chain to another.
     * @dev User should approve a spending allowance before calling this.
     * @param amount The amount to transfer.
     * @param recipient The destination address (e.g. a wallet).
     * @param destinationDomain The destination domain ID.
     * @param slippage The maximum amount of slippage the user will accept in BPS.
     * @param relayerFee The fee offered to relayers.
     */
    function xTransfer(
        uint256 amount,
        address recipient,
        uint32 destinationDomain,
        uint256 slippage,
        uint256 relayerFee
    ) external payable {
        require(address(connext) != address(0), "Bridge not supported on this chain");
        require(msg.value == relayerFee, "msg.value MUST be passed in equal to the specified relayerFee");
        require(this.balanceOf(msg.sender) >= amount, "User must have enouth tokens");

        _burn(msg.sender, amount);
        _mint(address(this), amount);
        this.approve(address(connext), amount);

        connext.xcall{value: relayerFee}(
            destinationDomain, // _destination: Domain ID of the destination chain
            recipient, // _to: address receiving the funds on the destination
            address(this), // _asset: address of the token contract
            msg.sender, // _delegate: address that can revert or forceLocal on destination
            amount, // _amount: amount of tokens to transfer
            slippage, // _slippage: the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
            bytes("") // _callData: empty bytes because we're only sending funds
        );
    }
}
