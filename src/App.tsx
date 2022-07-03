import { useReducer } from "react";

import "./App.css";

import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

import calculatorReducer from "./logic";
import { ActionType } from "./definitions";

function App() {
  const [{ currentOperand, previousOperand, opSymbol, operation }, dispatch] =
    useReducer(calculatorReducer, {
      currentOperand: "0",
      previousOperand: "",
      opSymbol: "",
    });

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {opSymbol}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
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
      <OperationButton operation="/" symbol="&#247;" dispatch={dispatch} />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton operation="*" symbol="&#215;" dispatch={dispatch} />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button
        className="span-two"
        onClick={() =>
          dispatch({
            type: ActionType.evaluate,
          })
        }
      >
        =
      </button>
    </div>
  );
}

export default App;
