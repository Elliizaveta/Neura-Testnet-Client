import { JsonRpcProvider } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://testnet.rpc.neuraprotocol.io/";

export function getProvider(): JsonRpcProvider {
  return new JsonRpcProvider(RPC_URL);
}
