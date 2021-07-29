const axios = require("axios");

export async function getPCSPrice(token) {
  const resPancakeSwap = await axios.get(
    `https://api.pancakeswap.info/api/v2/tokens/${token}`
  );
  const dataPancakeSwap = resPancakeSwap.data;
  if (dataPancakeSwap?.data?.price) {
    return parseFloat(dataPancakeSwap.data.price);
  }
}

export async function getDEXGuruPrice(token) {
  const resDexGuru = await axios.get(`https://api.dex.guru/v1/tokens/${token}`);
  const dataDexGuru = resDexGuru.data;
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
    const geckoprice = await getGeckoPrice(token);
    if (geckoprice) {
      return geckoprice;
    }
  } catch (error) {
    console.log("Fallo coingecko");
  }
  // try pancake swap api
  try {
    const Pcsprice = await getPCSPrice(token);
    if (Pcsprice) {
      return Pcsprice;
    }
  } catch (error) {
    console.log("PCS fallo");
  }
  // try dexguru api
  try {
    const dexprice = await getDEXGuruPrice(token);
    if (dexprice) {
      return dexprice;
    }
  } catch (error) {
    console.log("Fallo dexguru");
  }

  return 0;
}
