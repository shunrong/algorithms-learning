# 字符串匹配技巧

> 字符串匹配是最经典的算法问题之一，掌握核心模式让你在字符串题目中游刃有余

## 🎯 核心思想

字符串匹配的本质是**在文本串中高效地找到模式串**。不同算法的区别在于如何避免不必要的比较，提高匹配效率。

## 📋 技巧分类

### 1. 暴力匹配（Brute Force）

**思想**：逐个位置尝试匹配，简单直接但效率低

**模板**：
```javascript
function bruteForce(text, pattern) {
    const n = text.length, m = pattern.length;
    
    for (let i = 0; i <= n - m; i++) {
        let j = 0;
        while (j < m && text[i + j] === pattern[j]) {
            j++;
        }
        if (j === m) return i;  // 找到匹配
    }
    return -1;
}
```

**时间复杂度**：O(nm)
**适用场景**：模式串很短，或者只需要简单实现

### 2. KMP算法（Knuth-Morris-Pratt）

**思想**：利用已匹配的信息，避免回退主串指针

**核心概念**：前缀函数（部分匹配表）
```javascript
// 构建前缀函数
function buildNext(pattern) {
    const m = pattern.length;
    const next = new Array(m).fill(0);
    
    for (let i = 1, j = 0; i < m; i++) {
        while (j > 0 && pattern[i] !== pattern[j]) {
            j = next[j - 1];  // 回退到前一个可能的匹配位置
        }
        if (pattern[i] === pattern[j]) {
            j++;
        }
        next[i] = j;
    }
    return next;
}

// KMP匹配
function kmp(text, pattern) {
    const n = text.length, m = pattern.length;
    if (m === 0) return 0;
    
    const next = buildNext(pattern);
    
    for (let i = 0, j = 0; i < n; i++) {
        while (j > 0 && text[i] !== pattern[j]) {
            j = next[j - 1];  // 利用前缀信息跳跃
        }
        if (text[i] === pattern[j]) {
            j++;
        }
        if (j === m) {
            return i - m + 1;  // 找到匹配
        }
    }
    return -1;
}
```

**时间复杂度**：O(n + m)
**经典题目**：
- **实现strStr()**：找子串第一次出现的位置
- **重复的子字符串**：判断字符串是否由重复子串构成

### 3. 字符串哈希（Rolling Hash）

**思想**：将字符串转换为数值进行比较，快速判断相等性

**模板**：
```javascript
function rollingHash(text, pattern) {
    const n = text.length, m = pattern.length;
    if (m > n) return -1;
    
    const BASE = 256, MOD = 101;
    let patternHash = 0, textHash = 0;
    let power = 1;
    
    // 计算pattern的哈希值和第一个窗口的哈希值
    for (let i = 0; i < m; i++) {
        patternHash = (patternHash * BASE + pattern.charCodeAt(i)) % MOD;
        textHash = (textHash * BASE + text.charCodeAt(i)) % MOD;
        if (i < m - 1) power = (power * BASE) % MOD;
    }
    
    // 滑动窗口检查
    for (let i = 0; i <= n - m; i++) {
        if (patternHash === textHash) {
            // 哈希值相等时需要再次确认（避免哈希冲突）
            if (text.substring(i, i + m) === pattern) {
                return i;
            }
        }
        
        // 计算下一个窗口的哈希值
        if (i < n - m) {
            textHash = (textHash - text.charCodeAt(i) * power) % MOD;
            textHash = (textHash * BASE + text.charCodeAt(i + m)) % MOD;
            textHash = (textHash + MOD) % MOD;  // 确保非负
        }
    }
    return -1;
}
```

**时间复杂度**：平均O(n + m)，最坏O(nm)
**适用场景**：多模式匹配、子串比较

### 4. 双指针匹配

**思想**：用双指针技巧处理字符串匹配的特殊情况

**通配符匹配模板**：
```javascript
function isMatch(s, p) {
    let i = 0, j = 0;
    let starIdx = -1, match = 0;
    
    while (i < s.length) {
        // 字符匹配或者遇到?
        if (j < p.length && (p[j] === s[i] || p[j] === '?')) {
            i++;
            j++;
        }
        // 遇到*，记录位置
        else if (j < p.length && p[j] === '*') {
            starIdx = j;
            match = i;
            j++;
        }
        // 不匹配且之前有*，回溯
        else if (starIdx !== -1) {
            j = starIdx + 1;
            match++;
            i = match;
        }
        // 完全不匹配
        else {
            return false;
        }
    }
    
    // 处理模式串剩余的*
    while (j < p.length && p[j] === '*') {
        j++;
    }
    
    return j === p.length;
}
```

**经典题目**：
- **通配符匹配**：支持?和*的模式匹配
- **正则表达式匹配**：支持.和*的匹配

## 🧠 解题思路

### 问题识别
1. **简单子串查找** → 暴力法或KMP
2. **重复模式检测** → KMP的前缀函数
3. **通配符/正则匹配** → 双指针或动态规划
4. **多字符串匹配** → 字符串哈希或AC自动机

### 算法选择策略
```javascript
// 选择算法的决策树
function chooseAlgorithm(textLen, patternLen, patternCount) {
    if (patternLen <= 3) return "暴力法";
    if (patternCount === 1) return "KMP";
    if (patternCount > 10) return "AC自动机";
    return "字符串哈希";
}
```

## 💡 实战技巧

### 1. KMP优化技巧
```javascript
// 前缀函数的应用：检测周期
function findPeriod(s) {
    const next = buildNext(s);
    const n = s.length;
    const periodLen = n - next[n - 1];
    
    // 如果n能被周期长度整除，则存在周期
    return n % periodLen === 0 ? periodLen : n;
}
```

### 2. 字符串哈希技巧
```javascript
// 多项式哈希避免冲突
class StringHash {
    constructor(s) {
        this.s = s;
        this.n = s.length;
        this.BASE = 131;  // 常用质数
        this.MOD = 1e9 + 7;
        this.hash = new Array(this.n + 1).fill(0);
        this.power = new Array(this.n + 1).fill(1);
        
        // 预计算哈希值和幂次
        for (let i = 0; i < this.n; i++) {
            this.hash[i + 1] = (this.hash[i] * this.BASE + s.charCodeAt(i)) % this.MOD;
            this.power[i + 1] = (this.power[i] * this.BASE) % this.MOD;
        }
    }
    
    // 获取子串[l,r)的哈希值
    getHash(l, r) {
        let result = this.hash[r] - this.hash[l] * this.power[r - l];
        return (result % this.MOD + this.MOD) % this.MOD;
    }
}
```

### 3. 通配符匹配技巧
```javascript
// 处理多个*的情况
function optimizePattern(pattern) {
    let result = '';
    let lastStar = false;
    
    for (let char of pattern) {
        if (char === '*') {
            if (!lastStar) {
                result += char;
                lastStar = true;
            }
        } else {
            result += char;
            lastStar = false;
        }
    }
    return result;
}
```

## 🎯 练习题目

### 基础练习
- [28. 实现 strStr()](https://leetcode.cn/problems/implement-strstr/)
- [459. 重复的子字符串](https://leetcode.cn/problems/repeated-substring-pattern/)
- [796. 旋转字符串](https://leetcode.cn/problems/rotate-string/)

### 进阶练习
- [214. 最短回文串](https://leetcode.cn/problems/shortest-palindrome/)
- [1392. 最长快乐前缀](https://leetcode.cn/problems/longest-happy-prefix/)
- [1408. 数组中的字符串匹配](https://leetcode.cn/problems/string-matching-in-an-array/)

### 困难练习
- [44. 通配符匹配](https://leetcode.cn/problems/wildcard-matching/)
- [10. 正则表达式匹配](https://leetcode.cn/problems/regular-expression-matching/)
- [1316. 不同的循环子字符串](https://leetcode.cn/problems/distinct-echo-substrings/)

## 🔄 总结

字符串匹配的核心是**理解不同算法的适用场景**：

1. **暴力法**：实现简单，适合短模式串
2. **KMP**：最经典，处理单模式匹配最优
3. **字符串哈希**：快速比较，适合多模式或子串问题
4. **双指针**：处理通配符等特殊匹配规则

**选择策略**：先考虑问题特点，再选择最合适的算法，不要盲目使用复杂算法！
