export enum ProxyType {
    ERC20 = 'erc20',
    ERC721 = 'erc721',
    MultiAsset = 'multiAsset',
    StaticCall = 'staticCall',
    ERC1155 = 'erc1155',
    ERC20Bridge = 'erc20Bridge',
}

export type EventName = 
    'fill' |
    'stakingPoolCreated';
