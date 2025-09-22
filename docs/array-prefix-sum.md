# 数组前缀和技巧

> 前缀和是处理区间查询问题的利器，能将O(n)的区间求和优化到O(1)

## 🎯 核心思想

前缀和的核心是**预处理**：用O(n)的时间预计算前缀和数组，然后用O(1)的时间回答区间查询。本质是用**空间换时间**的思想。

## 📋 基础模式

### 1. 一维前缀和

**问题特征**：频繁查询数组某个区间的和

**基础模板**：
```javascript
class PrefixSum {
    constructor(nums) {
        this.prefixSum = [0];  // prefixSum[0] = 0
        
        // 构建前缀和数组
        for (let i = 0; i < nums.length; i++) {
            this.prefixSum[i + 1] = this.prefixSum[i] + nums[i];
        }
    }
    
    // 查询区间[left, right]的和
    sumRange(left, right) {
        return this.prefixSum[right + 1] - this.prefixSum[left];
    }
}
```

**关键理解**：
- `prefixSum[i]` = 前i个元素的和
- 区间[left, right]的和 = `prefixSum[right + 1] - prefixSum[left]`

**经典题目**：
- **[303. 区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/)**
- **[560. 和为K的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)**

### 2. 哈希前缀和

**问题特征**：寻找满足特定条件的子数组

**核心思想**：用哈希表记录前缀和的出现次数或位置

```javascript
function subarraySum(nums, k) {
    const prefixSumCount = new Map();
    prefixSumCount.set(0, 1);  // 前缀和为0出现1次
    
    let prefixSum = 0;
    let count = 0;
    
    for (let num of nums) {
        prefixSum += num;
        
        // 如果存在前缀和 prefixSum - k，说明找到了一个子数组
        if (prefixSumCount.has(prefixSum - k)) {
            count += prefixSumCount.get(prefixSum - k);
        }
        
        // 更新当前前缀和的出现次数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

**应用变式**：
```javascript
// 找最长的和为k的子数组
function maxSubArrayLen(nums, k) {
    const prefixSumIndex = new Map();
    prefixSumIndex.set(0, -1);  // 前缀和为0在位置-1
    
    let prefixSum = 0;
    let maxLen = 0;
    
    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];
        
        if (prefixSumIndex.has(prefixSum - k)) {
            maxLen = Math.max(maxLen, i - prefixSumIndex.get(prefixSum - k));
        }
        
        // 只记录第一次出现的位置（保证子数组最长）
        if (!prefixSumIndex.has(prefixSum)) {
            prefixSumIndex.set(prefixSum, i);
        }
    }
    
    return maxLen;
}
```

### 3. 二维前缀和

**问题特征**：二维矩阵的区域求和

**构建二维前缀和**：
```javascript
class MatrixPrefixSum {
    constructor(matrix) {
        if (!matrix || matrix.length === 0) return;
        
        const m = matrix.length;
        const n = matrix[0].length;
        
        // prefixSum[i][j] = 从(0,0)到(i-1,j-1)的矩形区域和
        this.prefixSum = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                this.prefixSum[i][j] = matrix[i-1][j-1] + 
                                      this.prefixSum[i - 1][j] + 
                                      this.prefixSum[i][j - 1] - 
                                      this.prefixSum[i - 1][j - 1];
            }
        }
    }
    
    // 查询矩形区域 (row1,col1) 到 (row2,col2) 的和
    sumRegion(row1, col1, row2, col2) {
        return this.prefixSum[row2 + 1][col2 + 1] - 
               this.prefixSum[row1][col2 + 1] - 
               this.prefixSum[row2 + 1][col1] + 
               this.prefixSum[row1][col1];
    }
}
```

**记忆技巧**：
- **构建时**：当前 = 原值 + 上 + 左 - 左上
- **查询时**：目标 = 总和 - 上多余 - 左多余 + 重复减掉的左上

**经典题目**：
- **[304. 二维区域和检索 - 矩阵不可变](https://leetcode.cn/problems/range-sum-query-2d-immutable/)**
- **[1314. 矩阵区域和](https://leetcode.cn/problems/matrix-block-sum/)**

## 🧠 差分数组

### 核心思想

如果需要对区间进行**频繁的区间更新**操作，差分数组是最佳选择。

**差分数组定义**：`diff[i] = nums[i] - nums[i-1]`

```javascript
class DifferenceArray {
    constructor(nums) {
        this.diff = new Array(nums.length);
        this.diff[0] = nums[0];
        
        for (let i = 1; i < nums.length; i++) {
            this.diff[i] = nums[i] - nums[i - 1];
        }
    }
    
    // 给区间 [left, right] 加上 val
    increment(left, right, val) {
        this.diff[left] += val;
        if (right + 1 < this.diff.length) {
            this.diff[right + 1] -= val;
        }
    }
    
    // 恢复原数组
    getResult() {
        const result = new Array(this.diff.length);
        result[0] = this.diff[0];
        
        for (let i = 1; i < this.diff.length; i++) {
            result[i] = result[i - 1] + this.diff[i];
        }
        
        return result;
    }
}
```

**经典应用**：
```javascript
// 航班预订统计
function corpFlightBookings(bookings, n) {
    const diff = new Array(n + 1).fill(0);
    
    for (let [first, last, seats] of bookings) {
        diff[first - 1] += seats;
        diff[last] -= seats;
    }
    
    const result = [];
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += diff[i];
        result.push(sum);
    }
    
    return result;
}
```

**经典题目**：
- **[1109. 航班预订统计](https://leetcode.cn/problems/corporate-flight-bookings/)**
- **[1094. 拼车](https://leetcode.cn/problems/car-pooling/)**

## 💡 高级应用

### 1. 前缀和 + 同余定理

**连续数组**（0和1数量相等的最长子数组）：
```javascript
function findMaxLength(nums) {
    // 将0视为-1，问题转化为求和为0的最长子数组
    const prefixSumIndex = new Map();
    prefixSumIndex.set(0, -1);
    
    let prefixSum = 0;
    let maxLen = 0;
    
    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i] === 1 ? 1 : -1;
        
        if (prefixSumIndex.has(prefixSum)) {
            maxLen = Math.max(maxLen, i - prefixSumIndex.get(prefixSum));
        } else {
            prefixSumIndex.set(prefixSum, i);
        }
    }
    
    return maxLen;
}
```

### 2. 前缀和 + 滑动窗口

**长度最小的子数组**：
```javascript
function minSubArrayLen(target, nums) {
    let left = 0;
    let sum = 0;
    let minLen = Infinity;
    
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    
    return minLen === Infinity ? 0 : minLen;
}
```

### 3. 前缀和 + 单调栈

**和至少为K的最短子数组**：
```javascript
function shortestSubarray(nums, k) {
    const prefixSum = [0];
    for (let num of nums) {
        prefixSum.push(prefixSum[prefixSum.length - 1] + num);
    }
    
    const deque = [];  // 单调递增队列，存储下标
    let minLen = Infinity;
    
    for (let i = 0; i < prefixSum.length; i++) {
        // 检查是否有满足条件的子数组
        while (deque.length > 0 && prefixSum[i] - prefixSum[deque[0]] >= k) {
            minLen = Math.min(minLen, i - deque.shift());
        }
        
        // 维护单调性
        while (deque.length > 0 && prefixSum[i] <= prefixSum[deque[deque.length - 1]]) {
            deque.pop();
        }
        
        deque.push(i);
    }
    
    return minLen === Infinity ? -1 : minLen;
}
```

## 🎯 解题模板

### 前缀和问题识别
1. **区间查询**：频繁查询数组区间和 → 基础前缀和
2. **子数组计数**：统计满足条件的子数组 → 哈希前缀和
3. **区间更新**：频繁对区间进行增减操作 → 差分数组
4. **二维区域**：矩阵区域查询 → 二维前缀和

### 通用模板
```javascript
function prefixSumTemplate(nums, condition) {
    const prefixSumMap = new Map();
    prefixSumMap.set(0, 初始值);  // 根据问题设置
    
    let prefixSum = 0;
    let result = 初始结果;
    
    for (let i = 0; i < nums.length; i++) {
        prefixSum += transform(nums[i]);  // 可能需要转换
        
        const target = prefixSum - condition;
        if (prefixSumMap.has(target)) {
            // 处理找到的情况
            result = update(result, prefixSumMap.get(target), i);
        }
        
        // 更新哈希表
        updateMap(prefixSumMap, prefixSum, i);
    }
    
    return result;
}
```

## 🎯 练习题目

### 基础练习
- **[303. 区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/)**
- **[304. 二维区域和检索 - 矩阵不可变](https://leetcode.cn/problems/range-sum-query-2d-immutable/)**
- **[560. 和为K的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)**

### 进阶练习
- **[525. 连续数组](https://leetcode.cn/problems/contiguous-array/)**
- **[1109. 航班预订统计](https://leetcode.cn/problems/corporate-flight-bookings/)**
- **[1314. 矩阵区域和](https://leetcode.cn/problems/matrix-block-sum/)**

### 困难练习
- **[862. 和至少为 K 的最短子数组](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/)**
- **[1074. 元素和为目标值的子矩阵数量](https://leetcode.cn/problems/number-of-submatrices-that-sum-to-target/)**
- **[1248. 统计「优美子数组」](https://leetcode.cn/problems/count-number-of-nice-subarrays/)**

## 🔄 总结

前缀和技巧的核心要点：

1. **基础前缀和**：适用于静态数组的区间查询
2. **哈希前缀和**：通过哈希表记录前缀和，解决子数组问题
3. **差分数组**：适用于频繁的区间更新操作
4. **二维前缀和**：处理矩阵区域查询问题

**选择策略**：
- 多次查询，少量更新 → 前缀和
- 多次更新，少量查询 → 差分数组
- 子数组计数/查找 → 哈希前缀和
- 二维问题 → 二维前缀和

掌握前缀和，区间问题就能快速解决！
