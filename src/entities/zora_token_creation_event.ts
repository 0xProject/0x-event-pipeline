import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { Column, Entity } from 'typeorm';

// These events come directly from the token's ERC20 contract and are fired whenever
// an ERC20 is transferred between two wallets.
@Entity({ name: 'zora_token_creation_events' })
export class ZoraTokenCreationEvent extends Event {
    @Column({ name: 'event_name', type: 'varchar' })
    public event_name!: string;
    @Column({ name: 'address', type: 'varchar' })
    public address!: string;
    @Column({ name: 'currency', type: 'varchar' })
    public currency!: string;
    @Column({ name: 'payout_recipient', type: 'varchar' })
    public payout_recipient!: string;
    @Column({ name: 'platform_referrer', type: 'varchar' })
    public platform_referrer!: string;
    @Column({ name: 'version', type: 'varchar' })
    public version!: string;
}
