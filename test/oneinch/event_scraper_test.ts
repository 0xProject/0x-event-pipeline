import {LogPullInfo} from "../../src/data_sources/web3";
import {RawLogEntry} from "ethereum-types";
import {parse1InchSwappedEvent} from '../../src/parsers/events/oneinch_swapped_events';
import {OneInchSwappedEvent} from "../../src/entities";


var assert = require('assert');
var dev_utils_1 = require("@0x/dev-utils");
var web3_1 = require("../../src/data_sources/web3");
const ETHEREUM_RPC_URL = "https://eth-mainnet.alchemyapi.io/v2/PpNY1vg_UeexZa3tVAmYq3dadrRCXa7s"
var provider = dev_utils_1.web3Factory.getRpcProvider({
    rpcUrl: ETHEREUM_RPC_URL,
});
var web3Source = new web3_1.Web3Source(provider, ETHEREUM_RPC_URL);

describe('PullAndSaveEventsByTopic', function () {

    // 1inch swapped event topic
    const ONEINCH_SWAPPED_EVENT_TOPIC = ['0x76af224a143865a50b41496e1a73622698692c565c1214bc862f18e22d829c5e'];

    // 1inch contract address
    const ONEINCH_CONTRACT_ADDRESS = '0x111111125434b319222cdbf8c261674adb56f3ae';

    const logPullInfo: LogPullInfo = {
        address: ONEINCH_CONTRACT_ADDRESS,
        fromBlock: 11600000,
        toBlock: 11600000,
        topics: ONEINCH_SWAPPED_EVENT_TOPIC
    };

    describe('#getParseSaveEventsByTopic', function () {

        describe('#parse1InchSwappedEvent', function () {

            it('should parse an event correctly', async function () {

                const rawLogsArray = await web3Source.getBatchLogInfoForContractsAsync([logPullInfo]);

                assert.equal(rawLogsArray.length, 1);

                var parsedLog: OneInchSwappedEvent = rawLogsArray[0].logs.map((encodedLog: RawLogEntry) =>
                    parse1InchSwappedEvent(encodedLog))[0];

                assert.equal(parsedLog.sender, '0x89de85b9d70ecd99e382af131a06eeb556b23162');
                assert.equal(parsedLog.dstReceiver, '0x89de85b9d70ecd99e382af131a06eeb556b23162');
                assert.equal(parsedLog.minReturnAmount.toString(), "18231457953");
                assert.equal(parsedLog.spentAmount.toString(), "10000000000000000000");
                assert.equal(parsedLog.dstToken, "0xdac17f958d2ee523a2206206994597c13d831ec7");
                assert.equal(parsedLog.srcToken, "0x4b4d2e899658fb59b1d518b68fe836b100ee8958");
                assert.equal(parsedLog.amount.toString(), "10000000000000000000");
                assert.equal(parsedLog.guaranteedAmount.toString(), "18892702543");
                assert.equal(parsedLog.referrer, "0x0000000000000000000000000000000000000000");
                assert.equal(parsedLog.returnAmount.toString(), "18783751023");
                assert.equal(parsedLog.contractAddress, "0x111111125434b319222cdbf8c261674adb56f3ae");
            });
        });
    });
});