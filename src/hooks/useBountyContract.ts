import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ethers } from "ethers";
import { type BaseError } from "wagmi";
import { abi as BOUNTY_ABI } from "../../contracts/artifacts/contracts/BountySystem.sol/BountySystem.json";
// Validate and type the contract address
const contractAddress ="0x434CF930566EBEf560958a3002c8526d9613b930"
const BOUNTY_CONTRACT_ADDRESS = contractAddress as `0x${string}`;

if (!BOUNTY_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS is not defined");
}

if (!/^0x[a-fA-F0-9]{40}$/.exec(BOUNTY_CONTRACT_ADDRESS)) {
  throw new Error(
    "NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS is not a valid Ethereum address",
  );
}
export const useBountyContract = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const createBounty = async (bountyId: string, reward: string) => {
    const bytes32BountyId = ethers.id(bountyId);
    const rewardInWei = ethers.parseEther(reward);

    return writeContract({
      address: BOUNTY_CONTRACT_ADDRESS,
      abi: BOUNTY_ABI,
      functionName: "createBounty",
      args: [bytes32BountyId],
      value: rewardInWei,
    });
  };

  const completeBounty = async (bountyId: string, winnerAddress: string) => {
    const bytes32BountyId = ethers.id(bountyId);

    return writeContract({
      address: BOUNTY_CONTRACT_ADDRESS,
      abi: BOUNTY_ABI,
      functionName: "completeBounty",
      args: [bytes32BountyId, winnerAddress],
    });
  };

  const cancelBounty = async (bountyId: string) => {
    const bytes32BountyId = ethers.id(bountyId);

    return writeContract({
      address: BOUNTY_CONTRACT_ADDRESS,
      abi: BOUNTY_ABI,
      functionName: "cancelBounty",
      args: [bytes32BountyId],
    });
  };

  return {
    createBounty,
    completeBounty,
    cancelBounty,
    isLoading: isPending || isConfirming,
    isSuccess: isConfirmed,
    error: error as BaseError | null,
    hash,
  };
};
