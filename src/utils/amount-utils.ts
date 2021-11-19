
function split(amount: string, decimals: number): string [] {
  return [
    amount.padStart(decimals + 1, "0").slice(0, -decimals),
    amount.padStart(decimals + 1, "0").slice(-decimals)
  ]
}

function print(amount: string, decimals: number): string {
  const [whole, fractional] = split(amount, decimals);
  const fractionalTrimmed = fractional.replace(/0+$/g, "");

  return `${whole}${fractionalTrimmed.length>0?`.${fractionalTrimmed}`:""}`
}

function normalize(amount: string, decimals: number): string {
  const prepared = `${amount}.0`.split(".").map(s => s || "");
  return [prepared[0], prepared[1].slice(0, decimals).padEnd(decimals, "0")].join("");
}

function compare(amount1: string, amount2: string, decimals: number): number {
  const normalizedAmount1 = normalize(amount1, decimals);
  const normalizedAmount2 = normalize(amount2, decimals);
  const length = Math.max(normalizedAmount1.length, normalizedAmount2.length);

  const comparedAmount1 = normalizedAmount1.padStart(length, "0");
  const comparedAmount2 = normalizedAmount2.padStart(length, "0");

  if (comparedAmount1 === comparedAmount2) return 0;
  if (comparedAmount1 < comparedAmount2) return -1;
  else return 1;
}

const AmountUtils = {
  split, print, compare, normalize
}

export { AmountUtils }
