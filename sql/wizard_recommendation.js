// params
const poolInfo = {
    1: {
        operatorShare: 0.05,
        zrxStaked: 700,
        protocolFees: 100,
    },
    2: {
        operatorShare: 0.10,
        zrxStaked: 200,
        protocolFees: 200,
    },
    3: {
        operatorShare: 0.10,
        zrxStaked: 200,
        protocolFees: 200,
    },
};

const zrxToStake = 10000;
const numIterations = 3;
const alpha = 2/3;

// Function to get staking recommendation
function getRecommendation(poolInfo, zrxToStake, numIterations, alpha) {
    var poolInfoMutable = poolInfo;

    stakingDecisions = {};
    for (i = 0; i < numIterations; i++) {
        console.log(`starting iteration ${i}`)
        // calculate totals
        totalStake = Object.values(poolInfoMutable).reduce((sum, obj) => sum + obj['zrxStaked'],0);
        totalProtocolFees = Object.values(poolInfoMutable).reduce((sum, obj) => sum + obj['protocolFees'],0);

        adjustedStakeRatios = {};

        // rank pools according to return on marginal ZRX
        for (pool in poolInfoMutable) {
            console.log(`calculating stats for pool ${pool} in iteration ${i}`)
            // Stake ratio -- the pool's share of fees relative to the pool's share of stake
            stakeRatio = (poolInfoMutable[pool].zrxStaked / totalStake) / (poolInfoMutable[pool].protocolFees / totalProtocolFees);

            console.log(stakeRatio);

            // Adjusted stake ratio, taking into account operator share
            adjStakeRatio = Math.pow(((1 - alpha) / (1 - poolInfoMutable[pool].operatorShare)),(1 / alpha)) * stakeRatio;

            console.log(adjStakeRatio);

            adjustedStakeRatios[pool] = adjStakeRatio;
        };

        // Find minimum adjusted stake ratio
        bestPool = Object.keys(adjustedStakeRatios).reduce((a,b) => adjustedStakeRatios[a] < adjustedStakeRatios[b] ? a : b,undefined);

        // stake in best pool
        stakingDecisions[bestPool]= bestPool in stakingDecisions ? stakingDecisions[bestPool] = stakingDecisions[bestPool] + (zrxToStake / numIterations) : (zrxToStake / numIterations);

        // Add stake to pool info for next iteration
        poolInfoMutable[bestPool].zrxStaked = poolInfoMutable[bestPool].zrxStaked + (zrxToStake / numIterations);
    };

    return stakingDecisions;
};

console.log(getRecommendation(poolInfo, zrxToStake, numIterations, alpha));
