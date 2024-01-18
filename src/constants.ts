export type ScraperMode = 'BLOCKS' | 'EVENTS';

export * from './abis';

export const DEFAULT_SCRAPER_MODE: ScraperMode = 'EVENTS';
export const DEFAULT_LOCAL_POSTGRES_URI = 'postgresql://user:password@localhost/events';
export const DEFAULT_MAX_BLOCKS_REORG = 35;
export const DEFAULT_BLOCKS_REORG_CHECK_INCREMENT = 35;
export const DEFAULT_MAX_BLOCKS_TO_PULL = 120;
export const DEFAULT_MAX_BLOCKS_TO_SEARCH = 120;
export const DEFAULT_MAX_TX_TO_PULL = 1000;
export const DEFAULT_BLOCK_FINALITY_THRESHOLD = 10;
export const DEFAULT_RESCRAPE_BLOCKS = 0;
export const DEFAULT_MINUTES_BETWEEN_RUNS = 3;
export const DEFAULT_STAKING_POOLS_JSON_URL =
    'https://raw.githubusercontent.com/0xProject/0x-staking-pool-registry/master/staking_pools.json';
export const DEFAULT_STAKING_POOLS_METADATA_JSON_URL =
    'https://raw.githubusercontent.com/0xProject/0x-staking-pool-registry/master/pool_metadata.json';
export const DEFAULT_BASE_GITHUB_LOGO_URL = 'https://github.com/0xProject/0x-staking-pool-registry/raw/master/logos/';
export const DEFAULT_FEAT_CANCEL_EVENTS = false;
export const DEFAULT_FEAT_ERC20_BRIDGE_TRANSFER_FLASHWALLET = false;
export const DEFAULT_FEAT_TOKENS_FROM_TRANSFERS = false;
export const DEFAULT_FEAT_FILL_EVENT = false;
export const DEFAULT_FEAT_LIMIT_ORDERS = false;
export const DEFAULT_FEAT_META_TRANSACTION_EXECUTED_EVENT = false;
export const DEFAULT_FEAT_NFT = false;
export const DEFAULT_FEAT_OTC_ORDERS = false;
export const DEFAULT_FEAT_PLP_SWAP_EVENT = false;
export const DEFAULT_FEAT_POLYGON_RFQM_PAYMENTS = false;
export const DEFAULT_FEAT_RFQ_EVENT = false;
export const DEFAULT_FEAT_SOCKET_BRIDGE_EVENT = false;
export const DEFAULT_FEAT_STAKING = false;
export const DEFAULT_FEAT_TRANSFORMED_ERC20_EVENT = false;
export const DEFAULT_FEAT_UNISWAP_V2_PAIR_CREATED_EVENT = false;
export const DEFAULT_FEAT_UNISWAP_V2_SYNC_EVENT = false;
export const DEFAULT_FEAT_UNISWAP_V2_VIP_SWAP_EVENT = false;
export const DEFAULT_FEAT_UNISWAP_V3_VIP_SWAP_EVENT = false;
export const DEFAULT_FEAT_UNISWAP_V3_SWAP_EVENT = false;
export const DEFAULT_FEAT_UNISWAP_V3_POOL_CREATED_EVENT = false;
export const DEFAULT_FEAT_V3_CANCEL_EVENTS = false;
export const DEFAULT_FEAT_V3_FILL_EVENT = false;
export const DEFAULT_FEAT_V3_NATIVE_FILL = false;
export const DEFAULT_FEAT_VIP_SWAP_EVENT = false;
export const DEFAULT_MAX_TIME_TO_SEARCH = 360;
export const DEFAULT_METRICS_PATH = '/metrics';
export const DEFAULT_PROMETHEUS_PORT = 3000;
export const DEFAULT_ENABLE_PROMETHEUS_METRICS = false;
export const DEFAULT_FEAT_ONCHAIN_GOVERNANCE = false;
export const DEFAULT_FEAT_WRAP_UNWRAP_NATIVE_EVENT = false;
export const DEFAULT_FEAT_WRAP_UNWRAP_NATIVE_TRANSFER_EVENT = false;

export const BRIDGEFILL_EVENT_TOPIC = ['0xe59e71a14fe90157eedc866c4f8c767d3943d6b6b2e8cd64dddcc92ab4c55af8'];
export const TRANSFORMEDERC20_EVENT_TOPIC = ['0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3'];
export const LIQUIDITYPROVIDERSWAP_EVENT_TOPIC = ['0x40a6ba9513d09e3488135e0e0d10e2d4382b792720155b144cbea89ac9db6d34'];
export const RFQ_ORDER_FILLED_EVENT_TOPIC = ['0x829fa99d94dc4636925b38632e625736a614c154d55006b7ab6bea979c210c32'];
export const LIMITORDERFILLED_EVENT_TOPIC = ['0xab614d2b738543c0ea21f56347cf696a3a0c42a7cbec3212a5ca22a4dcff2124'];
export const DEFAULT_EP_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
export const DEFAULT_STAKING_PROXY_ADDRESS = '0xa26e80e7dea86279c6d778d702cc413e6cffa777';
export const V4_CANCEL_EVENT_TOPIC = ['0xa6eb7cdc219e1518ced964e9a34e61d68a94e4f1569db3e84256ba981ba52753'];
export const EXPIRED_RFQ_ORDER_EVENT_TOPIC = ['0xd9ee00a67daf7d99c37893015dc900862c9a02650ef2d318697e502e5fb8bbe2'];
export const OTC_ORDER_FILLED_EVENT_TOPIC = ['0xac75f773e3a92f1a02b12134d65e1f47f8a14eabe4eaf1e24624918e6a8b269f'];

export const UNISWAP_V2_PAIR_CREATED_TOPIC = ['0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9'];
export const UNISWAP_V2_SYNC_TOPIC = ['0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1'];

export const V3_EXCHANGE_ADDRESS = '0x61935cbdd02287b511119ddb11aeb42f1593b7ef';
export const V3_DEPLOYMENT_BLOCK = 8952139;

export const UNISWAP_V2_SWAP_EVENT_TOPIC_0 = '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822';
export const UNISWAP_V3_SWAP_EVENT_TOPIC_0 = '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67';
export const UNISWAP_V3_POOL_CREATED_TOPIC_0 = '0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118';
export const V3_FILL_EVENT_TOPIC = ['0x6869791f0a34781b29882982cc39e882768cf2c96995c2a110c577c53bc932d5'];

export const ERC721_ORDER_FILLED_EVENT_TOPIC = ['0x50273fa02273cceea9cf085b42de5c8af60624140168bd71357db833535877af'];
export const ERC721_ORDER_PRESIGNED_EVENT_TOPIC = [
    '0x8c5d0c41fb16a7317a6c55ff7ba93d9d74f79e434fefa694e50d6028afbfa3f0',
];
export const ERC721_ORDER_CANCELLED_EVENT_TOPIC = [
    '0xa015ad2dc32f266993958a0fd9884c746b971b254206f3478bc43e2f125c7b9e',
];

export const ERC1155_ORDER_FILLED_EVENT_TOPIC = ['0x20cca81b0e269b265b3229d6b537da91ef475ca0ef55caed7dd30731700ba98d'];
export const ERC1155_ORDER_PRESIGNED_EVENT_TOPIC = [
    '0x5e91ddfeb7bf2e12f7e8ab017d2b63a9217f004a15a53346ad90353ec63d14e4',
];
export const ERC1155_ORDER_CANCELLED_EVENT_TOPIC = [
    '0x81b6de71b4c5058b59a7b56dc73297dd4820029a7229cf7b8e9680d73ff9bab0',
];

export const ERC165_SUPPORTS_INTERFACE_SELECTOR = '01ffc9a7';
export const ERC165_ERC721_INTERFACE = '80ac58cd';
export const ERC165_ERC1155_INTERFACE = 'd9b67a26';

export const LOG_TRANSFER_EVENT_TOPIC_0 = '0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4';
export const POLYGON_MATIC_ADDRESS = '0x0000000000000000000000000000000000001010';
export const META_TRANSACTION_EXECUTED_EVENT_TOPIC = [
    '0x7f4fe3ff8ae440e1570c558da08440b26f89fb1c1f2910cd91ca6452955f121a',
];

export const ZEROEX_PROTOCOL_GOVERNOR_CONTRACT_ADDRESS = '0xc256035fe8533f9ce362012a6ae0aefed4df30f4';
export const PROTOCOL_ZEROEX_TIMELOCK_CONTRACT_ADDRESS = '0xb6a1f58c5df9f13312639cddda0d128bf28cdd87';
export const ZEROEX_TREASURY_GOVERNOR_CONTRACT_ADDRESS = '0x4822cfc1e7699bdb9551bdfd3a838ee414bc2008';
export const TREASURY_ZEROEX_TIMELOCK_CONTRACT_ADDRESS = '0x0dcfb77a581bc8fe432e904643a5480cc183f38d';
export const ONCHAIN_GOVERNANCE_CALL_SCHEDULED_EVENT_TOPIC = [
    '0x4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca',
];
export const ONCHAIN_GOVERNANCE_PROPOSAL_CREATED_EVENT_TOPIC = [
    '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0',
];

export const SOCKET_BRIDGE_CONTRACT_ADDRESS = '0x3a23f943181408eac424116af7b7790c94cb97a5';
export const SOCKET_BRIDGE_EVENT_TOPIC = ['0x74594da9e31ee4068e17809037db37db496702bf7d8d63afe6f97949277d1609'];
export const SOCKET_BRIDGE_MATCHA_METADATA = '0x0000000000000000000000000000000000000000000000000000000000000932';

export const WRAP_NATIVE_EVENT_TOPIC = ['0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c'];
export const UNWRAP_NATIVE_EVENT_TOPIC = ['0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65'];
export const TRANSFER_EVENT_TOPIC_0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export const ZEROEX_API_AFFILIATE_SELECTOR = '869584cd';

export const V3_CANCEL_EVENT_TOPIC = ['0x02c310a9a43963ff31a754a4099cc435ed498049687539d72d7818d9b093415c'];
export const V3_CANCEL_UP_TO_EVENT_TOPIC = ['0x82af639571738f4ebd4268fb0363d8957ebe1bbb9e78dba5ebd69eed39b154f0'];

export const STAKING_CONTRACT = '0xa26e80e7Dea86279c6d778D702Cc413E6CFfA777';
export const STAKING_TRANSACTION_EXECUTION_TOPIC = [
    '0xa4a7329f1dd821363067e07d359e347b4af9b1efe4b6cccf13240228af3c800d',
];
export const STAKING_STAKE_EVENT_TOPIC = ['0xebedb8b3c678666e7f36970bc8f57abf6d8fa2e828c0da91ea5b75bf68ed101a'];
export const STAKING_UNSTAKE_EVENT_TOPIC = ['0x85082129d87b2fe11527cb1b3b7a520aeb5aa6913f88a3d8757fe40d1db02fdd'];
export const STAKING_MOVE_STAKE_TOPIC = ['0x7d3ad1dcf03b9027064d1d9a474a69e0cecc31324c541d3eb9b5e6fa2f106c8d'];
export const STAKING_STAKING_POOL_CREATED_TOPIC = [
    '0xcec6fc86ea644053f6edff1160dfe3fa5c61e7a5ef9f873f145bb03a0bd319e7',
];
export const STAKING_STAKING_POOL_EARNED_REWARDS_IN_EPOCH_TOPIC = [
    '0x14b098103235344975b17508c2391721cc9ac3f3fa2b56c7ff46f8480dfd074f',
];

export const STAKING_MAKER_STAKING_POOL_SET_TOPIC = [
    '0x5640833634fce74eb9211d1209a91dd5a1c8c6a751696bff9323b4db67f81513',
];

export const STAKING_PARAMS_SET_TOPIC = ['0x613157dbb0e920deab8ad6ddd3805e87cbf57344b9fe780f1764790ec7897542'];

export const STAKING_OPERATOR_SHARE_DECREASED_TOPIC = [
    '0x8ea2a7a959bd25f226b7b0a4393613f7fdcaa8404e8bad96aa52dc1c14590167',
];

export const STAKING_EPOCH_ENDED_TOPIC = ['0xbb4a26fa0ace13ee4da343896c20eaa44a618fb9071fdd8c2e2c960a4583189d'];

export const STAKING_EPOCH_FINALIZED_TOPIC = ['0xb463d19ecf455be65365092cf8e1db6934a0334cf8cd532ddf9964d01f36b5b2'];

export const STAKING_REWARDS_PAID_TOPIC = ['0xf1116b309178aa62dcb6bf8c3b8bc2321724907c7ebf52192d14c8ce3aa9194c'];
