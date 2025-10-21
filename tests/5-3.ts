/**
 * 5. 最长回文子串
 * 方法三：动态规划
 * 状态定义：dp[i][j] = s[i...j]是否为回文
 * 转移方程：dp[i][j] = s[i] === s[j] && dp[i + 1][j - 1]
 * @param s
 * @returns
 */

function longestPalindrome(s: string): string {
  const n = s.length;
  if (n === 0) return "";
  const dp = Array(n)
    .fill(false)
    .map(() => Array(n).fill(false));
  let maxLen = 1;
  let start = 0;
  // 单个字符都是回文
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
      maxLen = 2;
      start = i;
    }
  }
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
        maxLen = len;
        start = i;
      }
    }
  }
  return s.substring(start, start + maxLen);
}

export {};
