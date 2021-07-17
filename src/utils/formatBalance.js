export const formatNumberHumanize = (num, decimals) => {
  if (typeof num !== "number") {
    num = parseFloat(num);
  }
  num = num.toFixed(decimals);
  if (decimals == 0) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    num = num.split(".");
    return num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + num[1];
  }
};
