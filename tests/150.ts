function evalRPN(tokens: string[]): number {
  // 用栈记录运算对象
  const stack: number[] = [];
  const operators = new Set("+-*/");
  for (const token of tokens) {
    if (operators.has(token)) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      let result = 0;
      switch (token) {
        case "+":
          result = a + b;
          break;
        case "-":
          result = a - b;
          break;
        case "*":
          result = a * b;
          break;
        case "/":
          result = Math.trunc(a / b);
          break;
      }
      stack.push(result);
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}

console.log(evalRPN(["2", "1", "+", "3", "*"]));
console.log(evalRPN(["4", "13", "5", "/", "+"]));
console.log(
  evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"])
);
