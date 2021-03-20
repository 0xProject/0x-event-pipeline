import {MigrationInterface, QueryRunner, Table} from "typeorm";

const balancerSwapEvents = new Table({
    name: 'events.balancer_swap_events',
    // sticking with the established conventions
    columns: [
        // in the events entity definition
        { name: 'observed_timestamp', type: 'bigint' },
        { name: 'contract_address', type: 'varchar' },
        { name: 'transaction_hash', type: 'varchar', isPrimary: true },
        { name: 'transaction_index', type: 'bigint' },
        { name: 'log_index', type: 'bigint', isPrimary: true },
        { name: 'block_hash', type: 'varchar' },
        { name: 'block_number', type: 'bigint' },

        // in the child entity definition
        { name: 'caller', type: 'varchar' },
        // i don't know how I feel about deviating from maker/taker naming convention, but that's what
        // Balancer calls it
        { name: 'token_in', type: 'varchar' },
        { name: 'token_out', type: 'varchar' },
        { name: 'token_amount_in', type: 'numeric' },
        { name: 'token_amount_out', type: 'numeric' },
    ],
});

// Q for other eng - why create index on block number & maker if they're not specified
// as indices in the ORM? what's the difference?
// keeping it in for now - probably a good reason for the convention
const createBalancerSwapEventsIndexQuery = `
    CREATE INDEX balancer_swap_events_transaction_hash_index
    ON events.balancer_swap_events (transaction_hash);

    CREATE INDEX balancer_swap_events_block_number_index
    ON events.balancer_swap_events (block_number);

    CREATE INDEX balancer_swap_events_caller_index
    ON events.balancer_swap_events (caller);
`;

const dropBalancerSwapEventsIndexQuery = `
    DROP INDEX events.balancer_swap_events_transaction_hash_index;
    DROP INDEX events.balancer_swap_events_block_number_index;
    DROP INDEX events.balancer_swap_events_caller_index;
`;

export class AddBalancerSwapTableEvents1616185308174 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(balancerSwapEvents);
      await queryRunner.query(createBalancerSwapEventsIndexQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(dropBalancerSwapEventsIndexQuery);
      await queryRunner.dropTable(balancerSwapEvents);
    }

}
