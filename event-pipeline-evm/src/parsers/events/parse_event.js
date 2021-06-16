"use strict";
exports.__esModule = true;
exports.parseEvent = void 0;
function parseEvent(eventLog, eventEntity) {
    eventEntity.observedTimestamp = new Date().getTime();
    eventEntity.contractAddress = eventLog.address.toLowerCase();
    eventEntity.transactionHash = eventLog.transactionHash.toLowerCase();
    eventEntity.transactionIndex = eventLog.transactionIndex;
    eventEntity.logIndex = eventLog.logIndex;
    eventEntity.blockHash = eventLog.blockHash.toLowerCase();
    eventEntity.blockNumber = eventLog.blockNumber;
}
exports.parseEvent = parseEvent;
