import random from "lodash/random";

//# 10+ nodes balanced, US/EU
const REACT_APP_NODE_1 = "https://bsc-dataseed1.ninicoin.io";

//# 10+ nodes balanced, US/EU
const REACT_APP_NODE_2 = "https://bsc-dataseed1.defibit.io";

//# 10+ nodes balanced in each region, global
const REACT_APP_NODE_3 = "https://bsc-dataseed.binance.org";

// Array of available nodes to connect to
export const nodes = [REACT_APP_NODE_1, REACT_APP_NODE_2, REACT_APP_NODE_3];

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
};

export default getNodeUrl;
