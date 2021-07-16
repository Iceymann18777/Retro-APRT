import BigNumber from "bignumber.js";
export const formatNumberHumanize = (num: BigNumber) => {
  if (typeof num !== "number") {
    num = parseFloat(num);
  }
  num = num.toFixed(3);
  num = num.split(".");
  return num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + num[1];
};
