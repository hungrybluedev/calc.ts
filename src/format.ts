export const formatNumber = (numberString: string): string => {
  if (!numberString) {
    return "";
  }
  const temporary = parseFloat(numberString).toPrecision(12);
  let lastUsefulDigit = temporary.length - 1;
  while (lastUsefulDigit >= 0 && temporary[lastUsefulDigit] === "0") {
    lastUsefulDigit--;
  }
  return lastUsefulDigit === temporary.length - 1
    ? temporary
    : temporary.slice(0, lastUsefulDigit + 1);
};
