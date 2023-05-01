// Functions to compare.
// Then run `ts-node index.ts` to see the results.
// or run in Quokka.js

type TestResult = {
  fn1: number;
  fn2: number;
  result: string;
  percentageFaster: number;
};

// Functions to compare
// START EDITING
const fn1 = (a: number, b: number) => {
  return a + b;
};
const fn2 = (a: number, b: number) => {
  return parseInt(`${a},${b}`.split(",").join(""), 10);
};

const testValues = [10, 100, 1000, 10000];
const functionNames = { fn1: "addUp", fn2: "stringAddUp" };
// STOP EDITING - see EDIT below

// Performance measuring function
const measurePerformance = (
  fn: Function,
  iterations: number,
  ...args: any[]
) => {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn(...args);
  return performance.now() - start;
};

const generateTestCases = (testValues: number[]): [number, number][] => {
  const testCases: [number, number][] = [];
  testValues.forEach((x) => testValues.forEach((y) => testCases.push([x, y])));
  return testCases;
};

const compareFunctions = (
  testCases: [number, number][],
  functionNames: Record<string, string>
): Record<string, TestResult> => {
  const comparedResults: Record<string, TestResult> = {};

  testCases.forEach(([x, y]) => {
    const key = `${x},${y}`;
    // EDIT HERE - function arguments that you need to pass
    const fn1Result = measurePerformance(fn1, x, y);
    const fn2Result = measurePerformance(fn2, x, y);
    // console.log(functionNames.fn1, x, y, fn1Result);
    // console.log(functionNames.fn2, x, y, fn2Result);

    const [winnerName, winnerTime, loserTime] =
      fn1Result < fn2Result
        ? [functionNames.fn1, fn1Result, fn2Result]
        : [functionNames.fn2, fn2Result, fn1Result];

    const calcPercentage = Math.round((winnerTime / loserTime) * 100);
    comparedResults[key] = {
      fn1: fn1Result,
      fn2: fn2Result,
      result: `${winnerName} is ${calcPercentage}% faster`,
      percentageFaster: calcPercentage,
    };
  });

  return comparedResults;
};

const printResults = (comparedResults: Record<string, TestResult>) => {
    Object.entries(comparedResults).forEach(([key, { result }]) => console.log(key, result));
  
    const winsAndImprovements = Object.values(comparedResults).reduce((acc, { result }) => {
      const winningFunction = result.includes(functionNames.fn1) ? functionNames.fn1 : functionNames.fn2;
      acc[winningFunction].wins++;
      const improvement = parseFloat(result.match(/[\d.]+/)[0]);
      acc[winningFunction].improvements.push(improvement);
      return acc;
    }, { [functionNames.fn1]: { wins: 0, improvements: [] }, [functionNames.fn2]: { wins: 0, improvements: [] } });
  
    const averageImprovement = (improvements: number[]) => improvements.length > 0 ? (improvements.reduce((a, b) => a + b) / improvements.length).toFixed(2) : 0;
  
    console.log({
      [functionNames.fn1]: { wins: winsAndImprovements[functionNames.fn1].wins, avgPerformance: averageImprovement(winsAndImprovements[functionNames.fn1].improvements) },
      [functionNames.fn2]: { wins: winsAndImprovements[functionNames.fn2].wins, avgPerformance: averageImprovement(winsAndImprovements[functionNames.fn2].improvements) }
    });
  };

// Test configurations
const testCases = generateTestCases(testValues);

// Run the comparison and print results
const comparedResults = compareFunctions(testCases, functionNames);
printResults(comparedResults);
