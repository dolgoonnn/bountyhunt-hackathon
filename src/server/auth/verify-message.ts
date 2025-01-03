// src/server/auth/verifyMessage.ts
import { verifyMessage } from "ethers";

export const MESSAGE_TO_SIGN =
  "Sign this message to authenticate with the application";

export const verifySignature = (address: string, signature: string) => {
  try {
    const recoveredAddress = verifyMessage(MESSAGE_TO_SIGN, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch {
    return false;
  }
};
