export type AssetsMap = {
  [key: string]: {
    id: number
    name: string
    address: string
    symbol: string
  }
}

export const assetsMap: AssetsMap = {
  ETH: {
    id: 1,
    name: "ETH",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    symbol: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },
  DAI: {
    id: 2,
    name: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
  },
  USDC: {
    id: 3,
    name: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    symbol: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
  },
  Optimism: {
    id: 4,
    name: "Optimism",
    address: "0x4200000000000000000000000000000000000042",
    symbol: "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png",
  },
  LINK: {
    id: 5,
    name: "LINK",
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    symbol: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
  },
  MATIC: {
    id: 6,
    name: "MATIC",
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    symbol: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  },
  Arbitrum: {
    id: 7,
    name: "Arbitrum",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    symbol: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
  },
}
