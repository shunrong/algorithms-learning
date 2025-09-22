# 哈希表技巧

> 哈希表是最重要的数据结构之一，掌握哈希技巧能让很多问题从O(n²)降到O(n)

## 🎯 核心思想

哈希表的核心是**用空间换时间**，通过散列函数将键映射到数组位置，实现平均O(1)的查找、插入和删除。关键是理解何时使用哈希表以及如何设计合适的键。

## 📋 基础应用

### 1. 查找与计数

**两数之和**：
```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [-1, -1];
}
```

**字符统计**：
```javascript
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const count = new Map();
    
    // 统计s中字符出现次数
    for (let char of s) {
        count.set(char, (count.get(char) || 0) + 1);
    }
    
    // 减去t中字符出现次数
    for (let char of t) {
        if (!count.has(char)) return false;
        count.set(char, count.get(char) - 1);
        if (count.get(char) === 0) {
            count.delete(char);
        }
    }
    
    return count.size === 0;
}
```

**数组中的重复元素**：
```javascript
function containsDuplicate(nums) {
    const seen = new Set();
    
    for (let num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}

// 进阶：找到第一个重复的元素
function findFirstDuplicate(nums) {
    const seen = new Set();
    
    for (let num of nums) {
        if (seen.has(num)) {
            return num;
        }
        seen.add(num);
    }
    
    return -1;
}
```

**经典题目**：
- **[1. 两数之和](https://leetcode.cn/problems/two-sum/)**
- **[242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/)**
- **[217. 存在重复元素](https://leetcode.cn/problems/contains-duplicate/)**

### 2. 分组与归类

**字母异位词分组**：
```javascript
function groupAnagrams(strs) {
    const groups = new Map();
    
    for (let str of strs) {
        // 使用排序后的字符串作为key
        const key = str.split('').sort().join('');
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(str);
    }
    
    return Array.from(groups.values());
}

// 优化版本：使用字符计数作为key
function groupAnagramsOptimized(strs) {
    const groups = new Map();
    
    for (let str of strs) {
        const count = new Array(26).fill(0);
        for (let char of str) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        const key = count.join(',');
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(str);
    }
    
    return Array.from(groups.values());
}
```

**同构字符串**：
```javascript
function isIsomorphic(s, t) {
    if (s.length !== t.length) return false;
    
    const mapS2T = new Map();
    const mapT2S = new Map();
    
    for (let i = 0; i < s.length; i++) {
        const charS = s[i];
        const charT = t[i];
        
        if (mapS2T.has(charS)) {
            if (mapS2T.get(charS) !== charT) return false;
        } else {
            mapS2T.set(charS, charT);
        }
        
        if (mapT2S.has(charT)) {
            if (mapT2S.get(charT) !== charS) return false;
        } else {
            mapT2S.set(charT, charS);
        }
    }
    
    return true;
}
```

**经典题目**：
- **[49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)**
- **[205. 同构字符串](https://leetcode.cn/problems/isomorphic-strings/)**
- **[290. 单词规律](https://leetcode.cn/problems/word-pattern/)**

### 3. 前缀和与子数组

**和为K的子数组**：
```javascript
function subarraySum(nums, k) {
    const prefixSumCount = new Map();
    prefixSumCount.set(0, 1);  // 前缀和为0出现1次
    
    let prefixSum = 0;
    let count = 0;
    
    for (let num of nums) {
        prefixSum += num;
        
        // 查找是否存在前缀和为 prefixSum - k
        if (prefixSumCount.has(prefixSum - k)) {
            count += prefixSumCount.get(prefixSum - k);
        }
        
        // 更新当前前缀和的出现次数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

**连续数组**（0和1数量相等）：
```javascript
function findMaxLength(nums) {
    const sumIndexMap = new Map();
    sumIndexMap.set(0, -1);  // 前缀和为0在位置-1
    
    let sum = 0;
    let maxLen = 0;
    
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i] === 1 ? 1 : -1;
        
        if (sumIndexMap.has(sum)) {
            maxLen = Math.max(maxLen, i - sumIndexMap.get(sum));
        } else {
            sumIndexMap.set(sum, i);
        }
    }
    
    return maxLen;
}
```

**经典题目**：
- **[560. 和为K的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)**
- **[525. 连续数组](https://leetcode.cn/problems/contiguous-array/)**
- **[974. 和可被 K 整除的子数组](https://leetcode.cn/problems/subarray-sums-divisible-by-k/)**

## 🧠 高级应用

### 1. 滑动窗口 + 哈希表

**无重复字符的最长子串**：
```javascript
function lengthOfLongestSubstring(s) {
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

**字符串的排列**：
```javascript
function checkInclusion(s1, s2) {
    const need = new Map();
    const window = new Map();
    
    // 统计s1中字符的需求
    for (let char of s1) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    let left = 0, right = 0;
    let valid = 0;  // 窗口中满足需求的字符种类数
    
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

### 2. 多重哈希

**四数相加 II**：
```javascript
function fourSumCount(nums1, nums2, nums3, nums4) {
    const sumCount = new Map();
    
    // 统计nums1和nums2所有可能的和
    for (let a of nums1) {
        for (let b of nums2) {
            const sum = a + b;
            sumCount.set(sum, (sumCount.get(sum) || 0) + 1);
        }
    }
    
    let count = 0;
    
    // 在nums3和nums4中查找补数
    for (let c of nums3) {
        for (let d of nums4) {
            const target = -(c + d);
            if (sumCount.has(target)) {
                count += sumCount.get(target);
            }
        }
    }
    
    return count;
}
```

### 3. 哈希表 + 设计

**LRU缓存**：
```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key) {
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            // 重新插入以更新顺序
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return -1;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // 删除最旧的元素（Map中第一个元素）
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, value);
    }
}
```

**设计哈希集合**：
```javascript
class MyHashSet {
    constructor() {
        this.buckets = 1000;
        this.data = Array(this.buckets).fill(null).map(() => []);
    }
    
    hash(key) {
        return key % this.buckets;
    }
    
    add(key) {
        const bucket = this.data[this.hash(key)];
        if (!bucket.includes(key)) {
            bucket.push(key);
        }
    }
    
    remove(key) {
        const bucket = this.data[this.hash(key)];
        const index = bucket.indexOf(key);
        if (index !== -1) {
            bucket.splice(index, 1);
        }
    }
    
    contains(key) {
        const bucket = this.data[this.hash(key)];
        return bucket.includes(key);
    }
}
```

## 💡 实战技巧

### 1. 选择合适的数据结构

```javascript
// Map vs Object vs Set的选择
function chooseDataStructure(requirement) {
    if (requirement === "key-value mapping") {
        return new Map();  // 键可以是任意类型
    } else if (requirement === "string keys only") {
        return {};  // 对象，性能可能更好
    } else if (requirement === "unique values") {
        return new Set();  // 去重
    }
}
```

### 2. 哈希函数设计

```javascript
// 自定义哈希函数
function customHash(arr) {
    let hash = 0;
    for (let i = 0; i < arr.length; i++) {
        hash = hash * 31 + arr[i];  // 31是常用的质数
    }
    return hash;
}

// 字符串哈希
function stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = hash * 31 + str.charCodeAt(i);
    }
    return hash;
}
```

### 3. 处理哈希冲突

```javascript
// 开放寻址法
class OpenAddressingHashMap {
    constructor(capacity = 16) {
        this.capacity = capacity;
        this.size = 0;
        this.keys = new Array(capacity);
        this.values = new Array(capacity);
    }
    
    hash(key) {
        return key % this.capacity;
    }
    
    put(key, value) {
        let index = this.hash(key);
        
        while (this.keys[index] !== undefined && this.keys[index] !== key) {
            index = (index + 1) % this.capacity;  // 线性探测
        }
        
        if (this.keys[index] === undefined) {
            this.size++;
        }
        
        this.keys[index] = key;
        this.values[index] = value;
    }
    
    get(key) {
        let index = this.hash(key);
        
        while (this.keys[index] !== undefined) {
            if (this.keys[index] === key) {
                return this.values[index];
            }
            index = (index + 1) % this.capacity;
        }
        
        return undefined;
    }
}
```

## 🎯 练习题目

### 基础练习
- **[1. 两数之和](https://leetcode.cn/problems/two-sum/)**
- **[217. 存在重复元素](https://leetcode.cn/problems/contains-duplicate/)**
- **[242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/)**

### 进阶练习
- **[49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)**
- **[560. 和为K的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)**
- **[3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)**

### 困难练习
- **[146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)**
- **[460. LFU 缓存](https://leetcode.cn/problems/lfu-cache/)**
- **[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)**

## 🔄 总结

哈希表的核心要点：

1. **快速查找**：O(1)平均时间复杂度的查找
2. **计数统计**：统计元素出现频次
3. **去重去重**：快速检测重复元素
4. **缓存设计**：实现各种缓存策略

**使用场景**：
- **需要快速查找** → 哈希表
- **统计频次** → 哈希表计数
- **检测重复** → 哈希集合
- **键值映射** → 哈希映射

**选择指南**：
- **Map**: 键可以是任意类型，保持插入顺序
- **Object**: 字符串键，可能性能更好
- **Set**: 只需要存储唯一值

掌握哈希表，查找类问题就能轻松解决！
