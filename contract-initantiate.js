// Copyright 2019 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// global: api, util, loadWallet
function usage() {
  console.log(`
USAGE
$ cennz-cli script:run [OPTIONS] contract-initantiate ACCOUND_ID CODE_HASH PATH_TO_ABI ENDOWMENT GAS_LIMIT

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase         if a passphrase is needed
  --noApi                  pass true if the script doesn't need to connect to the network
`);
}

async function main() {
  const accountId = argv[1];
  const codeHash = argv[2];
  const abiFile = argv[3];
  const endowment = argv[4] || 0;
  const gasLimit = argv[5] || 500000;
  if (!accountId || !codeHash || !abiFile) {
    console.error('one of ACCOUND_ID, CODE_HASH, PATH_TO_ABI, ENDOWMENT or GAS_LIMIT is missing');
    usage();
    process.exit(1);
  }
  const wallet = await loadWallet();
  api.setSigner(wallet);

  const accounts = await wallet.getAddresses();
  if (!accounts.includes(accountId)) {
    console.log(`account ${accountId} is not managed by wallet. pls check cennz-cli wallet`);
    process.exit(1);
  }

  const abi = new ContractAbi(JSON.parse(fs.readFileSync(abiFile, {encoding: 'utf-8'})));
  const tx = api.tx.contract.create((10**17).toString(), 500000, codeHash, abi.deploy())
  try {
    await tx.signAndSend(accountId, ({events, status}) => {
      for (const event of events) {
        if (event.event.method === 'Instantiated') {
          console.log('contract addr:', event.event.data[1].toString());
          process.exit(0);
        }
        if (event.event.method === 'ExtrinsicFailed') {
          console.log('ExtrinsicFail');
          process.exit(1);
        }
      }
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  await new Promise(() => null);
}

main()
