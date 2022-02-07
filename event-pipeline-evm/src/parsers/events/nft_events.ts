const abiCoder = require('web3-eth-abi');
import { RawLogEntry } from 'ethereum-types';
import {
    Erc1155OrderCancelledEvent,
    Erc1155OrderFilledEvent,
    Erc1155OrderPresignedEvent,
    Erc721OrderCancelledEvent,
    Erc721OrderFilledEvent,
    Erc721OrderPresignedEvent,
} from '../../entities';
import { parseEvent } from './parse_event';
import {
    ERC1155_ORDER_CANCELLED_ABI,
    ERC1155_ORDER_FILLED_ABI,
    ERC1155_ORDER_PRESIGNED_ABI,
    ERC721_ORDER_CANCELLED_ABI,
    ERC721_ORDER_FILLED_ABI,
    ERC721_ORDER_PRESIGNED_ABI,
} from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseErc721OrderFilledEvent(eventLog: RawLogEntry): Erc721OrderFilledEvent {
    const parsedEvent = new Erc721OrderFilledEvent();

    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(ERC721_ORDER_FILLED_ABI.inputs, eventLog.data, []);

    // Whether the order is selling or buying the ERC721 token.
    //  Buy: 0
    //  Sell: 1
    parsedEvent.isSell = decodedLog.direction === '1';
    // The maker of the order.
    parsedEvent.maker = decodedLog.maker.toLowerCase();
    // The taker of the order.
    parsedEvent.taker = decodedLog.taker.toLowerCase();
    // The unique maker nonce in the order.
    parsedEvent.nonce = new BigNumber(decodedLog.nonce);
    // The address of the ERC20 token.
    parsedEvent.erc20Token = decodedLog.erc20Token.toLowerCase();
    // The amount of ERC20 token to sell or buy.
    parsedEvent.erc20TokenAmount = new BigNumber(decodedLog.erc20TokenAmount);
    // The address of the ERC721 token.
    parsedEvent.erc721Token = decodedLog.erc721Token.toLowerCase();
    // The ID of the ERC721 asset.
    parsedEvent.erc721TokenId = new BigNumber(decodedLog.erc721TokenId);
    // If this order was matched with another using `matchERC721Orders()`, this will be the address of the caller
    parsedEvent.matcher =
        decodedLog.matcher === '0x0000000000000000000000000000000000000000' ? null : decodedLog.matcher.toLowerCase();

    return parsedEvent;
}

export function parseErc721OrderCancelledEvent(eventLog: RawLogEntry): Erc721OrderCancelledEvent {
    const parsedEvent = new Erc721OrderCancelledEvent();

    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(ERC721_ORDER_CANCELLED_ABI.inputs, eventLog.data, []);

    // The maker of the order.
    parsedEvent.maker = decodedLog.maker.toLowerCase();
    // The unique maker nonce in the order.
    parsedEvent.nonce = new BigNumber(decodedLog.nonce);

    return parsedEvent;
}

export function parseErc721OrderPresignedEvent(eventLog: RawLogEntry): Erc721OrderPresignedEvent {
    const parsedEvent = new Erc721OrderPresignedEvent();

    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(ERC721_ORDER_PRESIGNED_ABI.inputs, eventLog.data, []);

    // Whether the order is selling or buying the ERC721 token.
    //  Buy: 0
    //  Sell: 1
    parsedEvent.isSell = decodedLog.direction === '1';
    // The maker of the order.
    parsedEvent.maker = decodedLog.maker.toLowerCase();
    // The taker of the order.
    parsedEvent.taker = decodedLog.taker.toLowerCase();
    // The timestamp after which this order is not valid
    parsedEvent.expiry = new BigNumber(decodedLog.expiry);
    // The unique maker nonce in the order.
    parsedEvent.nonce = new BigNumber(decodedLog.nonce);
    // The address of the ERC20 token.
    parsedEvent.erc20Token = decodedLog.erc20Token.toLowerCase();
    // The amount of ERC20 token to sell or buy.
    parsedEvent.erc20TokenAmount = new BigNumber(decodedLog.erc20TokenAmount);
    parsedEvent.fees = JSON.stringify(decodedLog.fees);
    // The address of the ERC721 token.
    parsedEvent.erc721Token = decodedLog.erc721Token.toLowerCase();
    // The ID of the ERC721 asset.
    parsedEvent.erc721TokenId = new BigNumber(decodedLog.erc721TokenId);
    parsedEvent.erc721TokenProperties = JSON.stringify(decodedLog.erc721TokenProperties);

    return parsedEvent;
}

export function parseErc1155OrderFilledEvent(eventLog: RawLogEntry): Erc1155OrderFilledEvent {
    const parsedEvent = new Erc1155OrderFilledEvent();

    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(ERC1155_ORDER_FILLED_ABI.inputs, eventLog.data, []);

    // Whether the order is selling or buying the ERC1155 token.
    //  Buy: 0
    //  Sell: 1
    parsedEvent.isSell = decodedLog.direction === '1';
    // The maker of the order.
    parsedEvent.maker = decodedLog.maker.toLowerCase();
    // The taker of the order.
    parsedEvent.taker = decodedLog.taker.toLowerCase();
    // The unique maker nonce in the order.
    parsedEvent.nonce = new BigNumber(decodedLog.nonce);
    // The address of the ERC20 token.
    parsedEvent.erc20Token = decodedLog.erc20Token.toLowerCase();
    // The amount of ERC20 token to settled in this fill.
    parsedEvent.erc20FillAmount = new BigNumber(decodedLog.erc20FillAmount);
    // The address of the ERC1155 token.
    parsedEvent.erc1155Token = decodedLog.erc1155Token.toLowerCase();
    // The ID of the ERC1155 asset.
    parsedEvent.erc1155TokenId = new BigNumber(decodedLog.erc1155TokenId);
    // If this order was matched with another using `matchERC1155Orders()`, this will be the address of the caller
    parsedEvent.matcher =
        decodedLog.matcher === '0x0000000000000000000000000000000000000000' ? null : decodedLog.matcher.toLowerCase();

    return parsedEvent;
}

export function parseErc1155OrderCancelledEvent(eventLog: RawLogEntry): Erc1155OrderCancelledEvent {
    const parsedEvent = new Erc1155OrderCancelledEvent();

    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(ERC1155_ORDER_CANCELLED_ABI.inputs, eventLog.data, []);

    // The unique maker nonce in the order.
    parsedEvent.orderHash = decodedLog.orderHash.toLowerCase();
    // The maker of the order.
    parsedEvent.maker = decodedLog.maker.toLowerCase();

    return parsedEvent;
}

export function parseErc1155OrderPresignedEvent(eventLog: RawLogEntry): Erc1155OrderPresignedEvent {
    const parsedEvent = new Erc1155OrderPresignedEvent();

    parseEvent(eventLog, parsedEvent);

    const decodedLog = abiCoder.decodeLog(ERC1155_ORDER_PRESIGNED_ABI.inputs, eventLog.data, []);

    // Whether the order is selling or buying the ERC1155 token.
    //  Buy: 0
    //  Sell: 1
    parsedEvent.isSell = decodedLog.direction === '1';
    // The maker of the order.
    parsedEvent.maker = decodedLog.maker.toLowerCase();
    // The taker of the order.
    parsedEvent.taker = decodedLog.taker.toLowerCase();
    // The timestamp after which this order is not valid
    parsedEvent.expiry = new BigNumber(decodedLog.expiry);
    // The unique maker nonce in the order.
    parsedEvent.nonce = new BigNumber(decodedLog.nonce);
    // The address of the ERC20 token.
    parsedEvent.erc20Token = decodedLog.erc20Token.toLowerCase();
    // The amount of ERC20 token to sell or buy.
    parsedEvent.erc20TokenAmount = new BigNumber(decodedLog.erc20TokenAmount);
    parsedEvent.fees = JSON.stringify(decodedLog.fees);
    // The address of the ERC1155 token.
    parsedEvent.erc1155Token = decodedLog.erc1155Token.toLowerCase();
    // The ID of the ERC1155 asset.
    parsedEvent.erc1155TokenId = new BigNumber(decodedLog.erc1155TokenId);
    parsedEvent.erc1155TokenProperties = JSON.stringify(decodedLog.erc1155TokenProperties);
    // The amount of ERC20 token to sell or buy.
    parsedEvent.erc1155TokenAmount = new BigNumber(decodedLog.erc1155TokenAmount);

    return parsedEvent;
}
