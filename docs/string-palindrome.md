# 字符串回文问题

> 回文是字符串问题中的经典类型，掌握中心扩展和动态规划是解决回文问题的关键

## 🎯 核心思想

回文字符串的特点是**正读和反读相同**。解决回文问题的核心是理解回文的**对称性**，常用的技巧包括中心扩展、动态规划和哈希判断。

## 📋 基础模式

### 1. 回文判断

**简单判断**：
```javascript
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
```

**忽略大小写和非字母数字字符**：
```javascript
function isPalindrome(s) {
    // 预处理：只保留字母和数字，转为小写
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let left = 0, right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
```

**经典题目**：
- **[125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)**
- **[680. 验证回文字符串 Ⅱ](https://leetcode.cn/problems/valid-palindrome-ii/)**

### 2. 中心扩展法

**核心思想**：从每个可能的回文中心向两侧扩展

```javascript
function expandAroundCenter(s, left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return right - left - 1;  // 回文长度
}

function longestPalindrome(s) {
    if (!s || s.length < 1) return "";
    
    let start = 0, maxLen = 0;
    
    for (let i = 0; i < s.length; i++) {
        // 奇数长度回文（以i为中心）
        const len1 = expandAroundCenter(s, i, i);
        // 偶数长度回文（以i和i+1为中心）
        const len2 = expandAroundCenter(s, i, i + 1);
        
        const currentMaxLen = Math.max(len1, len2);
        
        if (currentMaxLen > maxLen) {
            maxLen = currentMaxLen;
            start = i - Math.floor((currentMaxLen - 1) / 2);
        }
    }
    
    return s.substring(start, start + maxLen);
}
```

**回文子串计数**：
```javascript
function countSubstrings(s) {
    let count = 0;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;  // 每扩展一次就是一个回文子串
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);      // 奇数长度
        expandAroundCenter(i, i + 1);  // 偶数长度
    }
    
    return count;
}
```

**经典题目**：
- **[5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)**
- **[647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)**

### 3. 动态规划法

**状态定义**：`dp[i][j]` = 字符串从i到j是否为回文

```javascript
function longestPalindromeDP(s) {
    const n = s.length;
    if (n === 0) return "";
    
    const dp = Array(n).fill().map(() => Array(n).fill(false));
    let start = 0, maxLen = 1;
    
    // 单个字符都是回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // 检查长度为2的子串
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            maxLen = 2;
        }
    }
    
    // 检查长度大于2的子串
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                if (len > maxLen) {
                    start = i;
                    maxLen = len;
                }
            }
        }
    }
    
    return s.substring(start, start + maxLen);
}
```

**回文子串计数（DP版）**：
```javascript
function countSubstringsDP(s) {
    const n = s.length;
    const dp = Array(n).fill().map(() => Array(n).fill(false));
    let count = 0;
    
    // 按长度遍历
    for (let len = 1; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (len === 1) {
                dp[i][j] = true;
            } else if (len === 2) {
                dp[i][j] = (s[i] === s[j]);
            } else {
                dp[i][j] = (s[i] === s[j]) && dp[i + 1][j - 1];
            }
            
            if (dp[i][j]) count++;
        }
    }
    
    return count;
}
```

### 4. Manacher算法（马拉车算法）

**最优解法**：O(n)时间找到最长回文子串

```javascript
function manacher(s) {
    // 预处理：插入特殊字符，统一奇偶长度
    let processed = '#';
    for (let char of s) {
        processed += char + '#';
    }
    
    const n = processed.length;
    const P = new Array(n).fill(0);  // P[i] = 以i为中心的回文半径
    let center = 0, right = 0;       // 当前回文的中心和右边界
    let maxLen = 0, centerIndex = 0;
    
    for (let i = 0; i < n; i++) {
        // 利用对称性初始化P[i]
        if (i < right) {
            P[i] = Math.min(right - i, P[2 * center - i]);
        }
        
        // 尝试扩展
        try {
            while (i + P[i] + 1 < n && i - P[i] - 1 >= 0 && 
                   processed[i + P[i] + 1] === processed[i - P[i] - 1]) {
                P[i]++;
            }
        } catch (e) {
            // 边界处理
        }
        
        // 更新center和right
        if (i + P[i] > right) {
            center = i;
            right = i + P[i];
        }
        
        // 更新最长回文
        if (P[i] > maxLen) {
            maxLen = P[i];
            centerIndex = i;
        }
    }
    
    // 还原到原字符串的位置
    const start = Math.floor((centerIndex - maxLen) / 2);
    return s.substring(start, start + maxLen);
}
```

## 🧠 回文变形问题

### 1. 回文分割

**问题**：将字符串分割成所有子串都是回文

```javascript
function partition(s) {
    const result = [];
    const path = [];
    
    // 预计算所有子串是否为回文
    const n = s.length;
    const isPalindrome = Array(n).fill().map(() => Array(n).fill(false));
    
    for (let len = 1; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (len === 1) {
                isPalindrome[i][j] = true;
            } else if (len === 2) {
                isPalindrome[i][j] = (s[i] === s[j]);
            } else {
                isPalindrome[i][j] = (s[i] === s[j]) && isPalindrome[i + 1][j - 1];
            }
        }
    }
    
    function backtrack(start) {
        if (start === s.length) {
            result.push([...path]);
            return;
        }
        
        for (let end = start; end < s.length; end++) {
            if (isPalindrome[start][end]) {
                path.push(s.substring(start, end + 1));
                backtrack(end + 1);
                path.pop();
            }
        }
    }
    
    backtrack(0);
    return result;
}
```

### 2. 最少回文分割

```javascript
function minCut(s) {
    const n = s.length;
    
    // dp[i] = s[0...i-1]的最少分割次数
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = -1;  // 空字符串需要-1次分割（这样dp[i] = dp[j] + 1就对了）
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (isPalindrome(s, j, i - 1)) {
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }
    
    return dp[n];
    
    function isPalindrome(str, left, right) {
        while (left < right) {
            if (str[left] !== str[right]) return false;
            left++;
            right--;
        }
        return true;
    }
}
```

### 3. 最长回文子序列

**注意**：子序列不要求连续

```javascript
function longestPalindromeSubseq(s) {
    const n = s.length;
    // dp[i][j] = s[i...j]的最长回文子序列长度
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    
    // 单个字符的回文长度为1
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    
    // 按子串长度遍历
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[0][n - 1];
}
```

## 💡 实战技巧

### 1. 预处理技巧
```javascript
// 忽略大小写和特殊字符
function normalizeString(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Manacher预处理：统一奇偶长度
function preprocess(s) {
    let result = '^#';  // 开始标记
    for (let char of s) {
        result += char + '#';
    }
    result += '$';  // 结束标记
    return result;
}
```

### 2. 边界优化
```javascript
function expandAroundCenterOptimized(s, left, right) {
    // 边界检查优化
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return [left + 1, right - 1];  // 返回实际回文的边界
}
```

### 3. 空间优化
```javascript
// 只需要知道是否为回文，不需要存储所有状态
function isPalindromeOptimized(s, left, right) {
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
}
```

## 🎯 练习题目

### 基础练习
- **[125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)**
- **[9. 回文数](https://leetcode.cn/problems/palindrome-number/)**
- **[234. 回文链表](https://leetcode.cn/problems/palindrome-linked-list/)**

### 进阶练习
- **[5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)**
- **[647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)**
- **[131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)**

### 困难练习
- **[132. 分割回文串 II](https://leetcode.cn/problems/palindrome-partitioning-ii/)**
- **[516. 最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/)**
- **[214. 最短回文串](https://leetcode.cn/problems/shortest-palindrome/)**

## 🔄 总结

回文问题的解法选择：

1. **简单判断**：双指针法，O(n)时间，O(1)空间
2. **最长回文子串**：
   - 中心扩展：O(n²)时间，容易理解
   - 动态规划：O(n²)时间和空间，便于扩展
   - Manacher：O(n)时间，最优解
3. **回文计数**：中心扩展或动态规划
4. **回文分割**：动态规划 + 回溯

**选择策略**：
- 单次判断 → 双指针
- 查找最长 → 中心扩展（简单）或Manacher（最优）
- 计数问题 → 中心扩展或DP
- 分割问题 → DP + 回溯

掌握这些模式，回文问题就能迎刃而解！
