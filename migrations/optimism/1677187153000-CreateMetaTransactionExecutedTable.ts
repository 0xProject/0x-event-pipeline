import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';

export class CreateMetaTransactionExecutedTable1677187153000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(
            `create table ${schema}.meta_transaction_executed_events
(
    observed_timestamp bigint not null,
    contract_address varchar not null,
    transaction_hash varchar not null,
    transaction_index bigint not null,
    log_index bigint not null,
    block_hash varchar not null,
    block_number bigint not null,
    hash varchar not null,
    selector varchar not null,
    signer varchar not null,
    sender varchar not null,
    primary key (transaction_hash, log_index)
);

create index meta_transaction_executed_events_signer_index
    on ${schema}.meta_transaction_executed_events (signer);

create index meta_transaction_executed_events_sender_index
    on ${schema}.meta_transaction_executed_events (sender);

create index meta_transaction_executed_events_block_number_index
    on ${schema}.meta_transaction_executed_events (block_number);
`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        const { schema } = connection.options as any;
        await queryRunner.query(`DROP TABLE ${schema}.meta_transaction_executed_events;`);
    }
}
