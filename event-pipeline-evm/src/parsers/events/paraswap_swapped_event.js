"use strict";
exports.__esModule = true;
exports.parseParaswapSwappedEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseParaswapSwappedEvent(eventLog) {
    var paraswapSwappedEvent = new entities_1.ParaswapSwappedEvent();
    parse_event_1.parseEvent(eventLog, paraswapSwappedEvent);
    var decodedLog = abiCoder.decodeLog(constants_1.PARASWAP_SWAPPED_ABI.inputs, eventLog.data, eventLog.topics.slice(1));
    paraswapSwappedEvent.from = decodedLog.initiator.toLowerCase();
    paraswapSwappedEvent.to = decodedLog.beneficiary.toLowerCase();
    paraswapSwappedEvent.fromToken = decodedLog.srcToken.toLowerCase();
    paraswapSwappedEvent.toToken = decodedLog.destToken.toLowerCase();
    paraswapSwappedEvent.fromTokenAmount = new utils_1.BigNumber(decodedLog.srcAmount);
    paraswapSwappedEvent.toTokenAmount = new utils_1.BigNumber(decodedLog.receivedAmount);
    paraswapSwappedEvent.expectedAmount = new utils_1.BigNumber(decodedLog.expectedAmount);
    paraswapSwappedEvent.referrer = decodedLog.referrer.toLowerCase();
    return paraswapSwappedEvent;
}
exports.parseParaswapSwappedEvent = parseParaswapSwappedEvent;
