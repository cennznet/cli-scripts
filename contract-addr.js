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
$ cennz-cli script:run [OPTIONS] contract-addr OWNER_ACCOUNT CODE_HASH PATH_TO_ABI

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
  if (!accountId || !codeHash || !abiFile) {
    console.error('one of OWNER_ACCOUNT, CODE_HASH, PATH_TO_ABI, ENDOWMENT or GAS_LIMIT is missing');
    usage();
    process.exit(1);
  }

  const account = new AccountId(accountId);


  const abi = new ContractAbi(JSON.parse(fs.readFileSync(abiFile, {encoding: 'utf-8'})));
  const [,data] = util.compactStripLength(abi.deploy());
  const addr = util.blake2AsHex(util.u8aConcat(util.hexToU8a(codeHash), util.blake2AsU8a(data), account.toU8a()));
  console.log(new AccountId(addr).toString());
}

main()
