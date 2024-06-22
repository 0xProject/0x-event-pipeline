import { SCHEMA } from './config';
import { logger } from './utils';
import { Connection } from 'typeorm';

export type SettlerContract = {
    address: string;
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
            SELECT "to" AS address
            FROM ${SCHEMA}.settler_erc721_transfer_events
            WHERE "to" <> '0x0000000000000000000000000000000000000000'
            ORDER BY block_number
            `,
        );

        const tmpSettlerContracts: SettlerContract[] = [];
        for (const entry of settlerContracts) {
            tmpSettlerContracts.push({
                address: entry['address'],
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

    static isInitialized(): Boolean {
        return SettlerContractSingleton.instance?;
    }

    addNewContracts(newContracts: SettlerContract[]) {
        newContracts.forEach((entry) => this.contracts.push(entry));
    }

    getContracts() {
        return this.contracts;
    }
}
