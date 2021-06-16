"use strict";
exports.__esModule = true;
exports.parseExpiredRfqOrderEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseExpiredRfqOrderEvent(eventLog) {
    var expiredRfqOrderEvent = new entities_1.ExpiredRfqOrderEvent();
    parse_event_1.parseEvent(eventLog, expiredRfqOrderEvent);
    var decodedLog = abiCoder.decodeLog(constants_1.EXPIRED_RFQ_ORDER_ABI.inputs, eventLog.data);
    expiredRfqOrderEvent.orderHash = decodedLog.orderHash.toLowerCase();
    expiredRfqOrderEvent.maker = decodedLog.maker.toLowerCase();
    expiredRfqOrderEvent.expiry = new utils_1.BigNumber(decodedLog.expiry);
    return expiredRfqOrderEvent;
}
exports.parseExpiredRfqOrderEvent = parseExpiredRfqOrderEvent;
