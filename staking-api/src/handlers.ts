import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { logger } from './logger';

import { QueryRunner } from './query_runner';
import { schemaValidator, schemas } from './schemas';
import {
    Epoch,
    EpochWithFees,
    StakingDelegatorResponse,
    StakingEpochsResponse,
    StakingEpochsWithFeesResponse,
    StakingPoolResponse,
    StakingPoolRewardsResponse,
    StakingPoolsResponse,
    StakingStatsResponse,
} from './types';

export class Handlers {
    private readonly _db: QueryRunner;
    public async getStakingPoolsAsync(_req: express.Request, res: express.Response): Promise<void> {
        const stakingPools = await this._db.getStakingPoolsWithStatsAsync();
        const response: StakingPoolsResponse = {
            stakingPools,
        };
        res.status(HttpStatus.OK).send(response);
    }
    public async getStakingPoolByIdAsync(req: express.Request, res: express.Response): Promise<void> {
        const poolId = req.params.id;
        const pool = await this._db.getStakingPoolWithStatsAsync(poolId);
        const allTimeStats = await this._db.getStakingPoolAllTimeRewardsAsync(poolId);

        const response: StakingPoolResponse = {
            poolId,
            stakingPool: {
                ...pool,
                allTimeStats,
            },
        };

        res.status(HttpStatus.OK).send(response);
    }
    public async getStakingPoolRewardsByIdAsync(req: express.Request, res: express.Response): Promise<void> {
        const poolId = req.params.id;
        const epochRewards = await this._db.getStakingPoolEpochRewardsAsync(poolId);

        const response: StakingPoolRewardsResponse = {
            poolId,
            stakingPoolRewards: {
                epochRewards,
            },
        };

        res.status(HttpStatus.OK).send(response);
    }
    public async getStakingEpochNAsync(req: express.Request, res: express.Response): Promise<void> {
        // optional query string to include fees
        schemaValidator.validate(req.query, schemas.stakingEpochRequestSchema as any);
        const isWithFees = req.query.withFees ? req.query.withFees === 'true' : false;

        const n = Number(req.params.n);

        let response: Epoch | EpochWithFees;
        if (isWithFees) {
            const epoch = await this._db.getEpochNWithFeesAsync(n);
            response = epoch;
        } else {
            const epoch = await this._db.getEpochNAsync(n);
            response = epoch;
        }
        res.status(HttpStatus.OK).send(response);
    }
    public async getStakingEpochsAsync(req: express.Request, res: express.Response): Promise<void> {
        // optional query string to include fees
        schemaValidator.validate(req.query, schemas.stakingEpochRequestSchema as any);
        const isWithFees = req.query.withFees ? req.query.withFees === 'true' : false;

        let response: StakingEpochsResponse | StakingEpochsWithFeesResponse;
        if (isWithFees) {
            const currentEpoch = await this._db.getCurrentEpochWithFeesAsync();
            const nextEpoch = await this._db.getNextEpochWithFeesAsync();
            response = {
                currentEpoch,
                nextEpoch,
            };
        } else {
            const currentEpoch = await this._db.getCurrentEpochAsync();
            const nextEpoch = await this._db.getNextEpochAsync();
            response = {
                currentEpoch,
                nextEpoch,
            };
        }
        res.status(HttpStatus.OK).send(response);
    }
    public async getStakingStatsAsync(_req: express.Request, res: express.Response): Promise<void> {
        const allTimeStakingStats = await this._db.getAllTimeStakingStatsAsync();
        const response: StakingStatsResponse = {
            allTime: allTimeStakingStats,
        };
        res.status(HttpStatus.OK).send(response);
    }

    public async getDelegatorAsync(req: express.Request, res: express.Response): Promise<void> {
        const delegatorAddress = req.params.id;
        const normalizedAddress = delegatorAddress && delegatorAddress.toLowerCase();

        const forCurrentEpoch = await this._db.getDelegatorCurrentEpochAsync(normalizedAddress);
        const forNextEpoch = await this._db.getDelegatorNextEpochAsync(normalizedAddress);
        const allTime = await this._db.getDelegatorAllTimeStatsAsync(normalizedAddress);

        const response: StakingDelegatorResponse = {
            delegatorAddress,
            forCurrentEpoch,
            forNextEpoch,
            allTime,
        };

        res.status(HttpStatus.OK).send(response);
    }

    public async getDelegatorEventsAsync(req: express.Request, res: express.Response): Promise<void> {
        const delegatorAddress = req.params.id;
        const normalizedAddress = delegatorAddress && delegatorAddress.toLowerCase();

        const delegatorEvents = await this._db.getDelegatorEventsAsync(normalizedAddress);

        const response = delegatorEvents;

        res.status(HttpStatus.OK).send(response);
    }

    constructor(db: QueryRunner) {
        this._db = db;
    }
}
