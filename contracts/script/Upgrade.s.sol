// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {SlyceShop} from "../src/SlyceShop.sol";
import {SlyceTournament} from "../src/SlyceTournament.sol";
import {SlyceArcade} from "../src/SlyceArcade.sol";

/// Deploys a new implementation and points the proxy at it (owner only).
/// Env: PROXY, CONTRACT (Shop | Tournament | Arcade). Run the upgrade-safety check first (contracts/README.md).
contract Upgrade is Script {
    function run() external {
        address proxy = vm.envAddress("PROXY");
        bytes32 kind = keccak256(bytes(vm.envString("CONTRACT")));
        vm.startBroadcast();
        address impl;
        if (kind == keccak256("Shop")) impl = address(new SlyceShop());
        else if (kind == keccak256("Tournament")) impl = address(new SlyceTournament());
        else if (kind == keccak256("Arcade")) impl = address(new SlyceArcade());
        else revert("CONTRACT must be Shop, Tournament or Arcade");
        UUPSUpgradeable(proxy).upgradeToAndCall(impl, "");
        vm.stopBroadcast();
        console.log("Upgraded", proxy, "to", impl);
    }
}
