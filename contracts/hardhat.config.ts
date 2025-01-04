import { type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",

  networks: {
    eduChain: {
      chainId: 656476,
      url: "https://open-campus-codex-sepolia.drpc.org",
    },
    // Add your Ethereum network configurations here.
  },
};

export default config;
