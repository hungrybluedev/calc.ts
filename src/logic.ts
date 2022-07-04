import {
  ActionType,
  AppAction,
  AppState,
  ArithmeticOperation,
  OP_MAP,
} from "./definitions";

export default function calculatorReducer(
  state: AppState,
  { type, payload }: AppAction
) {
  switch (type) {
    case ActionType.add_digit:
      // Handle decimal point first
      if (payload!.digit === ".") {
        if (state.currentOperand.includes(".")) {
          // Do not add extra decimals if we already have a decimal in the current operand
          return state;
        } else {
          // Add the decimal to the current operand
          return {
            ...state,
            currentOperand: `${state.currentOperand}.`,
          };
        }
      }

      // Handle zero digit
      if (state.currentOperand === "0") {
        if (payload!.digit === "0") {
          // Do not add extra zeros if we already have a zero in the current operand
          return state;
        } else {
          // Replace the existing zero with the digit
          return {
            ...state,
            currentOperand: payload!.digit,
          };
        }
      }

      // We now have a regular digit

      // Did we just finish a
      if (state.operation === ArithmeticOperation.evaluation) {
        return {
          ...state,
          currentOperand: payload!.digit,
          operation: undefined,
        };
      } else
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload!.digit}`,
        };

    case ActionType.choose_operation:
      if (
        !state.previousOperand &&
        (!state.currentOperand || state.currentOperand === "0")
      ) {
        // Do not allow operations on empty operands
        return state;
      }

      if (
        state.previousOperand &&
        (!state.currentOperand || state.currentOperand === "0")
      ) {
        // Replace the previous operation with the new operation
        return {
          ...state,
          opSymbol: payload!.symbol,
          operation: OP_MAP.get(payload!.operation),
        };
      }

      if (!state.previousOperand) {
        // We have a current operand and no previous operand

        return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: "0",
          opSymbol: payload!.symbol,
          operation: OP_MAP.get(payload!.operation),
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        opSymbol: payload!.symbol,
        operation: OP_MAP.get(payload!.operation),
        currentOperand: "0",
      };

    case ActionType.clear:
      return {
        currentOperand: "0",
        previousOperand: "",
      };

    case ActionType.delete_digit:
      if (state.currentOperand.length === 1) {
        // We have a single digit, so clear the current operand
        return {
          ...state,
          currentOperand: "0",
        };
      }

      // We have multiple digits, so remove the last digit
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ActionType.evaluate:
      // Evaluate the current operands
      return {
        currentOperand: evaluate(state),
        previousOperand: "",
        opSymbol: "",
        operation: ArithmeticOperation.evaluation,
      };

    default:
      return state;
  }
}

const evaluate = (state: AppState): string => {
  const { currentOperand, previousOperand, operation } = state;

  if (!previousOperand && currentOperand) {
    return currentOperand;
  }

  if (!currentOperand && previousOperand) {
    return previousOperand;
  }

  if (!currentOperand && !previousOperand) {
    return "0";
  }

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
};
