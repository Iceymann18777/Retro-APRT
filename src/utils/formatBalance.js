export const formatNumberHumanize = (num) => {
  if (typeof num !== "number") {
    num = parseFloat(num);
  }
  num = num.toFixed(2);
  num = num.split(".");
  return num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + num[1];
};
