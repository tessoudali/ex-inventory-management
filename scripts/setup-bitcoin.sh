#!/usr/bin/env bash
#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#


import_private_keys() {
  while read -r line; do
    importprivkey "$line"
  done
}

generate_utxos() {
  generatetoaddress 100 "mmgZZMGKRAM9C8ySTnwrWaGwYwgdidEhWe"
  # Make all generated UTXOs mature by generating to a random address.
  local randomAddress
  randomAddress="$(getnewaddress)"
  generatetoaddress 100 "$randomAddress"
}

wait_for_bitcoin_network() {
  until nc -z "$1" "$2"; do
    echo "Waiting for bitcoind..."
    sleep 1
  done
  echo "bitcoind started."
  while ! bitcoin "getbalance" 2>/dev/null 1>/dev/null
  do
    echo "Waiting for bitcoin network to load data..."
    sleep 1
  done
  echo "Bitcoin network is ready to use."
}

_BTCUtilities="scripts/btc-utilities.sh"
if [ -f "$_BTCUtilities" ]; then
  . "$_BTCUtilities"
else
  echo "$_BTCUtilities": No such file
  exit 1
fi

echo "Using bitcoin access point $BitcoinHost:$BitcoinPort"
wait_for_bitcoin_network "$BitcoinHost" "$BitcoinPort"
echo "Importing keys..."
import_private_keys <"./$Resources/secretKeyStore.regtest.txt"
echo "Generating UTXOs..."
generate_utxos
echo "Done"
