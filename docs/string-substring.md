# 字符串子串问题

> 子串问题是字符串算法的重要分支，滑动窗口是解决子串问题的核心技巧

## 🎯 核心思想

子串问题的关键是**维护一个可变大小的窗口**，通过移动窗口的左右边界来找到满足条件的子串。核心是理解何时扩大窗口、何时收缩窗口。

## 📋 基础模式

### 1. 固定长度子串

**长度为K的子串中字符种类数**：
```javascript
function numKLenSubstrNoRepeats(s, k) {
    if (s.length < k) return 0;
    
    const charCount = new Map();
    let count = 0;
    
    // 初始化窗口
    for (let i = 0; i < k; i++) {
        charCount.set(s[i], (charCount.get(s[i]) || 0) + 1);
    }
    
    if (charCount.size === k) count++;
    
    // 滑动窗口
    for (let i = k; i < s.length; i++) {
        // 添加新字符
        const newChar = s[i];
        charCount.set(newChar, (charCount.get(newChar) || 0) + 1);
        
        // 移除旧字符
        const oldChar = s[i - k];
        charCount.set(oldChar, charCount.get(oldChar) - 1);
        if (charCount.get(oldChar) === 0) {
            charCount.delete(oldChar);
        }
        
        if (charCount.size === k) count++;
    }
    
    return count;
}
```

**子数组的平均数**：
```javascript
function findMaxAverage(nums, k) {
    let sum = 0;
    
    // 初始化窗口
    for (let i = 0; i < k; i++) {
        sum += nums[i];
    }
    
    let maxSum = sum;
    
    // 滑动窗口
    for (let i = k; i < nums.length; i++) {
        sum = sum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, sum);
    }
    
    return maxSum / k;
}
```

**经典题目**：
- **[643. 子数组最大平均数 I](https://leetcode.cn/problems/maximum-average-subarray-i/)**
- **[1456. 定长子串中元音的最大数目](https://leetcode.cn/problems/maximum-number-of-vowels-in-a-substring-of-given-length/)**

### 2. 可变长度子串

**无重复字符的最长子串**：
```javascript
function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLen = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        // 如果字符重复，收缩窗口
        while (charSet.has(char)) {
            charSet.delete(s[left]);
            left++;
        }
        
        charSet.add(char);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}

// 优化版本：使用哈希表记录位置
function lengthOfLongestSubstringOptimized(s) {
    const charIndexMap = new Map();
    let left = 0;
    let maxLen = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        if (charIndexMap.has(char) && charIndexMap.get(char) >= left) {
            left = charIndexMap.get(char) + 1;
        }
        
        charIndexMap.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
```

**至多包含K个不同字符的最长子串**：
```javascript
function lengthOfLongestSubstringKDistinct(s, k) {
    if (k === 0) return 0;
    
    const charCount = new Map();
    let left = 0;
    let maxLen = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        charCount.set(char, (charCount.get(char) || 0) + 1);
        
        // 如果不同字符数超过k，收缩窗口
        while (charCount.size > k) {
            const leftChar = s[left];
            charCount.set(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
            }
            left++;
        }
        
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
```

**经典题目**：
- **[3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)**
- **[340. 至多包含 K 个不同字符的最长子串](https://leetcode.cn/problems/longest-substring-with-at-most-k-distinct-characters/)**
- **[159. 至多包含两个不同字符的最长子串](https://leetcode.cn/problems/longest-substring-with-at-most-two-distinct-characters/)**

### 3. 条件约束子串

**最小覆盖子串**：
```javascript
function minWindow(s, t) {
    const need = new Map();
    const window = new Map();
    
    // 统计t中字符的需求
    for (let char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    let left = 0, right = 0;
    let valid = 0;  // 窗口中满足需求的字符种类数
    let start = 0, len = Infinity;
    
    while (right < s.length) {
        const c = s[right];
        right++;
        
        if (need.has(c)) {
            window.set(c, (window.get(c) || 0) + 1);
            if (window.get(c) === need.get(c)) {
                valid++;
            }
        }
        
        // 当窗口满足条件时，尝试收缩
        while (valid === need.size) {
            // 更新最小覆盖子串
            if (right - left < len) {
                start = left;
                len = right - left;
            }
            
            const d = s[left];
            left++;
            
            if (need.has(d)) {
                if (window.get(d) === need.get(d)) {
                    valid--;
                }
                window.set(d, window.get(d) - 1);
            }
        }
    }
    
    return len === Infinity ? "" : s.substring(start, start + len);
}
```

**字符串的排列**：
```javascript
function checkInclusion(s1, s2) {
    const need = new Map();
    const window = new Map();
    
    for (let char of s1) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    let left = 0, right = 0;
    let valid = 0;
    
    while (right < s2.length) {
        const c = s2[right];
        right++;
        
        if (need.has(c)) {
            window.set(c, (window.get(c) || 0) + 1);
            if (window.get(c) === need.get(c)) {
                valid++;
            }
        }
        
        // 窗口长度等于s1长度时，检查是否匹配
        while (right - left >= s1.length) {
            if (valid === need.size) {
                return true;
            }
            
            const d = s2[left];
            left++;
            
            if (need.has(d)) {
                if (window.get(d) === need.get(d)) {
                    valid--;
                }
                window.set(d, window.get(d) - 1);
            }
        }
    }
    
    return false;
}
```

**经典题目**：
- **[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)**
- **[567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/)**
- **[438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)**

## 🧠 滑动窗口通用模板

### 基础模板

```javascript
function slidingWindowTemplate(s, condition) {
    const window = new Map();  // 窗口状态
    let left = 0, right = 0;
    let result = initResult;
    
    while (right < s.length) {
        // 扩大窗口
        const c = s[right];
        right++;
        updateWindow(window, c);
        
        // 判断是否需要收缩窗口
        while (needShrink(window, condition)) {
            // 更新结果
            result = updateResult(result, window, left, right);
            
            // 收缩窗口
            const d = s[left];
            left++;
            updateWindow(window, d, false);  // 移除操作
        }
    }
    
    return result;
}
```

### 不同问题的模板变化

```javascript
// 1. 最长子串问题
function longestSubstring(s, condition) {
    let left = 0, maxLen = 0;
    const window = new Map();
    
    for (let right = 0; right < s.length; right++) {
        // 扩大窗口
        window.set(s[right], (window.get(s[right]) || 0) + 1);
        
        // 收缩窗口直到满足条件
        while (!isValid(window, condition)) {
            window.set(s[left], window.get(s[left]) - 1);
            if (window.get(s[left]) === 0) window.delete(s[left]);
            left++;
        }
        
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}

// 2. 最短子串问题
function shortestSubstring(s, condition) {
    let left = 0, minLen = Infinity, start = 0;
    const window = new Map();
    
    for (let right = 0; right < s.length; right++) {
        // 扩大窗口
        window.set(s[right], (window.get(s[right]) || 0) + 1);
        
        // 收缩窗口直到不满足条件
        while (isValid(window, condition)) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                start = left;
            }
            
            window.set(s[left], window.get(s[left]) - 1);
            if (window.get(s[left]) === 0) window.delete(s[left]);
            left++;
        }
    }
    
    return minLen === Infinity ? "" : s.substring(start, start + minLen);
}

// 3. 子串计数问题
function countSubstrings(s, condition) {
    let count = 0;
    const window = new Map();
    
    for (let right = 0; right < s.length; right++) {
        // 扩大窗口
        window.set(s[right], (window.get(s[right]) || 0) + 1);
        
        // 计算以right结尾的满足条件的子串数量
        let left = right;
        while (left >= 0 && isValid(window, condition)) {
            count++;
            left--;
            if (left >= 0) {
                window.set(s[left], (window.get(s[left]) || 0) + 1);
            }
        }
        
        // 重置窗口
        window.clear();
    }
    
    return count;
}
```

## 💡 高级技巧

### 1. 双指针优化

**水果成篮**：
```javascript
function totalFruit(fruits) {
    const basket = new Map();
    let left = 0;
    let maxFruits = 0;
    
    for (let right = 0; right < fruits.length; right++) {
        basket.set(fruits[right], (basket.get(fruits[right]) || 0) + 1);
        
        // 最多只能有2种水果
        while (basket.size > 2) {
            basket.set(fruits[left], basket.get(fruits[left]) - 1);
            if (basket.get(fruits[left]) === 0) {
                basket.delete(fruits[left]);
            }
            left++;
        }
        
        maxFruits = Math.max(maxFruits, right - left + 1);
    }
    
    return maxFruits;
}
```

### 2. 前缀和结合

**和为目标值的子数组**：
```javascript
function subarraySum(nums, k) {
    const prefixSumCount = new Map();
    prefixSumCount.set(0, 1);
    
    let prefixSum = 0;
    let count = 0;
    
    for (let num of nums) {
        prefixSum += num;
        
        if (prefixSumCount.has(prefixSum - k)) {
            count += prefixSumCount.get(prefixSum - k);
        }
        
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

### 3. 状态压缩

**至少有K个重复字符的最长子串**：
```javascript
function longestSubstring(s, k) {
    if (s.length < k) return 0;
    
    const charCount = new Map();
    for (let char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // 找到第一个出现次数少于k的字符
    for (let i = 0; i < s.length; i++) {
        if (charCount.get(s[i]) < k) {
            // 分治：以该字符为分割点
            let maxLen = 0;
            const parts = s.split(s[i]);
            for (let part of parts) {
                maxLen = Math.max(maxLen, longestSubstring(part, k));
            }
            return maxLen;
        }
    }
    
    return s.length;  // 所有字符都满足条件
}
```

## 🎯 练习题目

### 基础练习
- **[3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)**
- **[209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)**
- **[643. 子数组最大平均数 I](https://leetcode.cn/problems/maximum-average-subarray-i/)**

### 进阶练习
- **[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)**
- **[567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/)**
- **[904. 水果成篮](https://leetcode.cn/problems/fruit-into-baskets/)**

### 困难练习
- **[395. 至少有 K 个重复字符的最长子串](https://leetcode.cn/problems/longest-substring-with-at-least-k-repeating-characters/)**
- **[992. K 个不同整数的子数组](https://leetcode.cn/problems/subarrays-with-k-different-integers/)**
- **[1358. 包含所有三种字符的子字符串数目](https://leetcode.cn/problems/number-of-substrings-containing-all-three-characters/)**

## 🔄 总结

子串问题的核心要点：

1. **滑动窗口**：维护一个可变大小的窗口
2. **双指针**：left和right指针控制窗口边界
3. **状态维护**：用哈希表维护窗口内元素的状态
4. **扩缩策略**：明确何时扩大、何时收缩窗口

**解题模式**：
- **最长子串** → 扩大窗口，违反条件时收缩
- **最短子串** → 满足条件时收缩，更新最小值
- **固定长度** → 维护固定大小窗口
- **计数问题** → 结合数学技巧计算贡献

**关键技巧**：
- 正确维护窗口状态
- 理解扩缩窗口的时机
- 处理边界条件
- 优化时间复杂度

掌握滑动窗口，子串问题就能轻松解决！
