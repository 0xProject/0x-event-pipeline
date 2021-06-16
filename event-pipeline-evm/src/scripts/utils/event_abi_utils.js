"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PullAndSaveEventsByTopic = void 0;
var utils_1 = require("@0x/utils");
var config_1 = require("../../config");
var entities_1 = require("../../entities");
var Web3Utils = require('web3-utils');
var PullAndSaveEventsByTopic = /** @class */ (function () {
    function PullAndSaveEventsByTopic() {
    }
    PullAndSaveEventsByTopic.prototype.getParseSaveEventsByTopic = function (connection, web3Source, latestBlockWithOffset, eventName, tableName, topics, contractAddress, startSearchBlock, parser, deleteOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var startBlock, endBlock, logPullInfo, rawLogsArray;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getStartBlockAsync(eventName, connection, latestBlockWithOffset, startSearchBlock)];
                    case 1:
                        startBlock = _a.sent();
                        endBlock = Math.min(latestBlockWithOffset, startBlock + (config_1.MAX_BLOCKS_TO_SEARCH - 1));
                        utils_1.logUtils.log("Searching for " + eventName + " between blocks " + startBlock + " and " + endBlock);
                        logPullInfo = {
                            address: contractAddress,
                            fromBlock: startBlock,
                            toBlock: endBlock,
                            topics: topics
                        };
                        return [4 /*yield*/, web3Source.getBatchLogInfoForContractsAsync([logPullInfo])];
                    case 2:
                        rawLogsArray = _a.sent();
                        return [4 /*yield*/, Promise.all(rawLogsArray.map(function (rawLogs) { return __awaiter(_this, void 0, void 0, function () {
                                var parsedLogs, contractCallToken0Array, contractCallToken1Array, contractCallProtocolNameArray, index, contractCallToken0, contractCallToken1, contractCallProtocolName, token0, token1, protocolName, i, token0_i, token1_i, protocolName_i, _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            parsedLogs = rawLogs.logs.map(function (encodedLog) { return parser(encodedLog); });
                                            if (!(eventName === 'VIPSwapEvent' && parsedLogs.length > 0)) return [3 /*break*/, 4];
                                            contractCallToken0Array = [];
                                            contractCallToken1Array = [];
                                            contractCallProtocolNameArray = [];
                                            for (index in parsedLogs) {
                                                contractCallToken0 = {
                                                    to: parsedLogs[index].contractAddress,
                                                    data: '0x0dfe1681'
                                                };
                                                contractCallToken0Array.push(contractCallToken0);
                                                contractCallToken1 = {
                                                    to: parsedLogs[index].contractAddress,
                                                    data: '0xd21220a7'
                                                };
                                                contractCallToken1Array.push(contractCallToken1);
                                                contractCallProtocolName = {
                                                    to: parsedLogs[index].contractAddress,
                                                    data: '0x06fdde03'
                                                };
                                                contractCallProtocolNameArray.push(contractCallProtocolName);
                                            }
                                            return [4 /*yield*/, web3Source.callContractMethodsAsync(contractCallToken0Array)];
                                        case 1:
                                            token0 = _c.sent();
                                            return [4 /*yield*/, web3Source.callContractMethodsAsync(contractCallToken1Array)];
                                        case 2:
                                            token1 = _c.sent();
                                            return [4 /*yield*/, web3Source.callContractMethodsAsync(contractCallProtocolNameArray)];
                                        case 3:
                                            protocolName = _c.sent();
                                            for (i = 0; i < parsedLogs.length; i++) {
                                                token0_i = '0x' + token0[i].slice(2).slice(token0[i].length == 66 ? 64 - 40 : 0);
                                                token1_i = '0x' + token1[i].slice(2).slice(token1[i].length == 66 ? 64 - 40 : 0);
                                                parsedLogs[i].fromToken = parsedLogs[i].fromToken === '0' ? token0_i : token1_i;
                                                parsedLogs[i].toToken = parsedLogs[i].toToken === '0' ? token0_i : token1_i;
                                                protocolName_i = Web3Utils.hexToUtf8('0x' + protocolName[i].slice(98))
                                                    .split('LP')[0]
                                                    .split(' ')[0]
                                                    .slice(1);
                                                parsedLogs[i].from = protocolName_i.includes('Swap') ? protocolName_i : protocolName_i + 'Swap';
                                                parsedLogs[i].directProtocol = protocolName_i.includes('Swap')
                                                    ? protocolName_i
                                                    : protocolName_i + 'Swap';
                                            }
                                            _c.label = 4;
                                        case 4:
                                            utils_1.logUtils.log("Saving " + parsedLogs.length + " " + eventName + " events");
                                            _a = this._deleteOverlapAndSaveAsync;
                                            _b = [connection,
                                                parsedLogs,
                                                startBlock,
                                                endBlock,
                                                tableName];
                                            return [4 /*yield*/, this._lastBlockProcessedAsync(eventName, endBlock)];
                                        case 5: return [4 /*yield*/, _a.apply(this, _b.concat([_c.sent(), deleteOptions]))];
                                        case 6:
                                            _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PullAndSaveEventsByTopic.prototype._lastBlockProcessedAsync = function (eventName, endBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var lastBlockProcessed;
            return __generator(this, function (_a) {
                lastBlockProcessed = new entities_1.LastBlockProcessed();
                lastBlockProcessed.eventName = eventName;
                lastBlockProcessed.lastProcessedBlockNumber = endBlock;
                lastBlockProcessed.processedTimestamp = new Date().getTime();
                return [2 /*return*/, lastBlockProcessed];
            });
        });
    };
    PullAndSaveEventsByTopic.prototype._getStartBlockAsync = function (eventName, connection, latestBlockWithOffset, defaultStartBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, lastKnownBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection.query("SELECT last_processed_block_number FROM " + config_1.SCHEMA + ".last_block_processed WHERE event_name = '" + eventName + "'")];
                    case 1:
                        queryResult = _a.sent();
                        lastKnownBlock = queryResult[0] || { last_processed_block_number: defaultStartBlock };
                        return [2 /*return*/, Math.min(Number(lastKnownBlock.last_processed_block_number) + 1, latestBlockWithOffset - config_1.START_BLOCK_OFFSET)];
                }
            });
        });
    };
    PullAndSaveEventsByTopic.prototype._deleteOverlapAndSaveAsync = function (connection, toSave, startBlock, endBlock, tableName, lastBlockProcessed, deleteOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, deleteQuery, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = connection.createQueryRunner();
                        if (deleteOptions.isDirectTrade && deleteOptions.directProtocol != undefined) {
                            deleteQuery = "DELETE FROM " + config_1.SCHEMA + "." + tableName + " WHERE block_number >= " + startBlock + " AND block_number <= " + endBlock + " AND direct_protocol IN ('" + deleteOptions.directProtocol.join("','") + "')";
                        }
                        else {
                            if (tableName === 'native_fills' && deleteOptions.protocolVersion != undefined) {
                                if (deleteOptions.protocolVersion === 'v4' && deleteOptions.nativeOrderType != undefined) {
                                    deleteQuery = "DELETE FROM " + config_1.SCHEMA + "." + tableName + " WHERE block_number >= " + startBlock + " AND block_number <= " + endBlock + " AND protocol_version = '" + deleteOptions.protocolVersion + "' AND native_order_type = '" + deleteOptions.nativeOrderType + "' ";
                                }
                                else {
                                    deleteQuery = "DELETE FROM " + config_1.SCHEMA + "." + tableName + " WHERE block_number >= " + startBlock + " AND block_number <= " + endBlock + " AND protocol_version = '" + deleteOptions.protocolVersion + "'";
                                }
                            }
                            else {
                                deleteQuery = "DELETE FROM " + config_1.SCHEMA + "." + tableName + " WHERE block_number >= " + startBlock + " AND block_number <= " + endBlock;
                            }
                        }
                        return [4 /*yield*/, queryRunner.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, 10, 12]);
                        // delete events scraped prior to the most recent block range
                        return [4 /*yield*/, queryRunner.manager.query(deleteQuery)];
                    case 4:
                        // delete events scraped prior to the most recent block range
                        _a.sent();
                        return [4 /*yield*/, queryRunner.manager.save(toSave)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.manager.save(lastBlockProcessed)];
                    case 6:
                        _a.sent();
                        // commit transaction now:
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 7:
                        // commit transaction now:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        err_1 = _a.sent();
                        utils_1.logUtils.log(err_1);
                        // since we have errors lets rollback changes we made
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 9:
                        // since we have errors lets rollback changes we made
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 10: 
                    // you need to release query runner which is manually created:
                    return [4 /*yield*/, queryRunner.release()];
                    case 11:
                        // you need to release query runner which is manually created:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return PullAndSaveEventsByTopic;
}());
exports.PullAndSaveEventsByTopic = PullAndSaveEventsByTopic;
