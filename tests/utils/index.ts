import { TonClient, WalletContractV3R2, fromNano, internal, toNano } from "ton";

import fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import path from 'path';

export async function saveSecretWords(words: string, address: string) {
  const addressPath = path.join(__dirname, '../../.wallets', address);

  fs.writeFile(addressPath, words, function (err) {
    if (err) throw err;

    
    console.log("File was saved:", addressPath);
  });
}

export async function readSecretWords(): Promise<string | void> {
  const secretWordsPath = path.join(__dirname, '../../.wallets/main/secret-words.txt');

  try {
    // @ts-ignore
    const data = fs.readFile(secretWordsPath, { encoding: 'utf8' });
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return;
  }
}


export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getBalanceByMnemonic(mnemonic: string) {
  const key = await mnemonicToWalletKey(mnemonic.split(" "));

  const wallet = WalletContractV3R2.create({ publicKey: key.publicKey, workchain: 0 })

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  const balance = await client.getBalance(wallet.address);

  return fromNano(balance)
}

export async function sendTransaction(
  mnemonic: string,
  receiveAddress: string,
  value = "0.001"
) {
  // open wallet v4 (notice the correct wallet version here)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));

  const wallet = WalletContractV3R2.create({ publicKey: key.publicKey, workchain: 0 })

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  const fromNanoBalance = fromNano(balance);
  console.log("balance:", fromNanoBalance);

    // make sure wallet is deployed
  // if (!await client.isContractDeployed(wallet.address)) {
  //   return console.log("wallet is not deployed");
  // }

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: receiveAddress,
        value: toNano(value), // 0.001 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });  

  console.log("seqno:", seqno);

    // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(2000);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}
