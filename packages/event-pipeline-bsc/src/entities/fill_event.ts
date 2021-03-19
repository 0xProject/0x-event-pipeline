import { BigNumber } from '@0x/utils';
import { Column, Entity } from 'typeorm';

import { Event } from './event';
import { ProxyType } from '../types';
import { bigNumberTransformer } from '../utils';

// These events come directly from the Exchange contract and are fired whenever
// someone fills an order.
@Entity({ name: 'fill_events', schema: 'events' })
export class FillEvent extends Event {
    // The address of the maker.
    @Column({ name: 'maker_address' })
    public makerAddress!: string;
    // The address of the taker (may be null).
    @Column({ name: 'taker_address' })
    public takerAddress!: string;
    // The address of the fee recepient. Can be used to identify the relayer.
    @Column({ name: 'fee_recipient_address' })
    public feeRecipientAddress!: string;
    // The address of the sender (used for extension contracts).
    @Column({ name: 'sender_address' })
    public senderAddress!: string;
    // The amount of the maker asset which was filled.
    @Column({ name: 'maker_asset_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public makerAssetFilledAmount!: BigNumber;
    // The amount of the taker asset which was filled.
    @Column({ name: 'taker_asset_filled_amount', type: 'numeric', transformer: bigNumberTransformer })
    public takerAssetFilledAmount!: BigNumber;
    // The hash of the order which was filled.
    @Column({ name: 'order_hash' })
    public orderHash!: string;
    // The raw maker asset data.
    @Column({ name: 'raw_maker_asset_data' })
    public rawMakerAssetData!: string;
    // The maker asset type (e.g. 'erc20' or 'erc721').
    @Column({ name: 'maker_proxy_type' })
    public makerProxyType!: ProxyType;
    // The id of the AssetProxy used for the maker asset.
    @Column({ name: 'maker_proxy_id' })
    public makerProxyId!: string;
    // The address of the maker token.
    @Column({ name: 'maker_token_address', type: 'varchar', nullable: true })
    public makerTokenAddress!: string | null;
    // The raw taker asset data.
    @Column({ name: 'raw_taker_asset_data' })
    public rawTakerAssetData!: string;
    // The taker proxy type (e.g. 'erc20' or 'erc721').
    @Column({ name: 'taker_proxy_type' })
    public takerProxyType!: ProxyType;
    // The id of the AssetProxy used for the taker asset.
    @Column({ name: 'taker_proxy_id' })
    public takerAssetProxyId!: string;
    // The address of the taker token.
    @Column({ name: 'taker_token_address', type: 'varchar', nullable: true })
    public takerTokenAddress!: string | null;
    // The fee paid by the maker.
    @Column({ name: 'maker_fee_paid', type: 'numeric', transformer: bigNumberTransformer })
    public makerFeePaid!: BigNumber;
    // The fee paid by the taker.
    @Column({ name: 'taker_fee_paid', type: 'numeric', transformer: bigNumberTransformer })
    public takerFeePaid!: BigNumber;
    // maker fee proxy
    @Column({ name: 'maker_fee_proxy_type', type: 'varchar' })
    public makerFeeProxyType!: string | null;
    // The address of the maker fee token.
    @Column({ name: 'maker_fee_token_address', type: 'varchar', nullable: true })
    public makerFeeTokenAddress!: string | null;
    // taker fee proxy
    @Column({ name: 'taker_fee_proxy_type', type: 'varchar' })
    public takerFeeProxyType!: string | null;
    // The address of the maker fee token.
    @Column({ name: 'taker_fee_token_address', type: 'varchar', nullable: true })
    public takerFeeTokenAddress!: string | null;
    // The address of the taker token.
    @Column({ name: 'protocol_fee_paid', type: 'bigint', transformer: bigNumberTransformer })
    public protocolFeePaid!: BigNumber | null;

    // ERC20Bridge Columns
    @Column({ name: 'taker_bridge_address', type: 'varchar', nullable: true })
    public takerBridgeAddress!: string | null;
    @Column({ name: 'maker_bridge_address', type: 'varchar', nullable: true })
    public makerBridgeAddress!: string | null;
}
