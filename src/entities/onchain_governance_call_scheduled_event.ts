import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer, numberToBigIntTransformer } from '../transformers';

@Entity({ name: 'onchain_governance_call_scheduled' })
export class OnchainGovernanceCallScheduledEvent extends Event {
    @Column({ name: 'id', type: 'varchar' })
    public id!: string;
    @Column({ name: 'index', type: 'bigint', transformer: bigNumberTransformer })
    public index!: BigNumber;
    @Column({ name: 'target', type: 'varchar' })
    public target!: string;
    @Column({ name: 'value', type: 'bigint', transformer: bigNumberTransformer })
    public value!: BigNumber;
    @Column({ name: 'data', type: 'varchar' })
    public data!: string;
    @Column({ name: 'predecessor', type: 'varchar' })
    public predecessor!: string;
    @Column({ name: 'delay', type: 'bigint', transformer: bigNumberTransformer })
    public delay!: BigNumber;
    @Column({ name: 'contract_name', type: 'varchar' })
    public contract_name!: string;
}
