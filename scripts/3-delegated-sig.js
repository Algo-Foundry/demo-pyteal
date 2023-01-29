const { types } = require("@algo-builder/web");

async function run (runtimeEnv, deployer) {
  // RECEIVER_ADDRESS is set in escrow.py when it is compiled from PyTEAL to TEAL
  const templateParams = {
    RECEIVER_ADDRESS: 'ZV4AZNH7EZK5XXL5KH6SF2BJW3GGXLSWJCUL2EGCIG3ITAIX2PEXQQLFCE'
  };

  const master = deployer.accountsByName.get("master");

  // acc balance before
  const balanceBefore = await deployer.algodClient.accountInformation(master.addr).do();

  // https://algobuilder.dev/api/algob/interfaces/types.Deployer.html#mkDelegatedLsig
  const dLsigName = 'delegatedSig';
  await deployer.mkDelegatedLsig(
    dLsigName,
    'escrow.py',
    deployer.accounts[0],
    templateParams
  ); 

  const delegatedSigAccount = await deployer.getLsig(dLsigName);

  // send algo txn signed by delegated signature
  const execParams = {
    type: types.TransactionType.TransferAlgo,
    sign: types.SignType.LogicSignature,
    fromAccountAddr: delegatedSigAccount.address(),
    toAccountAddr: templateParams.RECEIVER_ADDRESS,
    amountMicroAlgos: 1e6,
    lsig: delegatedSigAccount,
    payFlags: { totalFee: 1000 }
  }

  await deployer.executeTx(execParams);

  // acc balance after
  const balanceAfter = await deployer.algodClient.accountInformation(master.addr).do();

  // diff
  console.log("diff:", balanceAfter.amount - balanceBefore.amount);
}

module.exports = { default: run };
