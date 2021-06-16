"use strict";
exports.__esModule = true;
exports.parseLiquidityProviderSwapEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseLiquidityProviderSwapEvent(eventLog) {
    var eRC20BridgeTransferEvent = new entities_1.ERC20BridgeTransferEvent();
    parse_event_1.parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    var decodedLog = abiCoder.decodeLog(constants_1.LIQUIDITY_PROVIDER_SWAP_ABI.inputs, eventLog.data);
    eRC20BridgeTransferEvent.fromToken = decodedLog.inputToken.toLowerCase();
    eRC20BridgeTransferEvent.toToken = decodedLog.outputToken.toLowerCase();
    eRC20BridgeTransferEvent.fromTokenAmount = new utils_1.BigNumber(decodedLog.inputTokenAmount);
    eRC20BridgeTransferEvent.toTokenAmount = new utils_1.BigNumber(decodedLog.outputTokenAmount);
    eRC20BridgeTransferEvent.from = decodedLog.provider.toLowerCase();
    eRC20BridgeTransferEvent.to = decodedLog.recipient.toLowerCase();
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = 'PLP';
    return eRC20BridgeTransferEvent;
}
exports.parseLiquidityProviderSwapEvent = parseLiquidityProviderSwapEvent;
