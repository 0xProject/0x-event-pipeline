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
exports.EventsByTopicScraper = void 0;
var dev_utils_1 = require("@0x/dev-utils");
var utils_1 = require("@0x/utils");
var pipeline_utils_1 = require("@0x/pipeline-utils");
var shared_utils_1 = require("./utils/shared_utils");
var config_1 = require("../config");
var constants_1 = require("../constants");
var transformed_erc20_events_1 = require("../parsers/events/transformed_erc20_events");
var oneinch_swapped_event_1 = require("../parsers/events/oneinch_swapped_event");
var paraswap_swapped_event_1 = require("../parsers/events/paraswap_swapped_event");
var slingshot_trade_event_1 = require("../parsers/events/slingshot_trade_event");
var swap_events_1 = require("../parsers/events/swap_events");
var event_abi_utils_1 = require("./utils/event_abi_utils");
var provider = dev_utils_1.web3Factory.getRpcProvider({
    rpcUrl: config_1.ETHEREUM_RPC_URL
});
var web3Source = new pipeline_utils_1.Web3Source(provider, config_1.ETHEREUM_RPC_URL);
var pullAndSaveEventsByTopic = new event_abi_utils_1.PullAndSaveEventsByTopic();
var EventsByTopicScraper = /** @class */ (function () {
    function EventsByTopicScraper() {
    }
    EventsByTopicScraper.prototype.getParseSaveEventsAsync = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, latestBlockWithOffset, promises, endTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = new Date().getTime();
                        utils_1.logUtils.log("pulling events");
                        return [4 /*yield*/, shared_utils_1.calculateEndBlockAsync(web3Source)];
                    case 1:
                        latestBlockWithOffset = _a.sent();
                        utils_1.logUtils.log("latest block with offset: " + latestBlockWithOffset);
                        promises = [];
                        if (config_1.FEAT_TRANSFORMED_ERC20_EVENT) {
                            promises.push(pullAndSaveEventsByTopic.getParseSaveEventsByTopic(connection, web3Source, latestBlockWithOffset, 'TransformedERC20Event', 'transformed_erc20_events', constants_1.TRANSFORMEDERC20_EVENT_TOPIC, constants_1.EXCHANGE_PROXY_ADDRESS, config_1.EP_DEPLOYMENT_BLOCK, transformed_erc20_events_1.parseTransformedERC20Event, {}));
                        }
                        if (config_1.FEAT_ONEINCH_SWAPPED_EVENT) {
                            promises.push(pullAndSaveEventsByTopic.getParseSaveEventsByTopic(connection, web3Source, latestBlockWithOffset, 'OneinchSwappedEvent', 'oneinch_swapped_events', constants_1.ONEINCH_SWAPPED_EVENT_TOPIC, constants_1.ONEINCH_ROUTER_V3_CONTRACT_ADDRESS, config_1.ONEINCH_ROUTER_V3_DEPLOYMENT_BLOCK, oneinch_swapped_event_1.parseOneinchSwappedEvent, {}));
                        }
                        if (config_1.FEAT_VIP_SWAP_EVENT) {
                            promises.push(pullAndSaveEventsByTopic.getParseSaveEventsByTopic(connection, web3Source, latestBlockWithOffset, 'VIPSwapEvent', 'erc20_bridge_transfer_events', constants_1.SWAP_EVENT_TOPIC, 'nofilter', config_1.EP_DEPLOYMENT_BLOCK, swap_events_1.parsePancakeSwapEvent, { isDirectTrade: true, directProtocol: config_1.VIP_SWAP_SOURCES }));
                        }
                        if (config_1.FEAT_SLINGSHOT_TRADE_EVENT) {
                            promises.push(pullAndSaveEventsByTopic.getParseSaveEventsByTopic(connection, web3Source, latestBlockWithOffset, 'SlingshotTradeEvent', 'slingshot_trade_events', constants_1.SLINGSHOT_TRADE_EVENT_TOPIC, constants_1.SLINGSHOT_CONTRACT_ADDRESS, config_1.SLINGSHOT_DEPLOYMENT_BLOCK, slingshot_trade_event_1.parseSlingshotTradeEvent, {}));
                        }
                        if (config_1.FEAT_PARASWAP_SWAPPED_EVENT) {
                            promises.push(pullAndSaveEventsByTopic.getParseSaveEventsByTopic(connection, web3Source, latestBlockWithOffset, 'ParaswapSwappedEvent', 'paraswap_swapped_events', constants_1.PARASWAP_SWAPPED_EVENT_TOPIC, config_1.PARASWAP_CONTRACT_ADDRESS, config_1.PARASWAP_DEPLOYMENT_BLOCK, paraswap_swapped_event_1.parseParaswapSwappedEvent, {}));
                        }
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'LiquidityProviderSwapEvent',
                        //     'erc20_bridge_transfer_events',
                        //     LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseLiquidityProviderSwapEvent,
                        //     { isDirectTrade: true, directProtocol: 'PLP' },
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4RfqOrderFilledEvent>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'V4RfqOrderFilledEvent',
                        //     'v4_rfq_order_filled_events',
                        //     RFQORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseV4RfqOrderFilledEvent,
                        //     {},
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'NativeFillFromRFQV4',
                        //     'native_fills',
                        //     RFQORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseNativeFillFromV4RfqOrderFilledEvent,
                        //     { protocolVersion: 'v4', nativeOrderType: 'RFQ Order' },
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4LimitOrderFilledEvent>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'V4LimitOrderFilledEvent',
                        //     'v4_limit_order_filled_events',
                        //     LIMITORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseV4LimitOrderFilledEvent,
                        //     {},
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'NativeFillFromLimitV4',
                        //     'native_fills',
                        //     LIMITORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseNativeFillFromV4LimitOrderFilledEvent,
                        //     { protocolVersion: 'v4', nativeOrderType: 'Limit Order' },
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4CancelEvent>(connection, web3Source, latestBlockWithOffset, 'V4CancelEvent', 'v4_cancel_events', V4_CANCEL_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_BLOCK, parseV4CancelEvent, {}),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ExpiredRfqOrderEvent>(connection, web3Source, latestBlockWithOffset, 'ExpiredRfqOrderEvent', 'expired_rfq_order_events', EXPIRED_RFQ_ORDER_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_BLOCK, parseExpiredRfqOrderEvent, {}),
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ERC20BridgeTransferEvent>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'LiquidityProviderSwapEvent',
                        //     'erc20_bridge_transfer_events',
                        //     LIQUIDITYPROVIDERSWAP_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseLiquidityProviderSwapEvent,
                        //     { isDirectTrade: true, directProtocol: 'PLP' },
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4RfqOrderFilledEvent>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'V4RfqOrderFilledEvent',
                        //     'v4_rfq_order_filled_events',
                        //     RFQORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseV4RfqOrderFilledEvent,
                        //     {},
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'NativeFillFromRFQV4',
                        //     'native_fills',
                        //     RFQORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseNativeFillFromV4RfqOrderFilledEvent,
                        //     { protocolVersion: 'v4', nativeOrderType: 'RFQ Order' },
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4LimitOrderFilledEvent>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'V4LimitOrderFilledEvent',
                        //     'v4_limit_order_filled_events',
                        //     LIMITORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseV4LimitOrderFilledEvent,
                        //     {},
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<NativeFill>(
                        //     connection,
                        //     web3Source,
                        //     latestBlockWithOffset,
                        //     'NativeFillFromLimitV4',
                        //     'native_fills',
                        //     LIMITORDERFILLED_EVENT_TOPIC,
                        //     EXCHANGE_PROXY_ADDRESS,
                        //     EP_DEPLOYMENT_BLOCK,
                        //     parseNativeFillFromV4LimitOrderFilledEvent,
                        //     { protocolVersion: 'v4', nativeOrderType: 'Limit Order' },
                        // ),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<V4CancelEvent>(connection, web3Source, latestBlockWithOffset, 'V4CancelEvent', 'v4_cancel_events', V4_CANCEL_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_BLOCK, parseV4CancelEvent, {}),
                        // pullAndSaveEventsByTopic.getParseSaveEventsByTopic<ExpiredRfqOrderEvent>(connection, web3Source, latestBlockWithOffset, 'ExpiredRfqOrderEvent', 'expired_rfq_order_events', EXPIRED_RFQ_ORDER_EVENT_TOPIC, EXCHANGE_PROXY_ADDRESS, EP_DEPLOYMENT_BLOCK, parseExpiredRfqOrderEvent, {}),
                        _a.sent();
                        endTime = new Date().getTime();
                        utils_1.logUtils.log("finished pulling events by topic");
                        utils_1.logUtils.log("It took " + (endTime - startTime) / 1000 + " seconds to complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    return EventsByTopicScraper;
}());
exports.EventsByTopicScraper = EventsByTopicScraper;
