const axios = require("axios");

export async function getPCSPrice(token) {
  let resPancakeSwap = await axios.get(
    `https://api.pancakeswap.info/api/v2/tokens/${token}`
  );
  let dataPancakeSwap = resPancakeSwap.data;
  if (dataPancakeSwap?.data?.price) {
    return parseFloat(dataPancakeSwap.data.price);
  }
}

export async function getDEXGuruPrice(token) {
  let resDexGuru = await axios.get(`https://api.dex.guru/v1/tokens/${token}`);
  let dataDexGuru = resDexGuru.data;
  if (dataDexGuru?.priceUSD) {
    return dataDexGuru.priceUSD;
  }
}

export async function getGeckoPrice(token) {
  const resCoinGecko = await axios.get(
    `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${token}&vs_currencies=usd`
  );
  const dataCoinGecko = resCoinGecko.data;
  if (dataCoinGecko?.[token]?.usd) {
    return dataCoinGecko[token].usd;
  }
}

export async function tryFetchPrice(token) {
  // try coingecko
  try {
    const resCoinGecko = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${token}&vs_currencies=usd`
    );
    const dataCoinGecko = resCoinGecko.data;
    if (dataCoinGecko?.[token]?.usd) {
      return dataCoinGecko[token].usd;
    }
  } catch (error) {
    console.log("Fallo coingecko");
  }
  // try dexguru api
  try {
    let resDexGuru = await axios.get(`https://api.dex.guru/v1/tokens/${token}`);
    let dataDexGuru = resDexGuru.data;
    if (dataDexGuru?.priceUSD) {
      return dataDexGuru.priceUSD;
    }
  } catch (error) {
    console.log("Fallo dexguru");
  }
  // try pancake swap api
  try {
    let resPancakeSwap = await axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/${token}`
    );
    let dataPancakeSwap = resPancakeSwap.data;
    if (dataPancakeSwap?.data?.price) {
      return parseFloat(dataPancakeSwap.data.price);
    }
  } catch (error) {
    console.log("esto chingo su madre");
  }

  return 0;
}
