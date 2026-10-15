// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Hashes} from "@openzeppelin/contracts/utils/cryptography/Hashes.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {SlyceTournament} from "../src/SlyceTournament.sol";
import {SlyceTest, MockGoodDollar} from "./utils/SlyceTest.sol";

contract SlyceTournamentTest is SlyceTest {
    SlyceTournament t;
    uint256 id;
    uint64 start;
    uint64 end;

    function setUp() public override {
        super.setUp();
        t = deployTournament(IERC20(address(token)));
        start = uint64(block.timestamp);
        end = start + 1 days;
        vm.prank(owner);
        id = t.createTournament(start, end, 5 ether, 0);
        address[3] memory players = [alice, bob, carol];
        for (uint256 i; i < players.length; i++) {
            fund(players[i], address(t), 100 ether);
            vm.prank(players[i]);
            t.enter(id);
        }
    }

    function leaf(uint256 tid, address player, uint128 amount) internal pure returns (bytes32) {
        return keccak256(bytes.concat(keccak256(abi.encode(tid, player, amount))));
    }

    function pair(address a, uint128 x, address b, uint128 y) internal view returns (bytes32 root) {
        return Hashes.commutativeKeccak256(leaf(id, a, x), leaf(id, b, y));
    }

    function proofOf(bytes32 sibling) internal pure returns (bytes32[] memory p) {
        p = new bytes32[](1);
        p[0] = sibling;
    }

    function assertSolvent() internal view {
        assertGe(token.balanceOf(address(t)), t.liabilities());
    }

    // ----- Creation -----

    function test_createValidation() public {
        vm.startPrank(owner);
        vm.expectRevert(SlyceTournament.InvalidSchedule.selector);
        t.createTournament(start - 1, end, 0, 0); // backdated
        vm.expectRevert(SlyceTournament.InvalidSchedule.selector);
        t.createTournament(start, start + 9 minutes, 0, 0); // too short
        vm.expectRevert(SlyceTournament.InvalidSchedule.selector);
        t.createTournament(start, start + 32 days, 0, 0); // too long
        vm.expectRevert(SlyceTournament.InvalidSchedule.selector);
        t.createTournament(end, start, 0, 0); // inverted
        vm.expectRevert(SlyceTournament.InvalidFee.selector);
        t.createTournament(start, end, 10_001 ether, 0);
        vm.stopPrank();
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        t.createTournament(start, end, 0, 0);
    }

    // ----- Entry -----

    function test_entriesBuildPoolAndLiabilities() public view {
        SlyceTournament.Tournament memory info = t.getTournament(id);
        assertEq(info.entrants, 3);
        assertEq(info.pool, 15 ether);
        assertEq(t.liabilities(), 15 ether);
        assertEq(token.balanceOf(address(t)), 15 ether);
        assertTrue(t.entered(id, alice));
    }

    function test_entryRules() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.AlreadyEntered.selector, id));
        t.enter(id);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.UnknownTournament.selector, 99));
        t.enter(99);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.UnknownTournament.selector, 0));
        t.enter(0);
        address dave = makeAddr("dave");
        fund(dave, address(t), 5 ether);
        vm.warp(end);
        vm.prank(dave);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NotOpen.selector, id));
        t.enter(id);
    }

    function test_notStartedYet() public {
        vm.prank(owner);
        uint256 later = t.createTournament(start + 1 hours, end, 1 ether, 0);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NotOpen.selector, later));
        t.enter(later);
    }

    function test_maxEntrants() public {
        vm.prank(owner);
        uint256 small = t.createTournament(start, end, 1 ether, 2);
        vm.prank(alice);
        t.enter(small);
        vm.prank(bob);
        t.enter(small);
        vm.prank(carol);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.TournamentFull.selector, small));
        t.enter(small);
    }

    function test_freeTournamentNeedsNoTokens() public {
        vm.prank(owner);
        uint256 free = t.createTournament(start, end, 0, 0);
        address dave = makeAddr("dave");
        vm.prank(dave);
        t.enter(free);
        assertTrue(t.entered(free, dave));
    }

    // ----- Scores -----

    function test_scoreRules() public {
        uint32 tooHigh = t.MAX_SCORE() + 1;
        vm.startPrank(alice);
        t.submitScore(id, 120);
        vm.expectRevert(SlyceTournament.InvalidScore.selector);
        t.submitScore(id, 100); // not an improvement
        vm.expectRevert(SlyceTournament.InvalidScore.selector);
        t.submitScore(id, 0);
        vm.expectRevert(SlyceTournament.InvalidScore.selector);
        t.submitScore(id, tooHigh);
        t.submitScore(id, 150);
        vm.stopPrank();
        assertEq(t.bestScore(id, alice), 150);
        vm.prank(makeAddr("outsider"));
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NotEntered.selector, id));
        t.submitScore(id, 1);
        vm.warp(end);
        vm.prank(bob);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NotOpen.selector, id));
        t.submitScore(id, 10);
    }

    // ----- Results and claims -----

    function test_resultsAndClaims() public {
        fund(address(this), address(t), 5 ether);
        t.sponsor(id, 5 ether); // pool = 20
        bytes32 root = pair(alice, 12 ether, bob, 6 ether);

        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NotEnded.selector, id));
        t.postResults(id, root, 18 ether);

        vm.warp(end);
        vm.expectEmit(address(t));
        emit SlyceTournament.ResultsPosted(id, root, 18 ether, 2 ether);
        vm.prank(owner);
        t.postResults(id, root, 18 ether);
        assertEq(token.balanceOf(treasury), 2 ether);
        assertEq(t.liabilities(), 18 ether);

        vm.prank(alice);
        t.claim(id, 12 ether, proofOf(leaf(id, bob, 6 ether)));
        assertEq(token.balanceOf(alice), 95 ether + 12 ether);
        assertSolvent();

        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.AlreadyClaimed.selector, id));
        t.claim(id, 12 ether, proofOf(leaf(id, bob, 6 ether)));

        vm.prank(carol); // not a winner
        vm.expectRevert(SlyceTournament.InvalidProof.selector);
        t.claim(id, 12 ether, proofOf(leaf(id, bob, 6 ether)));

        vm.prank(bob); // wrong amount
        vm.expectRevert(SlyceTournament.InvalidProof.selector);
        t.claim(id, 7 ether, proofOf(leaf(id, alice, 12 ether)));

        vm.prank(bob);
        t.claim(id, 6 ether, proofOf(leaf(id, alice, 12 ether)));
        assertEq(t.liabilities(), 0);
        assertEq(token.balanceOf(address(t)), 0);
    }

    function test_postResultsValidation() public {
        vm.warp(end);
        vm.startPrank(owner);
        vm.expectRevert(SlyceTournament.InvalidProof.selector);
        t.postResults(id, bytes32(0), 1 ether);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.PayoutExceedsPool.selector, 16 ether, 15 ether));
        t.postResults(id, bytes32(uint256(1)), 16 ether);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.PayoutExceedsPool.selector, 0, 15 ether));
        t.postResults(id, bytes32(uint256(1)), 0);
        t.postResults(id, bytes32(uint256(1)), 15 ether);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.ResultsAlreadyPosted.selector, id));
        t.postResults(id, bytes32(uint256(2)), 15 ether);
        vm.stopPrank();
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        t.postResults(id, bytes32(uint256(1)), 1 ether);
    }

    function test_claimBeforeResults() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.ResultsNotPosted.selector, id));
        t.claim(id, 1 ether, new bytes32[](0));
    }

    /// Root and proofs generated by apps/web/src/web3/merkle.ts for tournament 1 (tests/unit/merkle.test.ts players).
    function test_claimsWithOffchainGeneratedTree() public {
        address[3] memory winners = [
            0x328809Bc894f92807417D2dAD6b7C998c1aFdac6,
            0x1D96F2f6BeF1202E4Ce1Ff6Dad0c2CB002861d3e,
            0xea475d60c118d7058beF4bDd9c32bA51139a74e0
        ];
        uint128[3] memory amounts = [uint128(8 ether), 5 ether, 2 ether];
        bytes32[][] memory proofs = new bytes32[][](3);
        proofs[0] = new bytes32[](2);
        proofs[0][0] = 0x0047d235ffafe3a249d630d21029622e72c38ba0ef5c9bd04baf76078a2a558f;
        proofs[0][1] = 0x7439f5281fb31481b010292eb02596e2e5798b293a4515a1d6829ed8bd9cb990;
        proofs[1] = new bytes32[](2);
        proofs[1][0] = 0x41e6fc882246315e326dc9402b76ac313ccb673bb51d9356c164d2503dbe3fb2;
        proofs[1][1] = 0x7439f5281fb31481b010292eb02596e2e5798b293a4515a1d6829ed8bd9cb990;
        proofs[2] = new bytes32[](1);
        proofs[2][0] = 0xdbcb067c9f66bdc767d83491e81bd09e38d903d651c49a7b4b469cb3d5f344d3;
        vm.warp(end);
        vm.prank(owner);
        t.postResults(id, 0x8158005278cd22d96f3e37cf6003cfef2522fe89b0decf89a1701dbd4466e7c7, 15 ether);
        for (uint256 i; i < 3; i++) {
            uint256 before = token.balanceOf(winners[i]);
            vm.prank(winners[i]);
            t.claim(id, amounts[i], proofs[i]);
            assertEq(token.balanceOf(winners[i]) - before, amounts[i]);
        }
        assertEq(token.balanceOf(address(t)), 0);
        assertEq(t.liabilities(), 0);
    }

    // ----- Sweep -----

    function test_sweepAfterClaimWindow() public {
        bytes32 root = pair(alice, 10 ether, bob, 5 ether);
        vm.warp(end);
        vm.startPrank(owner);
        t.postResults(id, root, 15 ether);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.ClaimWindowOpen.selector, id));
        t.sweepUnclaimed(id);
        vm.stopPrank();
        vm.prank(alice);
        t.claim(id, 10 ether, proofOf(leaf(id, bob, 5 ether)));
        vm.warp(block.timestamp + 30 days);
        vm.prank(owner);
        t.sweepUnclaimed(id);
        assertEq(token.balanceOf(treasury), 5 ether);
        assertEq(token.balanceOf(address(t)), 0);
        vm.prank(bob); // too late
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.PayoutExceedsPool.selector, 20 ether, 15 ether));
        t.claim(id, 5 ether, proofOf(leaf(id, alice, 10 ether)));
    }

    // ----- Cancel and refund -----

    function test_cancelRefundsEntrantsAndSponsors() public {
        fund(address(this), address(t), 7 ether);
        t.sponsor(id, 7 ether);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NotCancelled.selector, id));
        t.refund(id);

        vm.prank(owner);
        t.cancelTournament(id);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.Cancelled.selector, id));
        t.submitScore(id, 5);

        vm.prank(alice);
        t.refund(id);
        assertEq(token.balanceOf(alice), 100 ether);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NothingToRefund.selector, id));
        t.refund(id);

        t.refund(id); // sponsor
        vm.prank(bob);
        t.refund(id);
        vm.prank(carol);
        t.refund(id);
        assertEq(token.balanceOf(address(t)), 0);
        assertEq(t.liabilities(), 0);

        vm.prank(makeAddr("stranger"));
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.NothingToRefund.selector, id));
        t.refund(id);

        vm.warp(end);
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.Cancelled.selector, id));
        t.postResults(id, bytes32(uint256(1)), 1 ether);
    }

    function test_cannotCancelAfterResults() public {
        vm.warp(end);
        vm.startPrank(owner);
        t.postResults(id, bytes32(uint256(1)), 15 ether);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.ResultsAlreadyPosted.selector, id));
        t.cancelTournament(id);
        vm.stopPrank();
    }

    // ----- Pause -----

    function test_pauseBlocksPlayButNotClaimsOrRefunds() public {
        vm.prank(owner);
        t.pause();
        vm.prank(alice);
        vm.expectRevert(PausableUpgradeable.EnforcedPause.selector);
        t.submitScore(id, 10);
        address dave = makeAddr("dave");
        fund(dave, address(t), 5 ether);
        vm.prank(dave);
        vm.expectRevert(PausableUpgradeable.EnforcedPause.selector);
        t.enter(id);

        vm.prank(owner);
        t.cancelTournament(id);
        vm.prank(alice);
        t.refund(id); // still works while paused
        assertEq(token.balanceOf(alice), 100 ether);
    }

    // ----- Rescue -----

    function test_rescueNeverTouchesPlayerFunds() public {
        token.mint(address(t), 3 ether); // accidental transfer
        vm.startPrank(owner);
        vm.expectRevert(abi.encodeWithSelector(SlyceTournament.ExceedsSurplus.selector, 4 ether, 3 ether));
        t.rescue(IERC20(address(token)), owner, 4 ether);
        t.rescue(IERC20(address(token)), owner, 3 ether);
        vm.stopPrank();
        assertEq(token.balanceOf(address(t)), t.liabilities());

        MockGoodDollar other = new MockGoodDollar();
        other.mint(address(t), 9 ether);
        vm.prank(owner);
        t.rescue(IERC20(address(other)), owner, 9 ether);
        assertEq(other.balanceOf(owner), 9 ether);
    }

    // ----- Fuzz -----

    function testFuzz_payoutSplitIsSolvent(uint128 sponsorAmount, uint128 first, uint128 second) public {
        sponsorAmount = uint128(bound(sponsorAmount, 1, 1_000_000 ether));
        fund(address(this), address(t), sponsorAmount);
        t.sponsor(id, sponsorAmount);
        uint128 pool = t.getTournament(id).pool;
        first = uint128(bound(first, 1, pool - 1));
        second = uint128(bound(second, 1, pool - first));
        vm.warp(end);
        vm.prank(owner);
        t.postResults(id, pair(alice, first, bob, second), first + second);
        vm.prank(alice);
        t.claim(id, first, proofOf(leaf(id, bob, second)));
        vm.prank(bob);
        t.claim(id, second, proofOf(leaf(id, alice, first)));
        assertEq(token.balanceOf(address(t)), 0);
        assertEq(t.liabilities(), 0);
        assertEq(token.balanceOf(treasury), pool - first - second);
    }
}
