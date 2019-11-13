export enum ProxyType {
    ERC20 = 'erc20',
    ERC721 = 'erc721',
    MultiAsset = 'multiAsset',
    StaticCall = 'staticCall',
    ERC1155 = 'erc1155',
}

export type EventName = 
    'fill' |
    'stakingPoolCreated';
