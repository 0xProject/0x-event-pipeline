import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'onchain_governance_proposal_created' })
export class OnchainGovernanceProposalCreatedEvent extends Event {
    @Column({ name: 'proposal_id', type: 'bigint', transformer: bigNumberTransformer })
    public proposal_id!: BigNumber;
    @Column({ name: 'proposer', type: 'varchar' })
    public proposer!: string;
    @Column({ name: 'targets', type: 'varchar' })
    public targets!: string;
    @Column({ name: 'signatures', type: 'varchar' })
    public signatures!: string;
    @Column({ name: 'calldatas', type: 'varchar' })
    public calldatas!: string;
    @Column({ name: 'start_block', type: 'bigint', transformer: bigNumberTransformer })
    public start_block!: BigNumber;
    @Column({ name: 'end_block', type: 'bigint', transformer: bigNumberTransformer })
    public end_block!: BigNumber;
    @Column({ name: 'description', type: 'varchar' })
    public description!: string;
    @Column({ name: 'contract_name', type: 'varchar' })
    public contract_name!: string;
}
