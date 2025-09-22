# 动态规划 - 区间DP

> 区间DP是处理区间合并和分割问题的经典算法，关键在于理解区间的划分方式

## 🎯 核心思想

区间DP的本质是**将大区间问题分解为小区间问题**，通过合并子区间的最优解来得到原问题的最优解。核心是确定**状态定义**和**区间划分方式**。

## 📋 基础模式

### 1. 区间合并型

**状态定义**：`dp[i][j]` = 区间[i,j]的最优值

**矩阵链乘法**：
```javascript
function matrixChainOrder(p) {
    const n = p.length - 1;  // n个矩阵
    // dp[i][j] = 计算矩阵Ai到Aj的最少标量乘法次数
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    
    // 枚举区间长度
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            // 枚举分割点
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    return dp[0][n - 1];
}
```

**最优二叉搜索树**：
```javascript
function optimalBST(keys, freq) {
    const n = keys.length;
    // dp[i][j] = 构建包含keys[i]到keys[j]的最优BST的代价
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    // sum[i][j] = freq[i]到freq[j]的总和
    const sum = Array(n).fill().map(() => Array(n).fill(0));
    
    // 计算频率前缀和
    for (let i = 0; i < n; i++) {
        sum[i][i] = freq[i];
        for (let j = i + 1; j < n; j++) {
            sum[i][j] = sum[i][j - 1] + freq[j];
        }
    }
    
    // 单个节点的代价
    for (let i = 0; i < n; i++) {
        dp[i][i] = freq[i];
    }
    
    // 枚举区间长度
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            // 尝试每个节点作为根
            for (let r = i; r <= j; r++) {
                const cost = sum[i][j] + 
                           (r > i ? dp[i][r - 1] : 0) + 
                           (r < j ? dp[r + 1][j] : 0);
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    return dp[0][n - 1];
}
```

**经典题目**：
- **[312. 戳气球](https://leetcode.cn/problems/burst-balloons/)**
- **[1130. 叶值的最小代价生成树](https://leetcode.cn/problems/minimum-cost-tree-from-leaf-values/)**

### 2. 区间分割型

**回文串分割**：
```javascript
function minCut(s) {
    const n = s.length;
    // dp[i] = s[0...i-1]的最少分割次数
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = -1;  // 空字符串需要-1次分割
    
    // isPalindrome[i][j] = s[i...j]是否为回文
    const isPalindrome = Array(n).fill().map(() => Array(n).fill(false));
    
    // 预计算回文信息
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
    
    // 计算最少分割次数
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (isPalindrome[j][i - 1]) {
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }
    
    return dp[n];
}
```

**分割数组的最大值**：
```javascript
function splitArray(nums, m) {
    const n = nums.length;
    // dp[i][j] = 将前i个数分成j段的最大值的最小值
    const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(Infinity));
    
    // 前缀和
    const prefixSum = [0];
    for (let num of nums) {
        prefixSum.push(prefixSum[prefixSum.length - 1] + num);
    }
    
    dp[0][0] = 0;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= Math.min(i, m); j++) {
            for (let k = j - 1; k < i; k++) {
                const subSum = prefixSum[i] - prefixSum[k];
                dp[i][j] = Math.min(dp[i][j], Math.max(dp[k][j - 1], subSum));
            }
        }
    }
    
    return dp[n][m];
}
```

**经典题目**：
- **[132. 分割回文串 II](https://leetcode.cn/problems/palindrome-partitioning-ii/)**
- **[410. 分割数组的最大值](https://leetcode.cn/problems/split-array-largest-sum/)**

### 3. 石子合并问题

**经典石子合并**：
```javascript
function stoneGame(stones) {
    const n = stones.length;
    // dp[i][j] = 合并stones[i]到stones[j]的最小代价
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    
    // 前缀和
    const prefixSum = [0];
    for (let stone of stones) {
        prefixSum.push(prefixSum[prefixSum.length - 1] + stone);
    }
    
    // 枚举区间长度
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            // 枚举分割点
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + 
                           (prefixSum[j + 1] - prefixSum[i]);
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    return dp[0][n - 1];
}
```

**环形石子合并**：
```javascript
function stoneGameCircular(stones) {
    const n = stones.length;
    // 展开成2n-1长度的数组
    const extended = [...stones, ...stones.slice(0, n - 1)];
    const len = extended.length;
    
    const dp = Array(len).fill().map(() => Array(len).fill(0));
    const prefixSum = [0];
    for (let stone of extended) {
        prefixSum.push(prefixSum[prefixSum.length - 1] + stone);
    }
    
    // 区间DP
    for (let interval = 2; interval <= n; interval++) {
        for (let i = 0; i <= len - interval; i++) {
            const j = i + interval - 1;
            dp[i][j] = Infinity;
            
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + 
                           (prefixSum[j + 1] - prefixSum[i]);
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    // 找最小值
    let result = Infinity;
    for (let i = 0; i < n; i++) {
        result = Math.min(result, dp[i][i + n - 1]);
    }
    
    return result;
}
```

## 🧠 解题模式

### 通用模板

```javascript
function intervalDP(arr) {
    const n = arr.length;
    const dp = Array(n).fill().map(() => Array(n).fill(initialValue));
    
    // 初始化单个元素
    for (let i = 0; i < n; i++) {
        dp[i][i] = baseCase(arr[i]);
    }
    
    // 枚举区间长度
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            // 枚举分割点
            for (let k = i; k < j; k++) {
                dp[i][j] = optimize(dp[i][j], 
                    combine(dp[i][k], dp[k + 1][j], cost(i, k, j)));
            }
        }
    }
    
    return dp[0][n - 1];
}
```

### 优化技巧

**四边形不等式优化**：
```javascript
// 当满足四边形不等式时，可以优化到O(n²)
function optimizedIntervalDP(arr) {
    const n = arr.length;
    const dp = Array(n).fill().map(() => Array(n).fill(Infinity));
    const opt = Array(n).fill().map(() => Array(n).fill(0));
    
    // 初始化
    for (let i = 0; i < n; i++) {
        dp[i][i] = 0;
        opt[i][i] = i;
    }
    
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            // 利用最优分割点的单调性
            const left = opt[i][j - 1];
            const right = opt[i + 1][j];
            
            for (let k = left; k <= right; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + costFunction(i, k, j);
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    opt[i][j] = k;
                }
            }
        }
    }
    
    return dp[0][n - 1];
}
```

## 💡 实战技巧

### 1. 状态设计技巧

```javascript
// 有时需要额外维度
function intervalDPWithState(arr) {
    const n = arr.length;
    // dp[i][j][state] = 区间[i,j]在某种状态下的最优值
    const dp = Array(n).fill().map(() => 
        Array(n).fill().map(() => Array(stateCount).fill(initialValue)));
    
    // 处理状态转移
    for (let len = 1; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            for (let state = 0; state < stateCount; state++) {
                // 状态转移逻辑
            }
        }
    }
}
```

### 2. 预处理技巧

```javascript
// 预计算区间信息
function precompute(arr) {
    const n = arr.length;
    const precomputed = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            precomputed[i][j] = computeProperty(arr, i, j);
        }
    }
    
    return precomputed;
}
```

### 3. 边界处理

```javascript
function handleBoundary(dp, i, j, k) {
    const leftValue = (k > i) ? dp[i][k] : 0;
    const rightValue = (k < j) ? dp[k + 1][j] : 0;
    return leftValue + rightValue + additionalCost(i, j, k);
}
```

## 🎯 练习题目

### 基础练习
- **[516. 最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/)**
- **[647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)**
- **[132. 分割回文串 II](https://leetcode.cn/problems/palindrome-partitioning-ii/)**

### 进阶练习
- **[312. 戳气球](https://leetcode.cn/problems/burst-balloons/)**
- **[1039. 多边形三角剖分的最低得分](https://leetcode.cn/problems/minimum-score-triangulation-of-polygon/)**
- **[410. 分割数组的最大值](https://leetcode.cn/problems/split-array-largest-sum/)**

### 困难练习
- **[1000. 合并石头的最低成本](https://leetcode.cn/problems/minimum-cost-to-merge-stones/)**
- **[1547. 切棍子的最小成本](https://leetcode.cn/problems/minimum-cost-to-cut-a-stick/)**
- **[1478. 安排邮筒](https://leetcode.cn/problems/allocate-mailboxes/)**

## 🔄 总结

区间DP的核心要点：

1. **状态定义**：`dp[i][j]` 表示区间[i,j]的最优值
2. **转移方程**：通过枚举分割点k，将大区间分解为小区间
3. **计算顺序**：按区间长度从小到大计算
4. **边界处理**：正确处理单个元素和空区间

**解题步骤**：
1. 确定状态定义和转移方程
2. 分析是合并型还是分割型问题
3. 确定枚举顺序（通常是区间长度）
4. 处理边界条件
5. 考虑优化策略

**适用场景**：
- 区间合并问题
- 回文串处理
- 矩阵链乘法
- 石子合并类问题

掌握区间DP，处理区间相关问题就能游刃有余！
