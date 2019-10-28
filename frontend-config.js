/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// TODO (dliakakos): Need to change all of this
// import * as React from 'react';
// import * as UICore from '@da/ui-core';
import { DamlLfValue } from '@da/ui-core';

// ------------------------------------------------------------------------------------------------
// Schema version (all config files will need to export this name)
// ------------------------------------------------------------------------------------------------
export const version = {
  schema: 'navigator-config',
  major: 2,
  minor: 0,
};

function formatDateTime(timestamp) {
  return timestamp.substring(0, 10) + " " + timestamp.substring(11, 16);
}

function formatSatoshi(satoshiText) {
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  const satoshi = parseInt(satoshiText);
  return satoshi.toString().replace(regex, ",") + " Satoshi";
}

function formatPct(percent) { return (parseFloat(percent) * 100).toFixed(1).toString() + "%"; }

function createColumn(key, title, projection, width = 100, weight = 0, alignment = "left", sortable = true) {
  function createCell(data) {
    return { type: 'text', value: projection(DamlLfValue.toJSON(data.rowData.argument)) }
  }

  return {
        key: key,
        title: title,
        sortable: sortable,
        createCell, // Do not remove, needed by framework!
        width: width,
        weight: weight,
        alignment: alignment
  };
}

const operatorView = {
  type: 'table-view',
  title: "Operator",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Actors.Operator:OnboardEntityMaster@" } ], search: "", sort: [ { field: "argument.operator", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
  ]
};

const traderView = {
  type: 'table-view',
  title: "Trader",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Actors.Trader:TraderRole@" } ], search: "", sort: [ { field: "argument.trader", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.trader", "trader", x => x.trader.replace(/_/g, ' '), 100),
    createColumn("argument.deskHead", "deskHead", x => x.deskHead.replace(/_/g, ' '), 100),
    createColumn("argument.complianceOfficer", "complianceOfficer", x => x.complianceOfficer.replace(/_/g, ' '), 100),
    createColumn("argument.deskName", "deskName", x => x.deskName, 100),
  ]
};

const deskHeadView = {
  type: 'table-view',
  title: "Desk Head",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Actors.DeskHead:DeskHeadRole@" } ], search: "", sort: [ { field: "argument.deskHead", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.complianceOfficer", "complianceOfficer", x => x.complianceOfficer.replace(/_/g, ' '), 100),
    createColumn("argument.deskHead", "deskHead", x => x.deskHead.replace(/_/g, ' '), 100),
    createColumn("argument.deskName", "deskName", x => x.deskName, 100),
  ]
};

const desksView = {
  type: 'table-view',
  title: "Desks",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Desk.Desk:Desk@" } ], search: "", sort: [ { field: "argument.deskName", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.deskName", "Desk Name", x => x.deskName.replace(/_/g, ' '), 100),
    createColumn("argument.deskHead", "Desk Head", x => x.deskHead.replace(/_/g, ' '), 100),
    createColumn("argument.traders", "Traders", x => x.traders.join(", "), 100),
  ]
};

const complianceOfficerView = {
  type: 'table-view',
  title: "Compliance Officer",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Actors.Compliance:ComplianceRole@" } ], search: "", sort: [ { field: "argument.complianceOfficer", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.complianceOfficer", "complianceOfficer", x => x.complianceOfficer.replace(/_/g, ' '), 100),
  ]
};

const signingPartyView = {
  type: 'table-view',
  title: "Signing Party",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Actors.SigningParty:SigningPartyRole@" } ], search: "", sort: [ { field: "argument.complianceOfficer", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.signingParty", "signingParty", x => x.signingParty.replace(/_/g, ' '), 100),
  ]
};

const ownedAddressesView = {
  type: 'table-view',
  title: "Wallet",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Address:OwnedAddress@" } ], search: "", sort: [ { field: "argument.balance", direction: "DESCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.signingParty", "Signing Party", x => x.signingParty.replace(/_/g, ' '), 100),
    createColumn("argument.balance", "Balance", x => formatSatoshi(x.balance.unpack), 100),
    createColumn("argument.numTxs", "Number of Txs", x => x.numTxs, 100),
    createColumn("argument.address", "BTC Address", x => x.address.unpack, 100)
  ]
};

const utxosView = {
  type: 'table-view',
  title: "UTXOs",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Transfer:UTXO@" } ], search: "", sort: [ { field: "argument.utxoData.blockHeight", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 20),
    createColumn("argument.utxoData.blockHeight", "Block Height", x => x.utxoData.blockHeight, 40),
    createColumn("argument.utxoData.txHash", "Tx Hash", x => x.utxoData.txHash.unpack, 220),
    createColumn("argument.utxoData.confirmed", "Confirmed", x => formatDateTime(x.utxoData.confirmed), 50),
    createColumn("argument.utxoData.outputIdx", "Output Idx", x => x.utxoData.outputIdx, 20),
    createColumn("argument.utxoData.sigScript", "Script", x => x.utxoData.sigScript.unpack, 220),
    createColumn("argument.utxoData.address", "BTC Address", x => x.utxoData.address.unpack, 220),
    createColumn("argument.utxoData.value", "Value", x => formatSatoshi(x.utxoData.value.unpack), 60),
  ]
};

const addressesView = {
  type: 'table-view',
  title: "Destination Addresses",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Address:DestinationAddress@" } ], search: "", sort: [ { field: "argument.address", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.address", "BTC Address", x => x.address.unpack, 100),
    createColumn("argument.reputation", "Reputation", x => x.reputation, 100)
  ]
};

const limitsView = {
  type: 'table-view',
  title: "Transfer Limits",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Desk.Limit:TransferLimit@" } ], search: "", sort: [ { field: "argument.deskName", direction: "ASCENDING" } ] },
  columns: [
    createColumn("argument.operator", "Operator", x => x.operator.replace(/_/g, ' '), 100),
    createColumn("argument.deskHead", "Desk Head", x => x.deskHead.replace(/_/g, ' '), 100),
    createColumn("argument.deskName", "Desk Name", x => x.deskName, 100),
    createColumn("argument.dayLimit", "Limit", x => formatSatoshi(x.dayLimit.unpack), 100),
    createColumn("argument.used", "% Used", x => formatPct(parseFloat(x.used.unpack) / parseFloat(x.dayLimit.unpack)), 100),
  ]
};

const transferColumns = [
  createColumn("argument.operator", "Operator", x => x.transferDetails.operator.replace(/_/g, ' '), 100),
  createColumn("argument.complianceOfficer", "Compliance", x => x.transferDetails.complianceOfficer.replace(/_/g, ' '), 100),
  createColumn("argument.deskHead", "Desk Head", x => x.transferDetails.deskHead.replace(/_/g, ' '), 100),
  createColumn("argument.trader", "Trader", x => x.transferDetails.trader.replace(/_/g, ' '), 100),
  createColumn("argument.amount", "Amount", x => formatSatoshi(x.transferDetails.amount.unpack), 100),
  createColumn("argument.rawTx", "Raw Tx", x => x.rawTx.unpack, 100),
];

const signedTransfersView = {
  type: 'table-view',
  title: "Signed Transfers",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Transfer:SignedTransfer@" } ], search: "", sort: [ { field: "argument.trader", direction: "ASCENDING" } ] },
  columns: transferColumns
};

const transmittedTransfersView = {
  type: 'table-view',
  title: "Transmitted Transfers",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Transfer:TransmittedTransfer@" } ], search: "", sort: [ { field: "argument.trader", direction: "ASCENDING" } ] },
  columns: transferColumns
};

const failedTransfersView = {
  type: 'table-view',
  title: "Failed Transfers",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Transfer:FailedTransfer@" } ], search: "", sort: [ { field: "argument.trader", direction: "ASCENDING" } ] },
  columns: transferColumns
};

const notificationView = {
  type: 'table-view',
  title: "Notifications",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Notification:Notification@" } ], search: "", sort: [ { field: "argument.timeStamp", direction: "DESCENDING" } ] },
  columns: [
    createColumn("argument.sender", "Sender", x => x.sender.replace(/_/g, ' '), 100),
    createColumn("argument.text", "Info", x => x.text, 100),
    createColumn("argument.timeStamp", "Received", x => formatDateTime(x.timeStamp), 100),
  ]
};

const transferRequestColumns = [
  createColumn("argument.operator", "Operator", x => x.transferDetails.operator.replace(/_/g, ' '), 100),
  createColumn("argument.complianceOfficer", "Compliance Officer", x => x.transferDetails.complianceOfficer.replace(/_/g, ' '), 100),
  createColumn("argument.deskHead", "Desk Head", x => x.transferDetails.deskHead.replace(/_/g, ' '), 100),
  createColumn("argument.trader", "Trader", x => x.transferDetails.trader.replace(/_/g, ' '), 100),
  createColumn("argument.deskName", "Desk", x => x.transferDetails.deskName, 100),
  createColumn("argument.amount", "Transfer Amount", x => formatSatoshi(x.transferDetails.amount.unpack), 100),
  createColumn("argument.address", "To Address", x => x.transferDetails.address.unpack, 100),
];

const failedLimitCheckTransferRequestsView = {
  type: 'table-view',
  title: "Requests Over Limit",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Request:FailedLimitsCheckTransferRequest@" } ], search: "", sort: [ { field: "argument.trader", direction: "ASCENDING" } ] },
  columns: transferRequestColumns
};

const failedAddressCheckTransferRequestsView = {
  type: 'table-view',
  title: "Requests to Bad Addresses",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Request:FailedAddressCheckTransferRequest@" } ], search: "", sort: [ { field: "argument.trader", direction: "ASCENDING" } ] },
  columns: transferRequestColumns
};

const requestsWaitingForApprovalView = {
  type: 'table-view',
  title: "Requests for Approval",
  source: { type: 'contracts', filter: [ { field: "template.id", value: "Transfer.Request:Failed" } ], search: "", sort: [ { field: "argument.trader", direction: "ASCENDING" } ] },
  columns: transferRequestColumns
};

export const customViews = (userId, party, role) => {
  switch (party) {
    case "Operator":
      return {
        operator: operatorView,
        utxos: utxosView,
        notification: notificationView
      };
    case "ComplianceOfficer":
      return {
        complianceOfficer: complianceOfficerView,
        failedTransferRequests: failedAddressCheckTransferRequestsView,
        addresses: addressesView,
        notification: notificationView
      };
    case "Trader1":
    case "Trader2":
      return {
        trader: traderView,
        addresses: addressesView,
        signedTransfers: signedTransfersView,
        transmittedTransfers: transmittedTransfersView,
        failedTransfers: failedTransfersView,
        waitingForApproval: requestsWaitingForApprovalView,
        notification: notificationView,
      };
    case "DeskHead":
      return {
        deskHead: deskHeadView,
        desks: desksView,
        failedTransferRequests: failedLimitCheckTransferRequestsView,
        limits: limitsView,
        notification: notificationView
      };
    case "SigningParty":
      return {
        signingParty: signingPartyView,
        notification: notificationView,
        ownedAddresses: ownedAddressesView,
      };
    default:
      return {};
  }
};
