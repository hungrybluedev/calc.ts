import {
  ActionType,
  AppAction,
  AppState,
  ArithmeticOperation,
  OP_MAP,
} from "./definitions";

const handleDigitAddition = (
  state: AppState,
  { payload }: AppAction
): AppState => {
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

  // Did we just finish an evaluation?
  if (state.operation === ArithmeticOperation.evaluation) {
    return {
      ...state,
      currentOperand: payload!.digit,
      operation: undefined,
    };
  } else {
    return {
      ...state,
      currentOperand: `${state.currentOperand || ""}${payload!.digit}`,
    };
  }
};

const handleChooseOperation = (state: AppState, { payload }: AppAction) => {
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
};

const handleClear = (): AppState => ({
  currentOperand: "0",
  previousOperand: "",
});

const handleDigitDeletion = (state: AppState): AppState => {
  if (state.currentOperand.length <= 1) {
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
};

const handleEvaluation = (state: AppState): AppState => ({
  currentOperand: evaluate(state),
  previousOperand: "",
  opSymbol: "",
  operation: ArithmeticOperation.evaluation,
});

export default function calculatorReducer(
  state: AppState,
  { type, payload }: AppAction
) {
  switch (type) {
    case ActionType.add_digit:
      return handleDigitAddition(state, { type, payload });

    case ActionType.choose_operation:
      return handleChooseOperation(state, { type, payload });

    case ActionType.clear:
      return handleClear();

    case ActionType.delete_digit:
      return handleDigitDeletion(state);

    case ActionType.evaluate:
      return handleEvaluation(state);

    default:
      return state;
  }
}

const evaluate = ({
  previousOperand,
  currentOperand,
  operation,
}: AppState): string => {
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
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
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
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
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
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
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
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
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
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
            operation: ArithmeticOperation.addition,
          })
        ).toEqual(currentCase[2]);
      }
    });
  });

  describe("evaluate subtraction", () => {
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
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
            operation: ArithmeticOperation.subtraction,
          })
        ).toEqual("0");
      }
    });

    it("should work with one operand", () => {
      const cases = [
        ["1", "", "1"],
        ["", "23", "-23"],
        ["", "-45", "45"],
      ];

      for (const currentCase of cases) {
        expect(
          evaluate({
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
            operation: ArithmeticOperation.subtraction,
          })
        ).toEqual(currentCase[2]);
      }
    });

    it("should work with positive integers", () => {
      const cases = [
        ["1", "1", "0"],
        ["1", "2", "-1"],
        ["2", "3", "-1"],
        ["3", "5", "-2"],
        ["5", "8", "-3"],
        ["13", "8", "5"],
        ["213149", "350174", "-137025"],
      ];

      for (const currentCase of cases) {
        expect(
          evaluate({
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
            operation: ArithmeticOperation.subtraction,
          })
        ).toEqual(currentCase[2]);
      }
    });

    it("should work with negative integers", () => {
      const cases = [
        ["-1", "-1", "0"],
        ["-1", "-2", "1"],
        ["-2", "-3", "1"],
        ["-3", "-5", "2"],
        ["-5", "-8", "3"],
        ["-13", "-8", "-5"],
        ["-213149", "-350174", "137025"],
      ];

      for (const currentCase of cases) {
        expect(
          evaluate({
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
            operation: ArithmeticOperation.subtraction,
          })
        ).toEqual(currentCase[2]);
      }
    });

    it("should work with large integers", () => {
      const cases = [
        ["7342457798196", "79879841131", "7262577957065"],
        ["798783246", "3245456167", "-2446672921"],
        ["-876139141", "-787139946", "-88999195"],
        ["5134761984618", "4138765478156", "995996506462"],
        ["974125831765", "1451451214", "972674380551"],
      ];
      for (const currentCase of cases) {
        expect(
          evaluate({
            previousOperand: currentCase[0],
            currentOperand: currentCase[1],
            operation: ArithmeticOperation.subtraction,
          })
        ).toEqual(currentCase[2]);
      }
    });

    describe("evaluate multiplication", () => {
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
              previousOperand: currentCase[0],
              currentOperand: currentCase[1],
              operation: ArithmeticOperation.multiplication,
            })
          ).toEqual("0");
        }
      });

      it("should work with one operand", () => {
        const cases = [
          ["1", "", "0"],
          ["", "23", "0"],
          ["", "-45", "0"],
        ];

        for (const currentCase of cases) {
          expect(
            evaluate({
              previousOperand: currentCase[0],
              currentOperand: currentCase[1],
              operation: ArithmeticOperation.multiplication,
            })
          ).toEqual(currentCase[2]);
        }
      });

      it("should work with positive integers", () => {
        const cases = [
          ["1", "1", "1"],
          ["1", "2", "2"],
          ["2", "3", "6"],
          ["3", "5", "15"],
          ["5", "8", "40"],
          ["13", "8", "104"],
          ["213149", "350174", "74639237926"],
        ];

        for (const currentCase of cases) {
          expect(
            evaluate({
              previousOperand: currentCase[0],
              currentOperand: currentCase[1],
              operation: ArithmeticOperation.multiplication,
            })
          ).toEqual(currentCase[2]);
        }
      });
      it("should work with negative integers", () => {
        const cases = [
          ["-1", "-1", "1"],
          ["-1", "-2", "2"],
          ["-2", "-3", "6"],
          ["-3", "5", "-15"],
          ["-3", "-5", "15"],
        ];
        for (const currentCase of cases) {
          expect(
            evaluate({
              previousOperand: currentCase[0],
              currentOperand: currentCase[1],
              operation: ArithmeticOperation.multiplication,
            })
          ).toEqual(currentCase[2]);
        }
      });

      it("should work with large integers", () => {
        const cases = [
          ["9847236", "2394761", "23581776730596"],
          ["-5687454", "6754567985", "-38416294704560190"],
          ["9813561", "3534141", "34682508286101"],
        ];
        for (const currentCase of cases) {
          expect(
            evaluate({
              previousOperand: currentCase[0],
              currentOperand: currentCase[1],
              operation: ArithmeticOperation.multiplication,
            })
          ).toEqual(currentCase[2]);
        }
      });
    });
  });
}
