"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.V4RfqOrderFilledEvent = exports.V4LimitOrderFilledEvent = exports.V4CancelEvent = exports.TransformedERC20Event = exports.Transaction = exports.TransactionReceipt = exports.TransactionLogs = exports.SlingshotTradeEvent = exports.ParaswapSwappedEvent = exports.ParamsSetEvent = exports.OneinchSwappedEvent = exports.NativeFill = exports.LastBlockProcessed = exports.ExpiredRfqOrderEvent = exports.ERC20BridgeTransferEvent = exports.Block = void 0;
var pipeline_utils_1 = require("@0x/pipeline-utils");
var typeorm_1 = require("typeorm");
var config_1 = require("../config");
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Block = __decorate([
        typeorm_1.Entity({ name: 'blocks', schema: config_1.SCHEMA })
    ], Block);
    return Block;
}(pipeline_utils_1.Block));
exports.Block = Block;
var ERC20BridgeTransferEvent = /** @class */ (function (_super) {
    __extends(ERC20BridgeTransferEvent, _super);
    function ERC20BridgeTransferEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ERC20BridgeTransferEvent = __decorate([
        typeorm_1.Entity({ name: 'erc20_bridge_transfer_events', schema: config_1.SCHEMA })
    ], ERC20BridgeTransferEvent);
    return ERC20BridgeTransferEvent;
}(pipeline_utils_1.ERC20BridgeTransferEvent));
exports.ERC20BridgeTransferEvent = ERC20BridgeTransferEvent;
var ExpiredRfqOrderEvent = /** @class */ (function (_super) {
    __extends(ExpiredRfqOrderEvent, _super);
    function ExpiredRfqOrderEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExpiredRfqOrderEvent = __decorate([
        typeorm_1.Entity({ name: 'expired_rfq_order_events', schema: config_1.SCHEMA })
    ], ExpiredRfqOrderEvent);
    return ExpiredRfqOrderEvent;
}(pipeline_utils_1.ExpiredRfqOrderEvent));
exports.ExpiredRfqOrderEvent = ExpiredRfqOrderEvent;
var LastBlockProcessed = /** @class */ (function (_super) {
    __extends(LastBlockProcessed, _super);
    function LastBlockProcessed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LastBlockProcessed = __decorate([
        typeorm_1.Entity({ name: 'last_block_processed', schema: config_1.SCHEMA })
    ], LastBlockProcessed);
    return LastBlockProcessed;
}(pipeline_utils_1.LastBlockProcessed));
exports.LastBlockProcessed = LastBlockProcessed;
var NativeFill = /** @class */ (function (_super) {
    __extends(NativeFill, _super);
    function NativeFill() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeFill = __decorate([
        typeorm_1.Entity({ name: 'native_fills', schema: config_1.SCHEMA })
    ], NativeFill);
    return NativeFill;
}(pipeline_utils_1.NativeFill));
exports.NativeFill = NativeFill;
var OneinchSwappedEvent = /** @class */ (function (_super) {
    __extends(OneinchSwappedEvent, _super);
    function OneinchSwappedEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OneinchSwappedEvent = __decorate([
        typeorm_1.Entity({ name: 'oneinch_swapped_events', schema: config_1.SCHEMA })
    ], OneinchSwappedEvent);
    return OneinchSwappedEvent;
}(pipeline_utils_1.OneinchSwappedEvent));
exports.OneinchSwappedEvent = OneinchSwappedEvent;
var ParamsSetEvent = /** @class */ (function (_super) {
    __extends(ParamsSetEvent, _super);
    function ParamsSetEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParamsSetEvent = __decorate([
        typeorm_1.Entity({ name: 'params_set_events', schema: config_1.SCHEMA })
    ], ParamsSetEvent);
    return ParamsSetEvent;
}(pipeline_utils_1.ParamsSetEvent));
exports.ParamsSetEvent = ParamsSetEvent;
var ParaswapSwappedEvent = /** @class */ (function (_super) {
    __extends(ParaswapSwappedEvent, _super);
    function ParaswapSwappedEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParaswapSwappedEvent = __decorate([
        typeorm_1.Entity({ name: 'paraswap_swapped_events', schema: config_1.SCHEMA })
    ], ParaswapSwappedEvent);
    return ParaswapSwappedEvent;
}(pipeline_utils_1.ParaswapSwappedEvent));
exports.ParaswapSwappedEvent = ParaswapSwappedEvent;
var SlingshotTradeEvent = /** @class */ (function (_super) {
    __extends(SlingshotTradeEvent, _super);
    function SlingshotTradeEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlingshotTradeEvent = __decorate([
        typeorm_1.Entity({ name: 'slingshot_trade_events', schema: config_1.SCHEMA })
    ], SlingshotTradeEvent);
    return SlingshotTradeEvent;
}(pipeline_utils_1.SlingshotTradeEvent));
exports.SlingshotTradeEvent = SlingshotTradeEvent;
var TransactionLogs = /** @class */ (function (_super) {
    __extends(TransactionLogs, _super);
    function TransactionLogs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionLogs = __decorate([
        typeorm_1.Entity({ name: 'transaction_logs', schema: config_1.SCHEMA })
    ], TransactionLogs);
    return TransactionLogs;
}(pipeline_utils_1.TransactionLogs));
exports.TransactionLogs = TransactionLogs;
var TransactionReceipt = /** @class */ (function (_super) {
    __extends(TransactionReceipt, _super);
    function TransactionReceipt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionReceipt = __decorate([
        typeorm_1.Entity({ name: 'transaction_receipts', schema: config_1.SCHEMA })
    ], TransactionReceipt);
    return TransactionReceipt;
}(pipeline_utils_1.TransactionReceipt));
exports.TransactionReceipt = TransactionReceipt;
var Transaction = /** @class */ (function (_super) {
    __extends(Transaction, _super);
    function Transaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transaction = __decorate([
        typeorm_1.Entity({ name: 'transactions', schema: config_1.SCHEMA })
    ], Transaction);
    return Transaction;
}(pipeline_utils_1.Transaction));
exports.Transaction = Transaction;
var TransformedERC20Event = /** @class */ (function (_super) {
    __extends(TransformedERC20Event, _super);
    function TransformedERC20Event() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransformedERC20Event = __decorate([
        typeorm_1.Entity({ name: 'transformed_erc20_events', schema: config_1.SCHEMA })
    ], TransformedERC20Event);
    return TransformedERC20Event;
}(pipeline_utils_1.TransformedERC20Event));
exports.TransformedERC20Event = TransformedERC20Event;
var V4CancelEvent = /** @class */ (function (_super) {
    __extends(V4CancelEvent, _super);
    function V4CancelEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    V4CancelEvent = __decorate([
        typeorm_1.Entity({ name: 'v4_cancel_events', schema: config_1.SCHEMA })
    ], V4CancelEvent);
    return V4CancelEvent;
}(pipeline_utils_1.V4CancelEvent));
exports.V4CancelEvent = V4CancelEvent;
var V4LimitOrderFilledEvent = /** @class */ (function (_super) {
    __extends(V4LimitOrderFilledEvent, _super);
    function V4LimitOrderFilledEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    V4LimitOrderFilledEvent = __decorate([
        typeorm_1.Entity({ name: 'v4_limit_order_filled_events', schema: config_1.SCHEMA })
    ], V4LimitOrderFilledEvent);
    return V4LimitOrderFilledEvent;
}(pipeline_utils_1.V4LimitOrderFilledEvent));
exports.V4LimitOrderFilledEvent = V4LimitOrderFilledEvent;
var V4RfqOrderFilledEvent = /** @class */ (function (_super) {
    __extends(V4RfqOrderFilledEvent, _super);
    function V4RfqOrderFilledEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    V4RfqOrderFilledEvent = __decorate([
        typeorm_1.Entity({ name: 'v4_rfq_order_filled_events', schema: config_1.SCHEMA })
    ], V4RfqOrderFilledEvent);
    return V4RfqOrderFilledEvent;
}(pipeline_utils_1.V4RfqOrderFilledEvent));
exports.V4RfqOrderFilledEvent = V4RfqOrderFilledEvent;
