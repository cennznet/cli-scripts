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

function usage() {
  console.log(`
USAGE
$ cennz-cli script:run --noApi contract-hashcode PATH_TO_WASM

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase         if a passphrase is needed
  --noApi                  pass true if the script doesn't need to connect to the network
`);
}

const wasmFile = argv[1];
if (!wasmFile) {
  console.error('PATH_TO_WASM is missing');
  usage();
  process.exit(1);
}
const contract_wasm = fs.readFileSync(wasmFile);
const code_hash = util.blake2AsU8a(contract_wasm);


console.log(`Contract hash code is ${util.u8aToHex(code_hash)}`);
