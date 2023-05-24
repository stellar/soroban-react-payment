import BigNumber from "bignumber.js";

export const truncateString = (str: string) =>
  str ? `${str.slice(0, 5)}…${str.slice(-5)}` : "";

export const stroopToXlm = (
  stroops: BigNumber | string | number,
): BigNumber => {
  if (stroops instanceof BigNumber) {
    return stroops.dividedBy(1e7);
  }
  return new BigNumber(Number(stroops) / 1e7);
};
