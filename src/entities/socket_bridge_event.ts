import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { bigNumberTransformer } from '../transformers';

@Entity({ name: 'socket_bridge_events' })
export class SocketBridgeEvent extends Event {
    // The amount of the from token that was transfered
    @Column({ name: 'amount', type: 'numeric', transformer: bigNumberTransformer })
    public amount!: BigNumber;
    // The address of the from token
    @Column({ name: 'token', type: 'varchar' })
    public token!: string;
    @Column({ name: 'to_chain_id', type: 'numeric', transformer: bigNumberTransformer })
    public toChainId!: BigNumber;
    @Column({ name: 'bridge_name', type: 'varchar' })
    public bridgeName!: string;
    @Column({ name: 'sender', type: 'varchar' })
    public sender!: string;
    @Column({ name: 'receiver', type: 'varchar' })
    public receiver!: string;
    // Unique identifier of the Socket API Client
    @Column({ name: 'metadata', type: 'varchar' })
    public metadata!: string;
}
