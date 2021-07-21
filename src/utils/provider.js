const BSCmain = [
  {
    chainId: `0x38`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "bnb",
      decimals: 18
    },
    rpcUrls: [
      "https://bsc-mainnet.web3api.com/v1/CE5C7S3SSA4NNUV5WKFDX4I5R5TSWTI3SP"
    ],
    blockExplorerUrls: ["https://bscscan.com/"]
  }
];

const BSCTest = [
  {
    chainId: `0x${parseInt(process.env.REACT_APP_CHAIN_ID_MAIN, 10).toString(
      16
    )}`,
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "bnb",
      decimals: 18
    },
    rpcUrls: ["https://data-seed-prebsc-2-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com"]
  }
];

export default { BSCmain, BSCTest };
