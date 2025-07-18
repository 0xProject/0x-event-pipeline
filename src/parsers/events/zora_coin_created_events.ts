import { ZORA_COIN_CREATED_ABI } from '../../constants';
import { ZoraTokenCreationEvent } from '../../entities';
import { parseEvent } from './parse_event';
import { LogEntry } from 'ethereum-types';

const abiCoder = require('web3-eth-abi');

const Web3Utils = require('web3-utils');

export function parseZoraCoinCreatedEvent(eventLog: LogEntry): ZoraTokenCreationEvent | null {
    const zoraTokenCreationEvent = new ZoraTokenCreationEvent();

    parseEvent(eventLog, zoraTokenCreationEvent);

    const decodedLog = abiCoder.decodeLog(ZORA_COIN_CREATED_ABI.inputs, eventLog.data, eventLog.topics.slice(1));

    zoraTokenCreationEvent.event_name = ZORA_COIN_CREATED_ABI.name
    zoraTokenCreationEvent.address = decodedLog.coin.toLowerCase();
    zoraTokenCreationEvent.currency = decodedLog.currency.toLowerCase();
    zoraTokenCreationEvent.payout_recipient = decodedLog.payoutRecipient.toLowerCase();
    zoraTokenCreationEvent.platform_referrer = decodedLog.platformReferrer.toLowerCase();
    zoraTokenCreationEvent.version = decodedLog.version.toLowerCase();

    return zoraTokenCreationEvent;
}
