import { useWriteContract, useWaitForTransactionReceipt ,usePublicClient, useAccount} from "wagmi";
import { ethers } from "ethers";
import { type BaseError } from "wagmi";
import { abi as BOUNTY_ABI } from "../../contracts/artifacts/contracts/BountySystem.sol/BountySystem.json";
// Validate and type the contract address
const contractAddress = "0xf9fB8E732Bc4a7D915DA451a309B63203e4D8F8e";
const BOUNTY_CONTRACT_ADDRESS = contractAddress as `0x${string}`;

if (!BOUNTY_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS is not defined");
}

if (!/^0x[a-fA-F0-9]{40}$/.exec(BOUNTY_CONTRACT_ADDRESS)) {
  throw new Error(
    "NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS is not a valid Ethereum address",
  );
}

interface BountyState {
  creator: string;
  reward: bigint;
  isOpen: boolean;
  winner: string;
}
export const useBountyContract = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const client = usePublicClient()
  const { address: userAddress } = useAccount();


  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

    // const result = useSimulateContract({
    //   address: BOUNTY_CONTRACT_ADDRESS,
    //   abi: BOUNTY_ABI,
    //   functionName: "createBounty",
    //   args: [bytes32BountyId],
    //   value: rewardInWei,
    // })
    const estimateGas = async (
      functionName: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: any[],
      value?: bigint
    ) => {
      if (!client) throw new Error("Public client not available");

      try {
        const estimate = await client.estimateContractGas({
          address: BOUNTY_CONTRACT_ADDRESS,
          abi: BOUNTY_ABI,
          functionName,
          args,
          value
        });

        // Add 20% buffer to the estimate
        return estimate * BigInt(120) / BigInt(100);
      } catch (err) {
        console.error("Gas estimation failed:", err);
        throw new Error("Failed to estimate gas");
      }
    };



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

  const getBountyState = async (bountyId: string): Promise<BountyState> => {
    if (!client) throw new Error("Client not initialized");

    const bytes32BountyId = ethers.id(bountyId);

    try {
      const bountyData = await client.readContract({
        address: BOUNTY_CONTRACT_ADDRESS,
        abi: BOUNTY_ABI,
        functionName: "bounties",
        args: [bytes32BountyId]
      });

      // Convert tuple to typed object
      const [creator, reward, isOpen, winner] = bountyData as [string, bigint, boolean, string];

      return {
        creator,
        reward,
        isOpen,
        winner
      };
    } catch (err) {
      console.error("Failed to fetch bounty:", err);
      throw new Error("Failed to fetch bounty state");
    }
  };

  const validateBountyCompletion = async (bountyId: string, winnerAddress: string) => {
    if (!userAddress) throw new Error("Wallet not connected");
    if (!ethers.isAddress(winnerAddress)) throw new Error("Invalid winner address");
    if (winnerAddress === ethers.ZeroAddress) throw new Error("Winner cannot be zero address");

    const bountyState = await getBountyState(bountyId);
    console.log("🚀 ~ validateBountyCompletion ~ bountyState:", bountyState)

    if (bountyState.creator === ethers.ZeroAddress) {
      throw new Error("Bounty does not exist");
    }

    if (bountyState.creator.toLowerCase() !== userAddress.toLowerCase()) {
      throw new Error("Only bounty creator can complete the bounty");
    }

    if (!bountyState.isOpen) {
      throw new Error("Bounty is not open");
    }

    return bountyState;
  };


  const completeBounty = async (bountyId: string, winnerAddress: string) => {
    const bytes32BountyId = ethers.id(bountyId);

    try {
      // Validate bounty state before attempting completion
      await validateBountyCompletion(bountyId, winnerAddress);

      // Get current gas price
      const gasPrice = await client?.getGasPrice();
      if (!gasPrice) throw new Error("Failed to get gas price");

      // Estimate gas for the transaction
      const gasEstimate = await client?.estimateContractGas({
        address: BOUNTY_CONTRACT_ADDRESS,
        abi: BOUNTY_ABI,
        functionName: "completeBounty",
        args: [bytes32BountyId, winnerAddress],
        account: userAddress,
      });

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate ? (gasEstimate * BigInt(120)) / BigInt(100) : undefined;

      return writeContract({
        address: BOUNTY_CONTRACT_ADDRESS,
        abi: BOUNTY_ABI,
        functionName: "completeBounty",
        args: [bytes32BountyId, winnerAddress],
        gas: gasLimit,
        gasPrice: gasPrice
      });

    } catch (err) {
      // // Map contract errors to user-friendly messages
      // if (err.message?.includes("NotBountyCreator")) {
      //   throw new Error("Only the bounty creator can complete this bounty");
      // } else if (err.message?.includes("BountyNotOpen")) {
      //   throw new Error("This bounty is not open");
      // } else if (err.message?.includes("InvalidWinner")) {
      //   throw new Error("Invalid winner address provided");
      // } else if (err.message?.includes("TransferFailed")) {
      //   throw new Error("Failed to transfer reward to winner");
      // }

      throw err;
    }
  };
  const getBountyDetails = async (bountyId: string) => {
    try {
      const state = await getBountyState(bountyId);
      return {
        exists: state.creator !== ethers.ZeroAddress,
        isCreator: state.creator.toLowerCase() === userAddress?.toLowerCase(),
        isOpen: state.isOpen,
        reward: state.reward,
        winner: state.winner,
      };
    } catch (err) {
      console.error("Error fetching bounty details:", err);
      throw err;
    }
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
    getBountyDetails,
    completeBounty,
    cancelBounty,
    isLoading: isPending || isConfirming,
    isSuccess: isConfirmed,
    error: error as BaseError | null,
    hash,
  };
};
