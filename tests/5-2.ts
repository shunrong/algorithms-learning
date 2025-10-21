/**
 * 5. 最长回文子串
 * 方法二：中心扩展法
 * @param s
 * @returns
 */

// 辅助函数：中心扩展法，返回以left和right为中心的回文子串的长度
function expandAroundCenter(s: string, left: number, right: number): number {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  return right - left - 1;
}

function longestPalindrome(s: string): string {
  let maxLenStr = "";
  for (let i = 0; i < s.length; i++) {
    // 奇数长度回文
    const len1 = expandAroundCenter(s, i, i);
    // 偶数长度回文
    const len2 = expandAroundCenter(s, i, i + 1);
    // 当前最长回文长度
    const currentMaxLen = Math.max(len1, len2);
    if (currentMaxLen > maxLenStr.length) {
      const start = i - Math.floor((currentMaxLen - 1) / 2);
      maxLenStr = s.substring(start, start + currentMaxLen);
    }
  }
  return maxLenStr;
}

console.log(longestPalindrome("babad"));
console.log(longestPalindrome("cbbd"));

export {};
