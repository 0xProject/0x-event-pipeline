"use strict";
exports.__esModule = true;
exports.parseNativeFillFromV4LimitOrderFilledEvent = exports.parseV4LimitOrderFilledEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var entities_2 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseV4LimitOrderFilledEvent(eventLog) {
    var limitOrderFilledEvent = new entities_1.V4LimitOrderFilledEvent();
    parse_event_1.parseEvent(eventLog, limitOrderFilledEvent);
    // decode the basic info directly into limitOrderFilledEvent
    var decodedLog = abiCoder.decodeLog(constants_1.LIMIT_ORDER_FILLED_ABI.inputs, eventLog.data);
    limitOrderFilledEvent.orderHash = decodedLog.orderHash.toLowerCase();
    limitOrderFilledEvent.maker = decodedLog.maker.toLowerCase();
    limitOrderFilledEvent.taker = decodedLog.taker.toLowerCase();
    limitOrderFilledEvent.feeRecipient = decodedLog.feeRecipient.toLowerCase();
    limitOrderFilledEvent.makerToken = decodedLog.makerToken.toLowerCase();
    limitOrderFilledEvent.takerToken = decodedLog.takerToken.toLowerCase();
    limitOrderFilledEvent.takerTokenFilledAmount = new utils_1.BigNumber(decodedLog.takerTokenFilledAmount);
    limitOrderFilledEvent.makerTokenFilledAmount = new utils_1.BigNumber(decodedLog.makerTokenFilledAmount);
    limitOrderFilledEvent.takerTokenFeeFilledAmount = new utils_1.BigNumber(decodedLog.takerTokenFeeFilledAmount);
    limitOrderFilledEvent.protocolFeePaid = new utils_1.BigNumber(decodedLog.protocolFeePaid);
    limitOrderFilledEvent.pool = String(Number(decodedLog.pool));
    return limitOrderFilledEvent;
}
exports.parseV4LimitOrderFilledEvent = parseV4LimitOrderFilledEvent;
function parseNativeFillFromV4LimitOrderFilledEvent(eventLog) {
    var nativeFill = new entities_2.NativeFill();
    parse_event_1.parseEvent(eventLog, nativeFill);
    // decode the basic info directly into nativeFill
    var decodedLog = abiCoder.decodeLog(constants_1.LIMIT_ORDER_FILLED_ABI.inputs, eventLog.data);
    nativeFill.orderHash = decodedLog.orderHash.toLowerCase();
    nativeFill.maker = decodedLog.maker.toLowerCase();
    nativeFill.taker = decodedLog.taker.toLowerCase();
    nativeFill.feeRecipient = decodedLog.feeRecipient.toLowerCase();
    nativeFill.makerToken = decodedLog.makerToken.toLowerCase();
    nativeFill.takerToken = decodedLog.takerToken.toLowerCase();
    nativeFill.takerTokenFilledAmount = new utils_1.BigNumber(decodedLog.takerTokenFilledAmount);
    nativeFill.makerTokenFilledAmount = new utils_1.BigNumber(decodedLog.makerTokenFilledAmount);
    nativeFill.takerFeePaid = new utils_1.BigNumber(decodedLog.takerTokenFeeFilledAmount);
    nativeFill.makerFeePaid = null;
    nativeFill.takerProxyType = null;
    nativeFill.makerProxyType = null;
    nativeFill.takerFeeToken = decodedLog.takerToken.toLowerCase();
    nativeFill.makerFeeToken = null;
    nativeFill.protocolFeePaid = new utils_1.BigNumber(decodedLog.protocolFeePaid);
    nativeFill.pool = String(Number(decodedLog.pool));
    nativeFill.nativeOrderType = 'Limit Order';
    nativeFill.protocolVersion = 'v4';
    return nativeFill;
}
exports.parseNativeFillFromV4LimitOrderFilledEvent = parseNativeFillFromV4LimitOrderFilledEvent;
