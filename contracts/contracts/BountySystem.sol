// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BountySystem {
    struct Bounty {
        address creator;
        uint256 reward;
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

    function createBounty(bytes32 bountyId) external payable {
        require(msg.value > 0, "Reward must be greater than 0");
        require(
            bounties[bountyId].creator == address(0),
            "Bounty ID already exists"
        );

        bounties[bountyId] = Bounty({
            creator: msg.sender,
            reward: msg.value,
            isOpen: true,
            winner: address(0)
        });

        emit BountyCreated(bountyId, msg.sender, msg.value);
    }

    function completeBounty(bytes32 bountyId, address winner) external {
        Bounty storage bounty = bounties[bountyId];
        require(
            bounty.creator == msg.sender,
            "Only creator can complete bounty"
        );
        require(bounty.isOpen, "Bounty is not open");
        require(winner != address(0), "Invalid winner address");

        bounty.isOpen = false;
        bounty.winner = winner;

        uint256 reward = bounty.reward;
        (bool success, ) = winner.call{value: reward}("");
        require(success, "Transfer failed");

        emit BountyCompleted(bountyId, winner, reward);
    }

    function cancelBounty(bytes32 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.creator == msg.sender, "Only creator can cancel bounty");
        require(bounty.isOpen, "Bounty is not open");

        bounty.isOpen = false;

        uint256 reward = bounty.reward;
        (bool success, ) = bounty.creator.call{value: reward}("");
        require(success, "Transfer failed");

        emit BountyCancelled(bountyId);
    }
}
