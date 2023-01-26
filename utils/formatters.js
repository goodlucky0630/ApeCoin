const bigDecimal = require("js-big-decimal");
export const emailRegex = new RegExp(
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/
);

export const getEllipsisTxt = (str, n = 5) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
};

export const dollarFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const numberFormatterCompact = Intl.NumberFormat("en-US", {
  notation: "compact",
});

export const numberFormatter = Intl.NumberFormat("en-US");

export const roundToHundreths = (num) => {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
};

export const roundToSixDecimals = (num) => {
  return Math.round((Number(num) + Number.EPSILON) * 1000000) / 1000000;
};

export const roundToNineDecimals = (num) => {
  return Math.round((Number(num) + Number.EPSILON) * 1000000000) / 1000000000;
};

export const removeDecimalPoint = (stringWithDecimal) => {
  let numberAsString = stringWithDecimal.split(".");
  numberAsString = numberAsString[0]; //essentially rounding
  return numberAsString;
};

export const blockTimestampToDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US");
};

export const toFourDecimals = (num) => {
  return parseFloat(num) / 10000;
};

export const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatAmount = (amount, decimal = 4, usd = false) => {
  let numberAsString = String(amount).split(".");
  let decimals = numberAsString[1];

  if (decimals?.length > decimal) {
    decimals = decimals.slice(0, decimal);
    if (Number(decimals) === 0 && Number(numberAsString[0]) === 0) {
      if (usd) {
        return "$<0." + decimals.slice(0, decimals.length - 1) + "1";
      }
      return "<0." + decimals.slice(0, decimals.length - 1) + "1";
    }
  }

  if (usd) {
    return (
      "$" +
      bigDecimal.getPrettyValue(parseFloat(numberAsString[0] + "." + decimals))
    );
  }

  return bigDecimal.getPrettyValue(
    parseFloat(numberAsString[0] + "." + decimals)
  );
};

export const getSecondsFromExpiry = (expire) =>
  Math.round(expire - new Date().getTime() / 1000);

export const timestampToDate = (timestamp) => {
  const timestampToMilli = timestamp * 1000;
  const date = new Date(timestampToMilli);
  const offset = date.getTimezoneOffset();
  const fullDate = new Date(date.getTime() - offset * 60 * 1000);
  return fullDate.toISOString().split("T")[0];
};

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) /
      parseFloat(value24HoursAgo)) *
    100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
};

export const roundNum = (num = 0, percision = 2) => {
  return parseFloat(bigDecimal.round(num, percision));
};

export const scientificNotationToNumber = (x) => {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
      x = x.split(".");
      x = x[0].concat(".", x[1].slice(0, 18));
    }
  } else {
    let e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};
