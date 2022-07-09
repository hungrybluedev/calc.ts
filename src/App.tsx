import { Dispatch, useReducer } from "react";

import "./App.css";

import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

import calculatorReducer from "./stateLogic";
import { ActionType, AppAction } from "./definitions";
import { formatNumber } from "./format";

const CalculatorOutput = ({
  currentOperand,
  previousOperand,
  opSymbol,
}: {
  currentOperand: string;
  previousOperand: string;
  opSymbol?: string;
}) => (
  <div className="output">
    <div className="previous-operand">
      {formatNumber(previousOperand)} {opSymbol}
    </div>
    <div className="current-operand">{formatNumber(currentOperand)}</div>
  </div>
);

const CalculatorFooter = () => (
  <div className="footer">
    <p>
      Made with ❤️ by Subhomoy Haldar (
      <a href="https://hungrybluedev.in/">@hungrybluedev</a>)
    </p>
    <p>&copy; 2022</p>
  </div>
);

const CalculatorButtons = (dispatch: Dispatch<AppAction>) => [
  <OperationButton operation="/" symbol="&#247;" dispatch={dispatch} />,
  <DigitButton dispatch={dispatch} digit="1" />,
  <DigitButton dispatch={dispatch} digit="2" />,
  <DigitButton dispatch={dispatch} digit="3" />,
  <OperationButton operation="*" symbol="&#215;" dispatch={dispatch} />,
  <DigitButton dispatch={dispatch} digit="4" />,
  <DigitButton dispatch={dispatch} digit="5" />,
  <DigitButton dispatch={dispatch} digit="6" />,
  <OperationButton operation="+" dispatch={dispatch} />,
  <DigitButton dispatch={dispatch} digit="7" />,
  <DigitButton dispatch={dispatch} digit="8" />,
  <DigitButton dispatch={dispatch} digit="9" />,
  <OperationButton operation="-" dispatch={dispatch} />,
  <DigitButton dispatch={dispatch} digit="." />,
  <DigitButton dispatch={dispatch} digit="0" />,
  <button
    className="span-two"
    onClick={() =>
      dispatch({
        type: ActionType.evaluate,
      })
    }
  >
    =
  </button>,
];

const App = () => {
  const [{ currentOperand, previousOperand, opSymbol }, dispatch] = useReducer(
    calculatorReducer,
    {
      currentOperand: "0",
      previousOperand: "",
      opSymbol: "",
    }
  );

  return (
    <div className="calculator-grid">
      <CalculatorOutput
        currentOperand={currentOperand}
        previousOperand={previousOperand}
        opSymbol={opSymbol}
      />
      <button
        className="span-two"
        onClick={() =>
          dispatch({
            type: ActionType.clear,
          })
        }
      >
        AC
      </button>
      <button
        onClick={() =>
          dispatch({
            type: ActionType.delete_digit,
          })
        }
      >
        DEL
      </button>
      {CalculatorButtons(dispatch)}
      <CalculatorFooter />
    </div>
  );
};

export default App;
