"use strict";
exports.__esModule = true;
exports.parseTransformedERC20Event = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseTransformedERC20Event(eventLog) {
    var transformedERC20Event = new entities_1.TransformedERC20Event();
    parse_event_1.parseEvent(eventLog, transformedERC20Event);
    var decodedLog = abiCoder.decodeLog(constants_1.TRANSFORMED_ERC20_ABI.inputs, eventLog.data, eventLog.topics[1]);
    transformedERC20Event.taker = decodedLog.taker.toLowerCase();
    transformedERC20Event.inputToken = decodedLog.inputToken.toLowerCase();
    transformedERC20Event.outputToken = decodedLog.outputToken.toLowerCase();
    transformedERC20Event.inputTokenAmount = new utils_1.BigNumber(decodedLog.inputTokenAmount);
    transformedERC20Event.outputTokenAmount = new utils_1.BigNumber(decodedLog.outputTokenAmount);
    return transformedERC20Event;
}
exports.parseTransformedERC20Event = parseTransformedERC20Event;
