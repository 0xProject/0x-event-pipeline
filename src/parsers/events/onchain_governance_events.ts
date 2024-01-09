const abiCoder = require('web3-eth-abi');
import { LogEntry } from 'ethereum-types';
import { OnchainGovernanceProposalCreatedEvent, OnchainGovernanceCallScheduledEvent } from '../../entities';

import { parseEvent } from './parse_event';
import { ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_ABI, ONCHAIN_GOVERNANCE_CALL_SCHEDULED_ABI } from '../../constants';
import { BigNumber } from '@0x/utils';

export function parseOnchainGovernanceProposalCreatedEvent(
    eventLog: LogEntry,
    contract_name: string,
): OnchainGovernanceProposalCreatedEvent {
    const onchainGovernanceProposalCreatedEvent = new OnchainGovernanceProposalCreatedEvent();
    parseEvent(eventLog, onchainGovernanceProposalCreatedEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_ABI.inputs, eventLog.data);

    onchainGovernanceProposalCreatedEvent.proposal_id = new BigNumber(decodedLog.proposalId);
    onchainGovernanceProposalCreatedEvent.proposer = decodedLog.proposer.toLowerCase();
    onchainGovernanceProposalCreatedEvent.targets = decodedLog.targets.toLowerCase();
    onchainGovernanceProposalCreatedEvent.signatures = decodedLog.signatures;
    onchainGovernanceProposalCreatedEvent.calldatas = decodedLog.calldatas;
    onchainGovernanceProposalCreatedEvent.start_block = new BigNumber(decodedLog.startBlock);
    onchainGovernanceProposalCreatedEvent.end_block = new BigNumber(decodedLog.endBlock);
    onchainGovernanceProposalCreatedEvent.description = decodedLog.description;
    onchainGovernanceProposalCreatedEvent.contract_name = contract_name;

    return onchainGovernanceProposalCreatedEvent;
}

export function parseOnchainGovernanceCallScheduledEvent(
    eventLog: LogEntry,
    contract_name: string,
): OnchainGovernanceCallScheduledEvent {
    const onchainGovernanceCallScheduledEvent = new OnchainGovernanceCallScheduledEvent();
    parseEvent(eventLog, onchainGovernanceCallScheduledEvent);
    // decode the basic info
    const decodedLog = abiCoder.decodeLog(ONCHAIN_GOVERNANCE_CALL_SCHEDULED_ABI.inputs, eventLog.data);

    onchainGovernanceCallScheduledEvent.id = decodedLog.id.toLowerCase();
    onchainGovernanceCallScheduledEvent.index = new BigNumber(decodedLog.index);
    onchainGovernanceCallScheduledEvent.target = decodedLog.target.toLowerCase();
    onchainGovernanceCallScheduledEvent.value = new BigNumber(decodedLog.value);
    onchainGovernanceCallScheduledEvent.data = decodedLog.data;
    onchainGovernanceCallScheduledEvent.predecessor = decodedLog.predecessor.toLowerCase();
    onchainGovernanceCallScheduledEvent.delay = new BigNumber(decodedLog.delay);
    onchainGovernanceCallScheduledEvent.contract_name = contract_name;

    return onchainGovernanceCallScheduledEvent;
}
