# 动态规划 - 线性DP

> 线性DP是动态规划的基础，掌握状态定义和转移方程是关键

## 🎯 核心思想

线性动态规划的特点是**状态之间存在线性关系**，通常状态转移只依赖于前面的几个状态。关键是找到**最优子结构**和**状态转移方程**。

## 📋 经典模式

### 1. 最长递增子序列（LIS）

**问题特征**：求序列中严格递增的最长子序列长度

**状态定义**：`dp[i]` = 以第i个元素结尾的最长递增子序列长度

**基础DP解法 O(n²)**：
```javascript
function lengthOfLIS(nums) {
    if (!nums || nums.length === 0) return 0;
    
    const n = nums.length;
    const dp = new Array(n).fill(1);  // 每个元素自身构成长度为1的序列
    let maxLen = 1;
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    return maxLen;
}
```

**二分优化解法 O(n log n)**：
```javascript
function lengthOfLIS(nums) {
    if (!nums || nums.length === 0) return 0;
    
    const tails = [];  // tails[i] = 长度为i+1的递增序列的最小尾部元素
    
    for (let num of nums) {
        let left = 0, right = tails.length;
        
        // 二分查找第一个大于等于num的位置
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        if (left === tails.length) {
            tails.push(num);  // 扩展序列
        } else {
            tails[left] = num;  // 替换更小的尾部元素
        }
    }
    
    return tails.length;
}
```

**变式题目**：
- 最长递减子序列
- 最长非严格递增子序列
- 俄罗斯套娃信封问题

### 2. 最大子数组和（Kadane算法）

**问题特征**：找连续子数组的最大和

**状态定义**：`dp[i]` = 以第i个元素结尾的最大子数组和

**解法**：
```javascript
function maxSubArray(nums) {
    if (!nums || nums.length === 0) return 0;
    
    let maxSoFar = nums[0];  // 全局最大值
    let maxEndingHere = nums[0];  // 以当前位置结尾的最大值
    
    for (let i = 1; i < nums.length; i++) {
        // 要么继续之前的子数组，要么从当前位置重新开始
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}
```

**空间优化版本**：
```javascript
function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}
```

**返回子数组位置**：
```javascript
function maxSubArrayWithIndex(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    let start = 0, end = 0, tempStart = 0;
    
    for (let i = 1; i < nums.length; i++) {
        if (currentSum < 0) {
            currentSum = nums[i];
            tempStart = i;
        } else {
            currentSum += nums[i];
        }
        
        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }
    }
    
    return { maxSum, start, end };
}
```

### 3. 最长公共子序列（LCS）

**问题特征**：两个序列的最长公共子序列

**状态定义**：`dp[i][j]` = str1前i个字符和str2前j个字符的LCS长度

**解法**：
```javascript
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}
```

**路径回溯（构造LCS）**：
```javascript
function buildLCS(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // 填充DP表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // 回溯构造LCS
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}
```

### 4. 编辑距离

**问题特征**：将一个字符串转换为另一个字符串的最少操作数

**状态定义**：`dp[i][j]` = word1前i个字符转换为word2前j个字符的最少操作数

**解法**：
```javascript
function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // 初始化边界条件
    for (let i = 0; i <= m; i++) dp[i][0] = i;  // 删除操作
    for (let j = 0; j <= n; j++) dp[0][j] = j;  // 插入操作
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];  // 不需要操作
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // 删除
                    dp[i][j - 1] + 1,     // 插入
                    dp[i - 1][j - 1] + 1  // 替换
                );
            }
        }
    }
    
    return dp[m][n];
}
```

## 🧠 解题模式

### 通用模板

```javascript
function linearDP(input) {
    // 1. 确定状态定义
    const dp = initializeDP(input);
    
    // 2. 初始化边界条件
    dp[0] = 初始值;
    
    // 3. 状态转移
    for (let i = 1; i < input.length; i++) {
        for (可能的前置状态 j) {
            if (满足转移条件) {
                dp[i] = optimize(dp[i], dp[j] + cost);
            }
        }
    }
    
    // 4. 返回结果
    return extractResult(dp);
}
```

### 空间优化技巧

**滚动数组**：
```javascript
function optimizedDP(nums) {
    // 如果只依赖前一个状态，可以用两个变量
    let prev = 初始值;
    let curr = 初始值;
    
    for (let i = 1; i < nums.length; i++) {
        let temp = curr;
        curr = 计算新值(prev, curr, nums[i]);
        prev = temp;
    }
    
    return curr;
}
```

**一维数组**：
```javascript
function spaceOptimizedLCS(text1, text2) {
    const n = text2.length;
    let prev = new Array(n + 1).fill(0);
    let curr = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= text1.length; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                curr[j] = prev[j - 1] + 1;
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
            }
        }
        [prev, curr] = [curr, prev];  // 交换数组
    }
    
    return prev[n];
}
```

## 💡 实战技巧

### 1. 状态定义的艺术
```javascript
// 有时需要多维状态
// dp[i][0] = 第i天不持有股票的最大收益
// dp[i][1] = 第i天持有股票的最大收益
function maxProfit(prices) {
    let hold = -prices[0];  // 持有股票
    let sold = 0;           // 不持有股票
    
    for (let i = 1; i < prices.length; i++) {
        let newHold = Math.max(hold, sold - prices[i]);
        let newSold = Math.max(sold, hold + prices[i]);
        hold = newHold;
        sold = newSold;
    }
    
    return sold;
}
```

### 2. 边界条件处理
```javascript
function robWithCircle(nums) {
    if (nums.length === 1) return nums[0];
    
    // 情况1: 抢第一家，不抢最后一家
    const rob1 = robLinear(nums.slice(0, -1));
    
    // 情况2: 不抢第一家，抢最后一家
    const rob2 = robLinear(nums.slice(1));
    
    return Math.max(rob1, rob2);
}
```

### 3. 状态压缩
```javascript
function fibonacci(n) {
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    
    return b;
}
```

## 🎯 练习题目

### 基础练习
- [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)
- [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)
- [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

### 进阶练习
- [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)
- [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)
- [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)

### 困难练习
- [354. 俄罗斯套娃信封问题](https://leetcode.cn/problems/russian-doll-envelopes/)
- [1964. 找出到每个位置为止最长的有效障碍赛跑路线](https://leetcode.cn/problems/find-the-longest-valid-obstacle-course-at-each-position/)

## 🔄 总结

线性DP的核心要素：

1. **状态定义**：明确dp[i]代表什么
2. **转移方程**：如何从前面的状态推导当前状态
3. **边界条件**：初始状态的处理
4. **优化策略**：空间和时间的优化

**解题步骤**：
1. 分析问题是否具有最优子结构
2. 定义状态（一维还是多维）
3. 写出状态转移方程
4. 考虑边界情况
5. 实现并优化

掌握这些模式，线性DP问题就能轻松解决！
