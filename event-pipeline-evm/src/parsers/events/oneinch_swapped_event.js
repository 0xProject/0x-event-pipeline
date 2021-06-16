"use strict";
exports.__esModule = true;
exports.parseOneinchSwappedEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseOneinchSwappedEvent(eventLog) {
    var oneinchSwappedEvent = new entities_1.OneinchSwappedEvent();
    parse_event_1.parseEvent(eventLog, oneinchSwappedEvent);
    var decodedLog = abiCoder.decodeLog(constants_1.ONEINCH_SWAPPED_ABI.inputs, eventLog.data, []);
    oneinchSwappedEvent.from = decodedLog.sender.toLowerCase();
    oneinchSwappedEvent.to = decodedLog.dstReceiver.toLowerCase();
    oneinchSwappedEvent.fromToken = decodedLog.srcToken.toLowerCase();
    oneinchSwappedEvent.toToken = decodedLog.dstToken.toLowerCase();
    oneinchSwappedEvent.fromTokenAmount = new utils_1.BigNumber(decodedLog.spentAmount);
    oneinchSwappedEvent.toTokenAmount = new utils_1.BigNumber(decodedLog.returnAmount);
    return oneinchSwappedEvent;
}
exports.parseOneinchSwappedEvent = parseOneinchSwappedEvent;
