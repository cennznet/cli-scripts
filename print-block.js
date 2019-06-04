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
$ cennz-cli script:run [OPTIONS] print-block BLOCK_NUMBER

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase         if a passphrase is needed
  --noApi                  pass true if the script doesn't need to connect to the network
`);
}

const rpc = api.rpc

const main = async (blockNo) => {
  let getBlockArgs = [];
  if (blockNo) {
    if (blockNo.startsWith('0x')) {
      getBlockArgs = [blockNo]
    } else {
      getBlockArgs = [await rpc.chain.getBlockHash(+blockNo)]
    }
  }
  const block = await rpc.chain.getBlock(...getBlockArgs)
  console.log('block hash: ', block.block.hash.toString())
  console.log(block.toJSON())
  console.log('\nextrinsics details\n')
  for (const tx of block.block.extrinsics) {
    console.log(tx.hash.toString(), ':', tx.method.meta.name.toString(), tx.signature.signer.toString(), tx.method.toJSON())
  }
}

const blockNo = argv[1];
if (!blockNo) {
  console.error('BLOCK_NUMBER is missing');
  usage();
  process.exit(1);
}
main(blockNo);
