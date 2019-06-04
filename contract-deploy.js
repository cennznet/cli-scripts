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
$ cennz-cli script:run [OPTIONS] contract-deploy PATH_TO_WASM ACCOUNT

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase         if a passphrase is needed
  --noApi                  pass true if the script doesn't need to connect to the network
`);
}

async function main() {
  const wasmPath = argv[1];
  const accountId = argv[2];
  if (!wasmPath || !accountId) {
    console.error('one of PATH_TO_WASM and ACCOUNT is missing');
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
  const wasm = util.compactAddLength(fs.readFileSync(wasmPath))

  const tx = api.tx.contract.putCode(500000, wasm)
  let codeHash;
  try {
    await tx.signAndSend(accountId, ({events, status}) => {
      let exit;
      for (const event of events) {
        if (event.event.method === 'ExtrinsicSuccess') {
          console.log('ExtrinsicSuccess');
          exit = true;
        }
        if (event.event.method === 'CodeStored') {
          codeHash = event.event.data[0];
          console.log('contract code hash:', event.event.data[0].toString());
          exit = true;
        }
        if (event.event.method === 'ExtrinsicFailed') {
          console.log('ExtrinsicFail');
          process.exit(1);
        }
      }
      if (exit) process.exit(0);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  await new Promise(() => null);
}

main()
