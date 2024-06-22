import { SCHEMA } from './config';
import { logger } from './utils';
import { Connection } from 'typeorm';

export type SettlerContract = {
    address: string;
    startBlock: number;
    endBlock: number | null;
};

export class SettlerContractSingleton {
    private static instance: SettlerContractSingleton;
    private contracts: SettlerContract[];

    private constructor() {
        this.contracts = [];
    }

    static async initInstance(connection: Connection): Promise<void> {
        if (SettlerContractSingleton.instance) {
            return;
        }
        SettlerContractSingleton.instance = new SettlerContractSingleton();
        logger.info('Loading Settler contract deployments to memory');

        const settlerContracts = await connection.query(
            `
            WITH creations AS (
              SELECT "to" AS address, block_number
              FROM ${SCHEMA}.settler_erc721_transfer_events
              WHERE "to" <> '0x0000000000000000000000000000000000000000'
            ), destructions AS (
              SELECT "from" AS address, block_number
              FROM ${SCHEMA}.settler_erc721_transfer_events
            )
            SELECT
              c.address,
              c.block_number AS start_block_number,
              d.block_number AS end_block_number
            FROM creations c
            LEFT JOIN destructions d ON c.address = d.address
            ORDER BY c.block_number
            `,
        );

        const tmpSettlerContracts: SettlerContract[] = [];
        for (const entry of settlerContracts) {
            tmpSettlerContracts.push({
                address: entry['address'],
                startBlock: entry['start_block_number'],
                endBlock: entry['end_block_number'],
            });
        }

        SettlerContractSingleton.instance.addNewContracts(tmpSettlerContracts);
    }

    static getInstance(): SettlerContractSingleton {
        if (!SettlerContractSingleton.instance) {
            throw Error('Must initialize Settler Contract Singleton before use');
        }
        return SettlerContractSingleton.instance;
    }

    addNewContracts(newContracts: SettlerContract[]) {
        newContracts.forEach((entry) => this.contracts.push(entry));
    }

    getContracts() {
        return this.contracts;
    }
}
