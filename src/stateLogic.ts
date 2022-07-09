import {
  ActionType,
  AppAction,
  AppPayload,
  AppState,
  ArithmeticOperation,
  OP_MAP,
} from "./definitions";
import evaluate from "./evaluateMath";

const handleDecimalPoint = (state: AppState): AppState => {
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
};

const handleZeroDigit = (state: AppState, digit: string): AppState => {
  if (digit === "0") {
    // Do not add extra zeros if we already have a zero in the current operand
    return state;
  } else {
    // Replace the existing zero with the digit
    return {
      ...state,
      currentOperand: digit,
    };
  }
};

const handleRegularDigit = (state: AppState, digit: string) => {
  // Did we just finish an evaluation?
  if (state.operation === ArithmeticOperation.evaluation) {
    return {
      ...state,
      currentOperand: digit,
      operation: undefined,
    };
  } else {
    return {
      ...state,
      currentOperand: `${state.currentOperand || ""}${digit}`,
    };
  }
};

const handleDigitAddition = (
  state: AppState,
  { payload }: AppAction
): AppState => {
  // Handle decimal point first
  if (payload!.digit === ".") {
    return handleDecimalPoint(state);
  }

  // Handle zero digit
  if (state.currentOperand === "0") {
    return handleZeroDigit(state, payload!.digit);
  }

  // We now have a regular digit
  return handleRegularDigit(state, payload!.digit);
};

const handlePreviousOperandAbsent = (
  state: AppState,
  currentOperandAbsent: boolean,
  payload?: AppPayload
): AppState =>
  currentOperandAbsent
    ? {
        ...state,
        opSymbol: payload!.symbol,
        operation: OP_MAP.get(payload!.operation),
      }
    : {
        ...state,
        previousOperand: evaluate(state),
        opSymbol: payload!.symbol,
        operation: OP_MAP.get(payload!.operation),
        currentOperand: "0",
      };

const handlePreviousOperandPresent = (
  state: AppState,
  currentOperandAbsent: boolean,
  payload?: AppPayload
): AppState =>
  currentOperandAbsent
    ? state
    : {
        ...state,
        previousOperand: state.currentOperand,
        currentOperand: "0",
        opSymbol: payload!.symbol,
        operation: OP_MAP.get(payload!.operation),
      };

const handleChooseOperation = (state: AppState, { payload }: AppAction) => {
  const currentOperandAbsent =
    !state.currentOperand || state.currentOperand === "0";

  return state.previousOperand
    ? handlePreviousOperandAbsent(state, currentOperandAbsent, payload)
    : handlePreviousOperandPresent(state, currentOperandAbsent, payload);
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
