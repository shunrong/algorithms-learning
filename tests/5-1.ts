/**
 * 5. 最长回文子串
 * 方法一：暴力遍历
 * @param s
 * @returns
 */

// 辅助函数：判断是否为回文，双指针法
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

function longestPalindrome(s: string): string {
  let maxLenStr = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const substr = s.substring(i, j + 1);
      if (substr.length > maxLenStr.length && isPalindrome(substr)) {
        maxLenStr = substr;
      }
    }
  }
  return maxLenStr;
}

console.log(longestPalindrome("babad"));
console.log(longestPalindrome("cbbd"));

// 让文件成为模块，避免全局作用域冲突
export {};
