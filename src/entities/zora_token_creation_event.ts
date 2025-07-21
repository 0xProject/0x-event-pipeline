import { bigNumberTransformer } from '../transformers';
import { Event } from './event';
import { Column, Entity } from 'typeorm';

// This entity contains multiple types of events.
// All coming from the Zora Factory contract when creating new coins/tokens.
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
