import { SCHEMA } from './config';
import { logger } from './utils';
import { Connection } from 'typeorm';

export class SettlerContractSingleton {
    private static instance: SettlerContractSingleton;
    private contracts: string[];

    private constructor() {
        this.contracts = [];
    }

    static async initInstance(connection: Connection): Promise<void> {
        if (SettlerContractSingleton.instance) {
            return;
        }
        logger.info('Loading Settler contract deployments to memory');
        SettlerContractSingleton.instance = new SettlerContractSingleton();
        const settlerContracts = await connection.query(
            `
            SELECT "to" AS address
            FROM ${SCHEMA}.settler_erc721_transfer_events
            WHERE "to" <> '0x0000000000000000000000000000000000000000'
            ORDER BY block_number
            `,
        );
        settlerContracts.forEach((entry: any) => SettlerContractSingleton.instance.addNewContract(entry['address']));
    }

    static getInstance(): SettlerContractSingleton {
        if (!SettlerContractSingleton.instance) {
            throw Error('Must initialize Settler Contract Singleton before use');
        }
        return SettlerContractSingleton.instance;
    }

    static isInitialized(): Boolean {
        return !!SettlerContractSingleton.instance;
    }

    addNewContract(newContractAddress: string) {
        if (newContractAddress === '0x0000000000000000000000000000000000000000' || newContractAddress === '') {
            return;
        }
        this.contracts.push(newContractAddress);
    }

    getContracts() {
        return this.contracts;
    }
}
