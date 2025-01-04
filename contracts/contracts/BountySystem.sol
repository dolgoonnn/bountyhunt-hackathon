// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BountySystem {
    struct Bounty {
        address creator;
        uint96 reward; // Reduced from uint256 to uint96 to pack with address
        bool isOpen;
        address winner;
    }

    mapping(bytes32 => Bounty) public bounties;

    event BountyCreated(
        bytes32 indexed bountyId,
        address indexed creator,
        uint256 reward
    );
    event BountyCompleted(
        bytes32 indexed bountyId,
        address indexed winner,
        uint256 reward
    );
    event BountyCancelled(bytes32 indexed bountyId);

    error BountyNotOpen();
    error NotBountyCreator();
    error InvalidWinner();
    error TransferFailed();
    error BountyExists();
    error ZeroReward();

    function createBounty(bytes32 bountyId) external payable {
        if (msg.value == 0) revert ZeroReward();
        if (bounties[bountyId].creator != address(0)) revert BountyExists();

        bounties[bountyId] = Bounty({
            creator: msg.sender,
            reward: uint96(msg.value), // Safe casting as rewards are unlikely to exceed uint96
            isOpen: true,
            winner: address(0)
        });

        emit BountyCreated(bountyId, msg.sender, msg.value);
    }

    function completeBounty(bytes32 bountyId, address winner) external {
        // Cache storage pointer
        Bounty storage bounty = bounties[bountyId];

        // Batch checks
        if (bounty.creator != msg.sender) revert NotBountyCreator();
        if (!bounty.isOpen) revert BountyNotOpen();
        if (winner == address(0)) revert InvalidWinner();

        // Update state before transfer to prevent reentrancy
        uint256 reward = bounty.reward;
        bounty.isOpen = false;
        bounty.winner = winner;

        // Transfer reward
        (bool success, ) = winner.call{value: reward}("");
        if (!success) revert TransferFailed();

        emit BountyCompleted(bountyId, winner, reward);
    }

    function cancelBounty(bytes32 bountyId) external {
        Bounty storage bounty = bounties[bountyId];

        if (bounty.creator != msg.sender) revert NotBountyCreator();
        if (!bounty.isOpen) revert BountyNotOpen();

        uint256 reward = bounty.reward;
        bounty.isOpen = false;

        (bool success, ) = bounty.creator.call{value: reward}("");
        if (!success) revert TransferFailed();

        emit BountyCancelled(bountyId);
    }
}
