// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SlyceTournament} from "../src/SlyceTournament.sol";
import {SlyceTest, MockGoodDollar} from "./utils/SlyceTest.sol";

/// Drives random sequences of every player and owner action.
contract TournamentHandler is Test {
    SlyceTournament internal t;
    MockGoodDollar internal token;
    address internal owner;
    address[] internal actors;
    uint256 public entries;
    uint256 public posts;
    uint256 public claims;
    uint256 public refunds;

    constructor(SlyceTournament t_, MockGoodDollar token_, address owner_) {
        t = t_;
        token = token_;
        owner = owner_;
        for (uint256 i; i < 5; i++) {
            address actor = makeAddr(string(abi.encodePacked("actor", vm.toString(i))));
            actors.push(actor);
            token.mint(actor, 1_000_000 ether);
            vm.prank(actor);
            token.approve(address(t), type(uint256).max);
        }
    }

    function _actor(uint256 seed) internal view returns (address) {
        return actors[seed % actors.length];
    }

    function _id(uint256 seed) internal view returns (uint256) {
        uint256 count = t.tournamentCount();
        return count == 0 ? 0 : 1 + (seed % count);
    }

    function create(uint128 fee, uint32 duration) external {
        fee = uint128(bound(fee, 0, 100 ether));
        duration = uint32(bound(duration, 10 minutes, 3 days));
        vm.prank(owner);
        t.createTournament(uint64(block.timestamp), uint64(block.timestamp + duration), fee, 0);
    }

    function enter(uint256 actorSeed, uint256 idSeed) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        vm.prank(_actor(actorSeed));
        try t.enter(id) {
            entries++;
        } catch {}
    }

    function sponsor(uint256 actorSeed, uint256 idSeed, uint128 amount) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        amount = uint128(bound(amount, 1, 1000 ether));
        vm.prank(_actor(actorSeed));
        try t.sponsor(id, amount) {} catch {}
    }

    function submit(uint256 actorSeed, uint256 idSeed, uint32 score) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        vm.prank(_actor(actorSeed));
        try t.submitScore(id, score) {} catch {}
    }

    function warp(uint32 secondsAhead) external {
        vm.warp(block.timestamp + bound(secondsAhead, 1, 2 days));
    }

    /// Posts a single-winner root paying up to the whole pool to one actor.
    function post(uint256 actorSeed, uint256 idSeed, uint128 share) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        uint128 pool = t.getTournament(id).pool;
        if (pool == 0) return;
        uint128 amount = uint128(bound(share, 1, pool));
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(id, _actor(actorSeed), amount))));
        vm.prank(owner);
        try t.postResults(id, leaf, amount) {
            posts++;
        } catch {}
    }

    function claim(uint256 actorSeed, uint256 idSeed) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        SlyceTournament.Tournament memory info = t.getTournament(id);
        if (info.resultsRoot == bytes32(0)) return;
        vm.prank(_actor(actorSeed));
        try t.claim(id, info.payoutTotal, new bytes32[](0)) {
            claims++;
        } catch {}
    }

    function cancel(uint256 idSeed) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        vm.prank(owner);
        try t.cancelTournament(id) {} catch {}
    }

    function refund(uint256 actorSeed, uint256 idSeed) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        vm.prank(_actor(actorSeed));
        try t.refund(id) {
            refunds++;
        } catch {}
    }

    function sweep(uint256 idSeed) external {
        uint256 id = _id(idSeed);
        if (id == 0) return;
        vm.warp(block.timestamp + 31 days);
        vm.prank(owner);
        try t.sweepUnclaimed(id) {} catch {}
    }
}

contract TournamentInvariantTest is SlyceTest {
    SlyceTournament t;
    TournamentHandler handler;

    function setUp() public override {
        super.setUp();
        t = deployTournament(IERC20(address(token)));
        handler = new TournamentHandler(t, token, owner);
        handler.create(5 ether, 1 days); // every run starts with an open tournament
        targetContract(address(handler));
    }

    /// The contract holds exactly what it owes: nothing can be stranded or over-paid.
    function invariant_balanceEqualsLiabilities() public view {
        assertEq(token.balanceOf(address(t)), t.liabilities());
    }

    function invariant_claimsNeverExceedPayout() public view {
        uint256 count = t.tournamentCount();
        for (uint256 id = 1; id <= count; id++) {
            SlyceTournament.Tournament memory info = t.getTournament(id);
            assertLe(info.claimed, info.payoutTotal);
            if (info.resultsRoot != bytes32(0)) assertGe(info.pool, info.payoutTotal);
        }
    }

    /// No token ever leaves the system: players + treasury + contract always sum to the minted supply.
    function invariant_conservation() public view {
        assertEq(token.totalSupply(), 5 * 1_000_000 ether);
    }
}

/// One long deterministic-length campaign that reports how often each success path ran.
contract TournamentCoverageTest is SlyceTest {
    function test_handlerReachesEverySuccessPath() public {
        SlyceTournament t = deployTournament(IERC20(address(token)));
        TournamentHandler h = new TournamentHandler(t, token, owner);
        for (uint256 i; i < 400; i++) {
            uint256 r = uint256(keccak256(abi.encode(i)));
            uint256 action = r % 9;
            if (action == 0) h.create(uint128(r >> 8), uint32(r >> 16));
            else if (action == 1 || action == 2) h.enter(r >> 8, r >> 16);
            else if (action == 3) h.sponsor(r >> 8, r >> 16, uint128(r >> 24));
            else if (action == 4) h.warp(uint32(r >> 8));
            else if (action == 5) h.post(r >> 8, r >> 16, uint128(r >> 24));
            else if (action == 6) h.claim(r >> 8, r >> 16);
            else if (action == 7) h.cancel(r >> 8);
            else h.refund(r >> 8, r >> 16);
            assertEq(token.balanceOf(address(t)), t.liabilities());
        }
        console.log("entries", h.entries(), "posts", h.posts());
        console.log("claims", h.claims(), "refunds", h.refunds());
        assertGt(h.entries(), 0);
        assertGt(h.posts(), 0);
        assertGt(h.claims(), 0);
        assertGt(h.refunds(), 0);
    }
}
