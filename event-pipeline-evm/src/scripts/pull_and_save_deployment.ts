import 'reflect-metadata';
import { web3Factory } from '@0x/dev-utils';
import { logger } from '../utils/logger';
import { Connection } from 'typeorm';
import { Web3Source } from '../data_sources/events/web3';

import { StakingProxyDeployment } from '../entities';

import { ETHEREUM_RPC_URL, STAKING_PROXY_DEPLOYMENT_TRANSACTION } from '../config';

const provider = web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
const web3Source = new Web3Source(provider, ETHEREUM_RPC_URL);

export class DeploymentScraper {
    public async getParseSaveStakingProxyContractDeployment(connection: Connection): Promise<void> {
        logger.info(`pulling deployment info for transaction ${STAKING_PROXY_DEPLOYMENT_TRANSACTION}`);
        const deploymentTxInfo = await web3Source.getTransactionInfoAsync(STAKING_PROXY_DEPLOYMENT_TRANSACTION!);
        const deploymentBlockInfo = await web3Source.getBlockInfoAsync(Number(deploymentTxInfo.blockNumber));

        const stakingProxyDeployment = new StakingProxyDeployment();

        stakingProxyDeployment.observedTimestamp = new Date().getTime();
        stakingProxyDeployment.transactionHash = deploymentTxInfo.hash;
        stakingProxyDeployment.transactionIndex = Number(deploymentTxInfo.transactionIndex);
        stakingProxyDeployment.blockHash = String(deploymentBlockInfo.hash);
        stakingProxyDeployment.blockNumber = Number(deploymentBlockInfo.number);
        stakingProxyDeployment.blockTimestamp = Number(deploymentBlockInfo.timestamp);

        logger.info(`finished pulling staking proxy deployment info`);

        await this._deleteAndSaveDeploymentAsync(connection, stakingProxyDeployment);
    }

    private async _deleteAndSaveDeploymentAsync(
        connection: Connection,
        stakingProxyDeployment: StakingProxyDeployment,
    ): Promise<void> {
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            // delete any previous entry and overwrite
            await queryRunner.manager.query(`DELETE FROM events.staking_proxy_deployment WHERE TRUE`);
            await queryRunner.manager.save(stakingProxyDeployment);

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            logger.error(err);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
