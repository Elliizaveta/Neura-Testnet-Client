import { Wallet, Contract, ContractInterface, ContractTransaction, CallOverrides } from "ethers";
import { getProvider } from "./provider";

/** Get read-only contract instance */
export function getContractReadonly(abi: ContractInterface, address: string): Contract {
  const provider = getProvider();
  return new Contract(address, abi, provider);
}

/** Get contract instance with signer (for write operations) */
export function getContractWithSigner(abi: ContractInterface, address: string, signer: Wallet | null): Contract {
  if (!signer) throw new Error("Signer (Wallet) is required for write operations");
  return new Contract(address, abi, signer);
}

/** Read-only call */
export async function callReadonly(abi: ContractInterface, address: string, method: string, args: any[] = []) {
  const c = getContractReadonly(abi, address);
  // @ts-ignore
  return await c[method](...args);
}

/** Send transaction to contract (state changing) */
export async function sendTransactionToContract(abi: ContractInterface, address: string, signer: Wallet, method: string, args: any[] = [], overrides: CallOverrides = {}): Promise<ContractTransaction> {
  const c = getContractWithSigner(abi, address, signer);
  // @ts-ignore
  const tx: ContractTransaction = await c[method](...args, overrides);
  return tx;
}
