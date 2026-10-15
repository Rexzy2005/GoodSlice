// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SlyceShop} from "../../src/SlyceShop.sol";
import {SlyceTournament} from "../../src/SlyceTournament.sol";
import {SlyceArcade} from "../../src/SlyceArcade.sol";

/// Upgrade targets that add their own ERC-7201 namespace, as a real V2 must.
/// @custom:oz-upgrades-from src/SlyceShop.sol:SlyceShop
// V1 initialize already ran; V2 uses reinitializer(2).
/// @custom:oz-upgrades-unsafe-allow missing-initializer
contract SlyceShopV2 is SlyceShop {
    /// @custom:storage-location erc7201:slyce.storage.ShopV2
    struct V2Storage {
        uint256 marker;
    }

    // keccak256(abi.encode(uint256(keccak256("slyce.storage.ShopV2")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant V2_STORAGE = 0x8f6e68f0d1d173e5ace1d33a8b907ace8fdc0a65fdfa54d91f886f75a4606300;

    function version() external pure override returns (string memory) {
        return "2.0.0";
    }

    function initializeV2(uint256 value) external reinitializer(2) {
        _setMarker(value);
    }

    function setMarker(uint256 value) external onlyOwner {
        _setMarker(value);
    }

    function _setMarker(uint256 value) private {
        V2Storage storage $;
        assembly {
            $.slot := V2_STORAGE
        }
        $.marker = value;
    }
}

/// @custom:oz-upgrades-from src/SlyceTournament.sol:SlyceTournament
// V1 initialize already ran; V2 uses reinitializer(2).
/// @custom:oz-upgrades-unsafe-allow missing-initializer
contract SlyceTournamentV2 is SlyceTournament {
    function initializeV2() external reinitializer(2) {}

    function version() external pure override returns (string memory) {
        return "2.0.0";
    }
}

/// @custom:oz-upgrades-from src/SlyceArcade.sol:SlyceArcade
// V1 initialize already ran; V2 uses reinitializer(2).
/// @custom:oz-upgrades-unsafe-allow missing-initializer
contract SlyceArcadeV2 is SlyceArcade {
    function initializeV2() external reinitializer(2) {}

    function version() external pure override returns (string memory) {
        return "2.0.0";
    }
}

/// Not UUPS: upgrading to this must be rejected so the proxy can never get stuck.
contract NotUpgradeable {
    function version() external pure returns (string memory) {
        return "broken";
    }
}
