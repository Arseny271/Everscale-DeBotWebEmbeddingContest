const hexToString = (hex: string): string => {
  return Buffer.from(hex, "hex").toString("utf8");
}

const stringToHex = (str: string): string => {
  let hex, i;

  let result = "";
  for (i = 0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += `0${hex}`.slice(-2);
  }

  return result

  /*let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;*/
}

const BinUtils = {
  hexToString, stringToHex
}

export { BinUtils }
