function isPaldrome(s: string): boolean {
  if (s.length === 1) return true;
  let start = 0;
  let end = s.length - 1;
  while (start < end) {
    if (s[start] !== s[end]) return false;
    start++;
    end--;
  }
  return true;
}

function countSubstrings(s: string): number {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const substr = s.substring(i, j + 1); // 修正：应该是 j+1
      if (isPaldrome(substr)) {
        count++;
      }
    }
  }
  return count;
}

// ===== 测试用例 =====
console.log('测试用例1: "abc"');
console.log("期望输出: 3");
console.log("实际输出:", countSubstrings("abc"));
console.log("---");

console.log('测试用例2: "aaa"');
console.log("期望输出: 6");
console.log("实际输出:", countSubstrings("aaa"));
console.log("---");

console.log('测试用例3: "aba"');
console.log("期望输出: 4");
console.log("实际输出:", countSubstrings("aba"));
