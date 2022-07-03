import { Dispatch } from "react";
import { ActionType, AppAction } from "./definitions";

export default function DigitButton({
  dispatch,
  digit,
}: {
  dispatch: Dispatch<AppAction>;
  digit: string;
}) {
  return (
    <button
      onClick={() =>
        dispatch({
          type: ActionType.add_digit,
          payload: {
            digit,
            operation: "",
            symbol: "",
          },
        })
      }
    >
      {digit}
    </button>
  );
}
