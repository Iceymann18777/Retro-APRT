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
