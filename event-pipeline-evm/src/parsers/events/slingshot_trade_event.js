"use strict";
exports.__esModule = true;
exports.parseSlingshotTradeEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseSlingshotTradeEvent(eventLog) {
    var slingshotTradeEvent = new entities_1.SlingshotTradeEvent();
    parse_event_1.parseEvent(eventLog, slingshotTradeEvent);
    var decodedLog = abiCoder.decodeLog(constants_1.SLINGSHOT_TRADE_ABI.inputs, eventLog.data, eventLog.topics[1]);
    slingshotTradeEvent.from = decodedLog.user.toLowerCase();
    slingshotTradeEvent.to = decodedLog.recipient.toLowerCase();
    slingshotTradeEvent.fromToken = decodedLog.fromToken.toLowerCase();
    slingshotTradeEvent.toToken = decodedLog.toToken.toLowerCase();
    slingshotTradeEvent.fromTokenAmount = new utils_1.BigNumber(decodedLog.fromAmount);
    slingshotTradeEvent.toTokenAmount = new utils_1.BigNumber(decodedLog.toAmount);
    return slingshotTradeEvent;
}
exports.parseSlingshotTradeEvent = parseSlingshotTradeEvent;
