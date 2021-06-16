"use strict";
exports.__esModule = true;
exports.parsePancakeSwapEvent = void 0;
var abiCoder = require('web3-eth-abi');
var entities_1 = require("../../entities");
var parse_event_1 = require("./parse_event");
var constants_1 = require("../../constants");
var utils_1 = require("@0x/utils");
function parsePancakeSwapEvent(eventLog) {
    var eRC20BridgeTransferEvent = new entities_1.ERC20BridgeTransferEvent();
    parse_event_1.parseEvent(eventLog, eRC20BridgeTransferEvent);
    // decode the basic info directly into eRC20BridgeTransferEvent
    var decodedLog = abiCoder.decodeLog(constants_1.SWAP_ABI.inputs, eventLog.data, [eventLog.topics[1], eventLog.topics[2]]);
    var amount0In = new utils_1.BigNumber(decodedLog.amount0In);
    var amount1In = new utils_1.BigNumber(decodedLog.amount1In);
    var amount0Out = new utils_1.BigNumber(decodedLog.amount0Out);
    var amount1Out = new utils_1.BigNumber(decodedLog.amount1Out);
    eRC20BridgeTransferEvent.fromToken = amount0In.gt(amount0Out) ? '0' : '1'; // taker_token
    eRC20BridgeTransferEvent.toToken = amount0In.gt(amount0Out) ? '1' : '0'; // maker_token
    eRC20BridgeTransferEvent.fromTokenAmount = new utils_1.BigNumber(amount0In.gt(amount0Out)
        ? decodedLog.amount0In - decodedLog.amount0Out
        : decodedLog.amount1In - decodedLog.amount1Out); // taker_token_amount
    eRC20BridgeTransferEvent.toTokenAmount = new utils_1.BigNumber(amount0In.gt(amount0Out)
        ? decodedLog.amount1Out - decodedLog.amount1In
        : decodedLog.amount0Out - decodedLog.amount0In); // maker_token_amount
    eRC20BridgeTransferEvent.from = ''; // maker
    eRC20BridgeTransferEvent.to = decodedLog.to.toLowerCase(); // taker
    eRC20BridgeTransferEvent.directFlag = true;
    eRC20BridgeTransferEvent.directProtocol = '';
    return eRC20BridgeTransferEvent;
}
exports.parsePancakeSwapEvent = parsePancakeSwapEvent;
