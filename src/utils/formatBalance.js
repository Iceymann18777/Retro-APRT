export const formatNumberHumanize = (num) => {
  if (typeof num !== "number") {
    num = parseFloat(num);
  }
  num = num.toFixed(2);
  num = num.split(".");
  return num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + num[1];
};

export const formatNumberSuffix = (num, ignoreBelowThousand = false) => {
  if (typeof num !== "number") {
    num = parseFloat(num);
  }
  if (num < 1e6) {
    return formatNumberHumanize(num, ignoreBelowThousand ? 0 : 0);
  } else if (num >= 1e6 && num < 1e9) {
    num /= 1e6;
    return formatNumberHumanize(num) + "M";
  } else if (num >= 1e9 && num < 1e12) {
    num /= 1e9;
    return formatNumberHumanize(num) + "B";
  } else if (num >= 1e12 && num < 1e15) {
    num /= 1e12;
    return formatNumberHumanize(num) + "T";
  } else if (num >= 1e15) {
    num /= 1e15;
    return formatNumberHumanize(num) + "Q";
  }
  return formatNumberHumanize(num);
};

export const numFormatter = (num) => {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num.toFixed(2); // if value < 1000, nothing to do
  }
};
