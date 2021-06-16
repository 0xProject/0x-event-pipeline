"use strict";
exports.__esModule = true;
exports.parseV4CancelEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
function parseV4CancelEvent(eventLog) {
    var v4CancelEvent = new entities_1.V4CancelEvent();
    parse_event_1.parseEvent(eventLog, v4CancelEvent);
    var decodedLog = abiCoder.decodeLog(constants_1.V4_CANCEL_ABI.inputs, eventLog.data);
    v4CancelEvent.orderHash = decodedLog.orderHash.toLowerCase();
    v4CancelEvent.maker = decodedLog.maker.toLowerCase();
    return v4CancelEvent;
}
exports.parseV4CancelEvent = parseV4CancelEvent;
