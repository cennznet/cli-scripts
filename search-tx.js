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
$ cennz-cli script:run [OPTIONS] search-tx TX_HASH

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase         if a passphrase is needed
  --noApi                  pass true if the script doesn't need to connect to the network
`);
}

const rpc = api.rpc;

const loop = async (txHash, n, ...blockHash) => {
  const block = await rpc.chain.getBlock(...blockHash)
  if (n % 100 === 0) {
    console.log('\nCheck block: ', block.block.header.blockNumber.toString(), block.block.hash.toString())
  }
  process.stdout.write('.')
  for (const tx of block.block.extrinsics) {
    if (tx.hash.toString() === txHash) {
      console.log('\nFound extrinsic in block', block.block.hash.toString())
      console.log(block.block.header.toJSON())
      console.log(tx.method.meta.name.toString(), tx.method.toJSON())
      console.log('Raw data: \n', tx.toJSON())
      return
    }
  }
  await loop(txHash, n + 1, block.block.header.parentHash.toString())
};

const main = async (txHash) => {
  console.log('Start searching for extrinsic hash:', txHash)
  await loop(txHash, 0)
};

const txHash = argv[1];
if (!txHash) {
  console.log('Missing extrinsic hash');
  usage();
  process.exit(1);
}

main(txHash);
