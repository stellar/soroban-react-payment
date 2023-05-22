
export const truncateString = (str: string) =>
  str ? `${str.slice(0, 5)}…${str.slice(-5)}` : "";