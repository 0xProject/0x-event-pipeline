"use strict";
exports.__esModule = true;
exports.parseNativeFillFromV4RfqOrderFilledEvent = exports.parseV4RfqOrderFilledEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var entities_2 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parseV4RfqOrderFilledEvent(eventLog) {
    var rfqOrderFilledEvent = new entities_1.V4RfqOrderFilledEvent();
    parse_event_1.parseEvent(eventLog, rfqOrderFilledEvent);
    // decode the basic info directly into rfqOrderFilledEvent
    var decodedLog = abiCoder.decodeLog(constants_1.RFQ_ORDER_FILLED_ABI.inputs, eventLog.data);
    rfqOrderFilledEvent.orderHash = decodedLog.orderHash.toLowerCase();
    rfqOrderFilledEvent.maker = decodedLog.maker.toLowerCase();
    rfqOrderFilledEvent.taker = decodedLog.taker.toLowerCase();
    rfqOrderFilledEvent.makerToken = decodedLog.makerToken.toLowerCase();
    rfqOrderFilledEvent.takerToken = decodedLog.takerToken.toLowerCase();
    rfqOrderFilledEvent.takerTokenFilledAmount = new utils_1.BigNumber(decodedLog.takerTokenFilledAmount);
    rfqOrderFilledEvent.makerTokenFilledAmount = new utils_1.BigNumber(decodedLog.makerTokenFilledAmount);
    rfqOrderFilledEvent.pool = String(Number(decodedLog.pool));
    // TODO
    // rfqOrderFilledEvent.directFlag = true;
    // rfqOrderFilledEvent.directProtocol = 'PLP';
    return rfqOrderFilledEvent;
}
exports.parseV4RfqOrderFilledEvent = parseV4RfqOrderFilledEvent;
function parseNativeFillFromV4RfqOrderFilledEvent(eventLog) {
    var nativeFill = new entities_2.NativeFill();
    parse_event_1.parseEvent(eventLog, nativeFill);
    // decode the basic info directly into nativeFill
    var decodedLog = abiCoder.decodeLog(constants_1.RFQ_ORDER_FILLED_ABI.inputs, eventLog.data);
    nativeFill.orderHash = decodedLog.orderHash.toLowerCase();
    nativeFill.maker = decodedLog.maker.toLowerCase();
    nativeFill.taker = decodedLog.taker.toLowerCase();
    nativeFill.feeRecipient = null;
    nativeFill.makerToken = decodedLog.makerToken.toLowerCase();
    nativeFill.takerToken = decodedLog.takerToken.toLowerCase();
    nativeFill.takerTokenFilledAmount = new utils_1.BigNumber(decodedLog.takerTokenFilledAmount);
    nativeFill.makerTokenFilledAmount = new utils_1.BigNumber(decodedLog.makerTokenFilledAmount);
    nativeFill.takerFeePaid = null;
    nativeFill.makerFeePaid = null;
    nativeFill.takerProxyType = null;
    nativeFill.makerProxyType = null;
    nativeFill.takerFeeToken = null;
    nativeFill.makerFeeToken = null;
    nativeFill.protocolFeePaid = null;
    nativeFill.pool = String(Number(decodedLog.pool));
    nativeFill.nativeOrderType = 'RFQ Order';
    nativeFill.protocolVersion = 'v4';
    return nativeFill;
}
exports.parseNativeFillFromV4RfqOrderFilledEvent = parseNativeFillFromV4RfqOrderFilledEvent;
