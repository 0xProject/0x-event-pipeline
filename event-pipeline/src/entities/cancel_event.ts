import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { ProxyType } from '../utils';

// These events come directly from the Exchange contract and are fired for meta transactions
@Entity({ name: 'cancel_events', schema: 'events' })
export class CancelEvent extends Event {
    // The address of the maker.
    @Column({ name: 'maker_address', type: 'varchar' })
    public makerAddress!: string;
    // The address of the fee recepient. Can be used to identify the relayer.
    @Column({ name: 'fee_recipient_address', type: 'varchar' })
    public feeRecipientAddress!: string;
    // The address of the sender (used for extension contracts).
    @Column({ name: 'sender_address', type: 'varchar' })
    public senderAddress!: string;
    // The hash of the order that was cancelled.
    @Column({ name: 'order_hash', type: 'varchar' })
    public orderHash!: string;

    // The raw maker asset data.
    @Column({ name: 'raw_maker_asset_data', type: 'varchar' })
    public rawMakerAssetData!: string;
    // The maker asset type (e.g. 'erc20' or 'erc721').
    @Column({ name: 'maker_proxy_type', type: 'varchar', nullable: true })
    public makerProxyType!: ProxyType | null;
    // The id of the AssetProxy used for the maker asset.
    @Column({ name: 'maker_asset_proxy_id', type: 'varchar', nullable: true })
    public makerAssetProxyId!: string | null;
    // The address of the maker token.
    @Column({ name: 'maker_token_address', nullable: true, type: String })
    public makerTokenAddress!: string | null;
    // The raw taker asset data.
    @Column({ name: 'raw_taker_asset_data', type: 'varchar' })
    public rawTakerAssetData!: string;
    // The taker asset type (e.g. 'erc20' or 'erc721').
    @Column({ name: 'taker_proxy_type', type: 'varchar', nullable: true })
    public takerProxyType!: ProxyType | null;
    // The id of the AssetProxy used for the taker asset.
    // Can be null in the case of invalid asset Aata
    @Column({ name: 'taker_asset_proxy_id', type: 'varchar', nullable: true })
    public takerAssetProxyId!: string | null;
    // The address of the taker token.
    @Column({ name: 'taker_token_address', type: 'varchar', nullable: true })
    public takerTokenAddress!: string | null;
}
