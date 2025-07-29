import { Event } from './event';
import { Column, Entity } from 'typeorm';

// These events come directly from the token's ERC20 contract and are fired whenever
// an ERC20 is transferred between two wallets.
@Entity({ name: 'settler_erc721_transfer_events' })
export class SettlerERC721TransferEvent extends Event {
    @Column({ name: 'from', type: 'varchar' })
    public from!: string;
    @Column({ name: 'to', type: 'varchar' })
    public to!: string;
    @Column({ name: 'token_id', type: 'varchar' })
    public token_id!: string;
}
