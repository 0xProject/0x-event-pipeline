import * as express from 'express';
import * as asyncHandler from 'express-async-handler';

import { Handlers } from './handlers';
import { QueryRunner } from './query_runner';

// tslint:disable-next-line:completed-docs
export function createStakingRouter(db: QueryRunner): express.Router {
    const router = express.Router();
    const handlers = new Handlers(db);
    router.get('/', (_, res) => {
        res.send({ message: 'This is the root of the 0x Staking API.' });
    });
    router.get('/pools/:id', asyncHandler(handlers.getStakingPoolByIdAsync.bind(handlers)));
    router.get('/pools/rewards/:id', asyncHandler(handlers.getStakingPoolRewardsByIdAsync.bind(handlers)));
    router.get('/pools', asyncHandler(handlers.getStakingPoolsAsync.bind(handlers)));
    router.get('/epochs/:n', asyncHandler(handlers.getStakingEpochNAsync.bind(handlers)));
    router.get('/epochs', asyncHandler(handlers.getStakingEpochsAsync.bind(handlers)));
    router.get('/stats', asyncHandler(handlers.getStakingStatsAsync.bind(handlers)));
    router.get('/delegator/:id', asyncHandler(handlers.getDelegatorAsync.bind(handlers)));
    router.get('/delegator/events/:id', asyncHandler(handlers.getDelegatorEventsAsync.bind(handlers)));
    return router;
}
