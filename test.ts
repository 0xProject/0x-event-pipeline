import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
});

publicClient.getBlock().then((block) => {
    console.log(block);
});
