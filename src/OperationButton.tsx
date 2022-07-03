import { Dispatch } from "react";
import { ActionType, AppAction } from "./definitions";

export default function OperationButton({
  dispatch,
  symbol,
  operation,
}: {
  dispatch: Dispatch<AppAction>;
  symbol?: string;
  operation: string;
}) {
  return (
    <button
      onClick={() =>
        dispatch({
          type: ActionType.choose_operation,
          payload: {
            operation,
            symbol: symbol || operation,
            digit: "",
          },
        })
      }
    >
      {symbol || operation}
    </button>
  );
}
