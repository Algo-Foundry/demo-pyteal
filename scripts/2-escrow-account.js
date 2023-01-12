/**
 * In this script we will fund an escrow contract. The escrow contract
 * ensures the payment is made out(from the escrow) to a specific receiver only.
 * This receiver address is hardcoded in the smart contract, and can be passed
 * dynamically to the contract using fundLsig function (passed as a template parameter)
 */
async function run (runtimeEnv, deployer) {
  console.log('Escrow account script execution started!');

  // RECEIVER_ADDRESS is set in escrow.py when it is compiled from PyTEAL to TEAL
  const templateParams = {
    RECEIVER_ADDRESS: 'ZV4AZNH7EZK5XXL5KH6SF2BJW3GGXLSWJCUL2EGCIG3ITAIX2PEXQQLFCE'
  };
  await deployer.fundLsigByFile('escrow.py',
    { funder: deployer.accounts[0], fundingMicroAlgo: 20e6 }, { fee: 1000 }, templateParams);
  const escrow = await deployer.loadLogicByFile('escrow.py', templateParams);

  await deployer.addCheckpointKV('User Checkpoint Escrow', `Fund Escrow Account: ${escrow.address()}`);
  console.log('Escrow account script execution finished!');
}

module.exports = { default: run };
