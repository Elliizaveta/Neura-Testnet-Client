/**
 * Example usage:
 * - print node block number
 * - (optionally) show wallet balance
 * - (optionally) read ERC20 token balance if ERC20_ADDRESS and OWNER_ADDRESS are set
 *
 * Run:
 * npm run dev
 */
import dotenv from "dotenv";
dotenv.config();

import { getProvider } from "../provider";
import { createWalletFromPrivateKey, getBalance } from "../wallet";
import { callReadonly } from "../contract";

async function main() {
  const provider = getProvider();
  const block = await provider.getBlockNumber();
  console.log("Connected to block:", block);

  const pk = process.env.PRIVATE_KEY;
  const wallet = createWalletFromPrivateKey(pk);
  if (wallet) {
    const addr = await wallet.getAddress();
    const balance = await getBalance(addr);
    console.log("Wallet address:", addr);
    console.log("Balance (wei):", balance.toString());
  } else {
    console.log("Private key not set in .env (skipping wallet tests)");
  }

  const erc20 = process.env.ERC20_ADDRESS;
  const owner = process.env.OWNER_ADDRESS;
  if (erc20 && owner) {
    const abi = [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)"
    ];
    try {
      const bal = await callReadonly(abi, erc20, "balanceOf", [owner]);
      const decimals = await callReadonly(abi, erc20, "decimals", []);
      const symbol = await callReadonly(abi, erc20, "symbol", []);
      console.log(`Token ${symbol} balance for ${owner}:`, bal.toString(), "decimals:", decimals);
    } catch (e) {
      console.error("ERC20 read failed:", e);
    }
  } else {
    console.log("ERC20_ADDRESS or OWNER_ADDRESS not set — skipping ERC20 example");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});dc 8+
