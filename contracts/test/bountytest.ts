// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { BountySystem } from "../typechain-types";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// import { Signer } from "ethers";

// describe("BountySystem", function () {
//   let bountySystem: BountySystem;
//   let owner: SignerWithAddress;
//   let creator: SignerWithAddress;
//   let winner: SignerWithAddress;
//   let otherAccount: SignerWithAddress;
//   let bountyId: string;
//   const reward = ethers.parseEther("1.0"); // 1 ETH

//   beforeEach(async function () {
//     [owner, creator, winner, otherAccount] = await ethers.getSigners();

//     const BountySystemFactory = await ethers.getContractFactory("BountySystem");
//     bountySystem = await BountySystemFactory.deploy();
//     await bountySystem.waitForDeployment();

//     // Generate a random bounty ID for each test
//     bountyId = ethers.keccak256(ethers.toUtf8Bytes(Math.random().toString()));
//   });

//   describe("Bounty Creation", function () {
//     it("Should allow creating a bounty with valid parameters", async function () {
//       const tx = await bountySystem.connect(creator).createBounty(bountyId, { value: reward });

//       const bounty = await bountySystem.bounties(bountyId);
//       expect(bounty.creator).to.equal(creator.address);
//       expect(bounty.reward).to.equal(reward);
//       expect(bounty.isOpen).to.equal(true);
//       expect(bounty.winner).to.equal(ethers.ZeroAddress);

//       await expect(tx)
//         .to.emit(bountySystem, "BountyCreated")
//         .withArgs(bountyId, creator.address, reward);
//     });

//     it("Should revert when creating a bounty with zero reward", async function () {
//       await expect(
//         bountySystem.connect(creator).createBounty(bountyId)
//       ).to.be.revertedWithCustomError(bountySystem, "ZeroReward");
//     });

//     it("Should revert when creating a bounty with existing ID", async function () {
//       await bountySystem.connect(creator).createBounty(bountyId, { value: reward });

//       await expect(
//         bountySystem.connect(creator).createBounty(bountyId, { value: reward })
//       ).to.be.revertedWithCustomError(bountySystem, "BountyExists");
//     });
//   });

//   describe("Bounty Completion", function () {
//     beforeEach(async function () {
//       // Create a bounty before each test in this block
//       await bountySystem.connect(creator).createBounty(bountyId, { value: reward });
//     });

//     it("Should allow creator to complete bounty", async function () {
//       const tx = await bountySystem.connect(creator).completeBounty(bountyId, winner.address);

//       const bounty = await bountySystem.bounties(bountyId);
//       expect(bounty.isOpen).to.equal(false);
//       expect(bounty.winner).to.equal(winner.address);

//       await expect(tx)
//         .to.emit(bountySystem, "BountyCompleted")
//         .withArgs(bountyId, winner.address, reward);

//       // Check if winner received the reward
//       await expect(tx).to.changeEtherBalance(winner, reward);
//     });

//     it("Should revert when non-creator tries to complete bounty", async function () {
//       await expect(
//         bountySystem.connect(otherAccount).completeBounty(bountyId, winner.address)
//       ).to.be.revertedWithCustomError(bountySystem, "NotBountyCreator");
//     });

//     it("Should revert when completing with zero address winner", async function () {
//       await expect(
//         bountySystem.connect(creator).completeBounty(bountyId, ethers.ZeroAddress)
//       ).to.be.revertedWithCustomError(bountySystem, "InvalidWinner");
//     });

//     it("Should revert when completing already closed bounty", async function () {
//       await bountySystem.connect(creator).completeBounty(bountyId, winner.address);

//       await expect(
//         bountySystem.connect(creator).completeBounty(bountyId, winner.address)
//       ).to.be.revertedWithCustomError(bountySystem, "BountyNotOpen");
//     });
//   });

//   describe("Bounty Cancellation", function () {
//     beforeEach(async function () {
//       await bountySystem.connect(creator).createBounty(bountyId, { value: reward });
//     });

//     it("Should allow creator to cancel bounty", async function () {
//       const tx = await bountySystem.connect(creator).cancelBounty(bountyId);

//       const bounty = await bountySystem.bounties(bountyId);
//       expect(bounty.isOpen).to.equal(false);


//       await expect(tx)
//         .to.emit(bountySystem, "BountyCancelled")
//         .withArgs(bountyId);

//       // Check if creator received the refund
//       await expect(tx).to.changeEtherBalance(creator, reward);
//     });

//     it("Should revert when non-creator tries to cancel bounty", async function () {
//       await expect(
//         bountySystem.connect(otherAccount).cancelBounty(bountyId)
//       ).to.be.revertedWithCustomError(bountySystem, "NotBountyCreator");
//     });

//     it("Should revert when cancelling already closed bounty", async function () {
//       await bountySystem.connect(creator).completeBounty(bountyId, winner.address);

//       await expect(
//         bountySystem.connect(creator).cancelBounty(bountyId)
//       ).to.be.revertedWithCustomError(bountySystem, "BountyNotOpen");
//     });
//   });
// });