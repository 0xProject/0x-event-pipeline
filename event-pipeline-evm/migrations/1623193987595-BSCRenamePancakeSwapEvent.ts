import { MigrationInterface, QueryRunner } from 'typeorm';

const renameQuery = `UPDATE events_bsc.last_block_processed SET event_name = 'VIPSwapEvent' WHERE event_name = 'PancakeVIPEvent';`;
const undoRenameQuery = `UPDATE events_bsc.last_block_processed SET event_name = 'PancakeVIPEvent' WHERE event_name = 'VIPSwapEvent';`;

export class BSCRenamePancakeSwapEvent1623193987595 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(renameQuery);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(undoRenameQuery);
    }
}
