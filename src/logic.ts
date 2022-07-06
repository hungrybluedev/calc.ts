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

const evaluate = ({
  currentOperand,
  previousOperand,
  operation,
}: AppState): string => {
  // Take care of the trivial edge cases
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

///////////////////////
// Inline unit tests //
///////////////////////
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("evaluate addition", () => {
    it("should work with zero operands", () => {
      const cases = [
        ["", ""],
        ["0", "0"],
        ["0", ""],
        ["", "0"],
      ];
      for (const currentCase of cases) {
        expect(
          evaluate({
            currentOperand: currentCase[0],
            previousOperand: currentCase[1],
            operation: ArithmeticOperation.addition,
          })
        ).toEqual("0");
      }
    });

    it("should work with one operand", () => {
      const cases = [
        ["1", "", "1"],
        ["", "23", "23"],
        ["", "-45", "-45"],
      ];

      for (const currentCase of cases) {
        expect(
          evaluate({
            currentOperand: currentCase[0],
            previousOperand: currentCase[1],
            operation: ArithmeticOperation.addition,
          })
        ).toEqual(currentCase[2]);
      }
    });

    it("should work with positive integers", () => {
      const cases = [
        ["1", "1", "2"],
        ["1", "2", "3"],
        ["2", "3", "5"],
        ["3", "5", "8"],
        ["5", "8", "13"],
        ["13", "8", "21"],
        ["213149", "350174", "563323"],
      ];

      for (const currentCase of cases) {
        expect(
          evaluate({
            currentOperand: currentCase[0],
            previousOperand: currentCase[1],
            operation: ArithmeticOperation.addition,
          })
        ).toEqual(currentCase[2]);
      }
    });

    it("should work with negative integers", () => {
      const cases = [
        ["-1", "-1", "-2"],
        ["-1", "-2", "-3"],
        ["-2", "-3", "-5"],
        ["-3", "-5", "-8"],
        ["-5", "-8", "-13"],
        ["-13", "-8", "-21"],
        ["-213149", "-350174", "-563323"],
      ];

      for (const currentCase of cases) {
        expect(
          evaluate({
            currentOperand: currentCase[0],
            previousOperand: currentCase[1],
            operation: ArithmeticOperation.addition,
          })
        ).toEqual(currentCase[2]);
      }
    });

    it("should work with large integers", () => {
      const cases = [
        ["1000000000000", "1000000001000", "2000000001000"],
        ["314987169384761", "174149871309", "315161319256070"],
        ["143131498716", "3991464173", "147122962889"],
        ["391846864", "-1283746918631", "-1283355071767"],
        ["974125831765", "-1451451214", "972674380551"],
      ];

      for (const currentCase of cases) {
        expect(
          evaluate({
            currentOperand: currentCase[0],
            previousOperand: currentCase[1],
            operation: ArithmeticOperation.addition,
          })
        ).toEqual(currentCase[2]);
      }
    });
  });
}
