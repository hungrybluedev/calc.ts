export enum ArithmeticOperation {
  addition,
  subtraction,
  multiplication,
  division,
  evaluation,
}

export const OP_MAP: Map<string, ArithmeticOperation> = new Map([
  ["+", ArithmeticOperation.addition],
  ["-", ArithmeticOperation.subtraction],
  ["*", ArithmeticOperation.multiplication],
  ["/", ArithmeticOperation.division],
]);

export interface AppState {
  currentOperand: string;
  previousOperand: string;
  opSymbol?: string;
  operation?: ArithmeticOperation;
}

export enum ActionType {
  add_digit,
  choose_operation,
  clear,
  delete_digit,
  evaluate,
}

export interface AppAction {
  type: ActionType;
  payload?: {
    digit: string;
    operation: string;
    symbol: string;
  };
}
