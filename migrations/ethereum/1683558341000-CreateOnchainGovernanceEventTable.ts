import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const onchainGovernanceProposalCreated = new Table({
    name: 'events.onchain_governance_proposal_created',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'proposal_id',  type: 'numeric' },
        { name: 'proposer', type: 'varchar' },
        { name: 'targets', type: 'varchar' },
        { name: 'signatures', type: 'varchar' },
        { name: 'calldatas', type: 'varchar' },
        { name: 'start_block', type: 'bigint' },
        { name: 'end_block', type: 'bigint' },
        { name: 'description', type: 'varchar' },
        { name: 'contract_name', type: 'varchar' },
    ],
});

const createOnchainGovernanceProposalCreatedIndexQuery = `
    CREATE INDEX onchain_governance_proposal_created_transaction_hash_index
    ON events.onchain_governance_proposal_created (transaction_hash);

    CREATE INDEX onchain_governance_proposal_created_block_number_index
    ON events.onchain_governance_proposal_created (block_number);
`;

const dropOnchainGovernanceProposalCreatedIndexQuery = `
    DROP INDEX events.onchain_governance_proposal_created_transaction_hash_index;
    DROP INDEX events.onchain_governance_proposal_created_block_number_index;
`;


const onchainGovernanceCallScheduled = new Table({
    name: 'events.onchain_governance_call_scheduled',
    columns: [
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },
        { name: 'id', type: 'varchar' },
        { name: 'index', type: 'numeric' },
        { name: 'target', type: 'varchar' },
        { name: 'value', type: 'numeric' },
        { name: 'data', type: 'varchar' },
        { name: 'predecessor', type: 'varchar' },
        { name: 'delay', type: 'numeric' },
        { name: 'contract_name', type: 'varchar' },
    ],
});

const createOnchainGovernanceCallScheduledIndexQuery = `
    CREATE INDEX onchain_governance_call_scheduled_transaction_hash_index
    ON events.onchain_governance_call_scheduled (transaction_hash);

    CREATE INDEX onchain_governance_call_scheduled_block_number_index
    ON events.onchain_governance_call_scheduled (block_number);
`;

const dropOnchainGovernanceCallScheduledIndexQuery = `
    DROP INDEX events.onchain_governance_call_scheduled_transaction_hash_index;
    DROP INDEX events.onchain_governance_call_scheduled_block_number_index;
`;


export class CreateOnchainGovernanceEventTable1683558341000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(onchainGovernanceProposalCreated);
        await queryRunner.query(createOnchainGovernanceProposalCreatedIndexQuery);
        await queryRunner.createTable(onchainGovernanceCallScheduled);
        await queryRunner.query(createOnchainGovernanceCallScheduledIndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(dropOnchainGovernanceProposalCreatedIndexQuery);
        await queryRunner.dropTable(onchainGovernanceProposalCreated);
        await queryRunner.query(dropOnchainGovernanceCallScheduledIndexQuery);
        await queryRunner.dropTable(onchainGovernanceCallScheduled);
    }
}
