import { expect, it } from "vitest";
import { ArithmeticOperation } from "./definitions";
import evaluate from "./evaluateMath";

type EvaluationTestCase = {
  previousOperand: string;
  currentOperand: string;
  sum: string;
  difference: string;
  product: string;
};

const zeroOperandCases: Array<EvaluationTestCase> = [
  {
    previousOperand: "",
    currentOperand: "",
    sum: "0",
    difference: "0",
    product: "0",
  },
  {
    previousOperand: "",
    currentOperand: "0",
    sum: "0",
    difference: "0",
    product: "0",
  },
  {
    previousOperand: "0",
    currentOperand: "",
    sum: "0",
    difference: "0",
    product: "0",
  },
  {
    previousOperand: "0",
    currentOperand: "0",
    sum: "0",
    difference: "0",
    product: "0",
  },
];

const oneOperandCases: Array<EvaluationTestCase> = [
  {
    previousOperand: "1",
    currentOperand: "",
    sum: "1",
    difference: "1",
    product: "0",
  },
  {
    previousOperand: "",
    currentOperand: "23",
    sum: "23",
    difference: "-23",
    product: "0",
  },
  {
    previousOperand: "",
    currentOperand: "-45",
    sum: "-45",
    difference: "45",
    product: "0",
  },
];

const positiveIntegerCases: Array<EvaluationTestCase> = [
  {
    previousOperand: "1",
    currentOperand: "1",
    sum: "2",
    difference: "0",
    product: "1",
  },
  {
    previousOperand: "1",
    currentOperand: "2",
    sum: "3",
    difference: "-1",
    product: "2",
  },
  {
    previousOperand: "2",
    currentOperand: "3",
    sum: "5",
    difference: "-1",
    product: "6",
  },
  {
    previousOperand: "3",
    currentOperand: "5",
    sum: "8",
    difference: "-2",
    product: "15",
  },
  {
    previousOperand: "5",
    currentOperand: "8",
    sum: "13",
    difference: "-3",
    product: "40",
  },
  {
    previousOperand: "13",
    currentOperand: "8",
    sum: "21",
    difference: "5",
    product: "104",
  },
  {
    previousOperand: "213149",
    currentOperand: "350174",
    sum: "563323",
    difference: "-137025",
    product: "74639237926",
  },
];

const negativeIntegerCases: Array<EvaluationTestCase> = [
  {
    previousOperand: "-1",
    currentOperand: "-1",
    sum: "-2",
    difference: "0",
    product: "1",
  },
  {
    previousOperand: "-1",
    currentOperand: "-2",
    sum: "-3",
    difference: "1",
    product: "2",
  },
  {
    previousOperand: "-2",
    currentOperand: "-3",
    sum: "-5",
    difference: "1",
    product: "6",
  },
  {
    previousOperand: "-3",
    currentOperand: "-5",
    sum: "-8",
    difference: "2",
    product: "15",
  },
  {
    previousOperand: "-5",
    currentOperand: "-8",
    sum: "-13",
    difference: "3",
    product: "40",
  },
  {
    previousOperand: "-13",
    currentOperand: "-8",
    sum: "-21",
    difference: "-5",
    product: "104",
  },
  {
    previousOperand: "-213149",
    currentOperand: "-350174",
    sum: "-563323",
    difference: "137025",
    product: "74639237926",
  },
];

const largeIntegerCases: Array<EvaluationTestCase> = [
  {
    previousOperand: "1000000000000",
    currentOperand: "1000000001000",
    sum: "2000000001000",
    difference: "-1000",
    product: "1.000000001e+24",
  },
  {
    previousOperand: "314987169384761",
    currentOperand: "174149871309",
    sum: "315161319256070",
    difference: "314813019513452",
    product: "5.485497501234231e+25",
  },
  {
    previousOperand: "143131498716",
    currentOperand: "3991464173",
    sum: "147122962889",
    difference: "139140034543",
    product: "571304249152709500000",
  },
  {
    previousOperand: "391846864",
    currentOperand: "-1283746918631",
    sum: "-1283355071767",
    difference: "1284138765495",
    product: "-503032204235220500000",
  },
  {
    previousOperand: "974125831765",
    currentOperand: "-1451451214",
    sum: "972674380551",
    difference: "975577282979",
    product: "-1.413896121104069e+21",
  },
];

const allCases = [
  ...zeroOperandCases,
  ...oneOperandCases,
  ...positiveIntegerCases,
  ...negativeIntegerCases,
  ...largeIntegerCases,
];

it("should work on all test cases", () => {
  for (const {
    previousOperand,
    currentOperand,
    sum,
    difference,
    product,
  } of allCases) {
    expect(
      evaluate({
        previousOperand,
        currentOperand,
        operation: ArithmeticOperation.addition,
      })
    ).toEqual(sum);
    expect(
      evaluate({
        previousOperand,
        currentOperand,
        operation: ArithmeticOperation.subtraction,
      })
    ).toEqual(difference);
    expect(
      evaluate({
        previousOperand,
        currentOperand,
        operation: ArithmeticOperation.multiplication,
      })
    ).toEqual(product);
  }
});
