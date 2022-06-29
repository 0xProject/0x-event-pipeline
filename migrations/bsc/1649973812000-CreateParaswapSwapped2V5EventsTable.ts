import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateParaswapSwapped2V5EventsTable1649973812000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(
            `create table ${schema}.paraswap_swapped2_v5_events
(
    observed_timestamp bigint not null,
    contract_address varchar not null,
    transaction_hash varchar not null,
    transaction_index bigint not null,
    log_index bigint not null,
    block_hash varchar not null,
    block_number bigint not null,
    from_token varchar not null,
    to_token varchar not null,
    from_token_amount numeric not null,
    to_token_amount numeric not null,
    "from" varchar not null,
    "to" varchar,
    expected_amount numeric,
    uuid varchar,
    partner varchar null,
    fee_percent varchar null,
    primary key (transaction_hash, log_index)
);

create index paraswap_swapped2_v5_events_transaction_transaction_hash_index
    on ${schema}.paraswap_swapped2_v5_events (transaction_hash);

create index paraswap_swapped2_v5_events_transaction_block_number_index
    on ${schema}.paraswap_swapped2_v5_events (block_number);
`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.paraswap_swapped_v5_events;`);
    }
}
