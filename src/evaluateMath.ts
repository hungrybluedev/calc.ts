import { AppState, ArithmeticOperation } from "./definitions";

export default function evaluate({
  previousOperand,
  currentOperand,
  operation,
}: AppState): string {
  if (!currentOperand && !previousOperand) {
    return "0";
  }

  previousOperand = previousOperand || "0";
  currentOperand = currentOperand || "0";

  switch (operation) {
    case ArithmeticOperation.addition:
      return (
        parseFloat(previousOperand) + parseFloat(currentOperand)
      ).toString();
    case ArithmeticOperation.subtraction:
      return (
        parseFloat(previousOperand) - parseFloat(currentOperand)
      ).toString();
    case ArithmeticOperation.multiplication:
      return (
        parseFloat(previousOperand) * parseFloat(currentOperand)
      ).toString();
    case ArithmeticOperation.division:
      return (
        parseFloat(previousOperand) / parseFloat(currentOperand)
      ).toString();
    default:
      return "";
  }
}
