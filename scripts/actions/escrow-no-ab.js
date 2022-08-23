const algosdk = require("algosdk");
const fs = require("fs");
const path = require("path");

const algodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN,
  process.env.ALGOD_SERVER,
  process.env.ALGOD_PORT
);

// Accounts used
const master = algosdk.mnemonicToSecretKey(process.env.MNEMONIC_CREATOR);

const submitToNetwork = async (signedTxn) => {
  // send txn
  let tx = await algodClient.sendRawTransaction(signedTxn).do();
  console.log("Transaction : " + tx.txId);

  // Wait for transaction to be confirmed
  confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

  //Get the completed Transaction
  console.log(
    "Transaction " +
      tx.txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  return confirmedTxn;
};

(async () => {
  // Compile to TEAL
  const filePath = path.join(__dirname, "../../artifacts/escrow.teal");
  const data = fs.readFileSync(filePath);
  const compiledProgram = await algodClient.compile(data).do();

  // Create logic signature
  const programBytes = new Uint8Array(Buffer.from(compiledProgram.result, "base64"));
  const lsig = new algosdk.LogicSigAccount(programBytes);

  const suggestedParams = await algodClient.getTransactionParams().do();

  // Fund the stateless smart contract
  let txn = algosdk.makePaymentTxnWithSuggestedParams(
    master.addr,
    lsig.address(),
    20e6,
    undefined,
    undefined,
    suggestedParams
  );

  // sign the transaction
  const signedTxn = txn.signTxn(master.sk);

  return await submitToNetwork(signedTxn);
})();
