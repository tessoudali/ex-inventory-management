#!/usr/bin/env bash
#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#


_BTCUtilities="scripts/btc-utilities.sh"
if [ -f "$_BTCUtilities" ]; then
  . "$_BTCUtilities"
else
  echo "$_BTCUtilities": No such file
  exit 1
fi

bitcoin stop | grep -v '{"result":"Bitcoin server stopping","error":null,"id":"curltext"}'

