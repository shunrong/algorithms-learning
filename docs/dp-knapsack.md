# 动态规划 - 背包问题

> 背包问题是动态规划的经典应用，掌握各种背包模型是解决资源分配问题的关键

## 🎯 核心思想

背包问题的本质是**在约束条件下的最优化选择**。核心是理解状态定义、状态转移和边界条件，以及如何根据物品的使用限制选择合适的背包模型。

## 📋 基础模型

### 1. 0-1背包（每个物品只能用一次）

**问题描述**：有N个物品，每个物品有重量和价值，背包容量为W，求最大价值

**状态定义**：`dp[i][w]` = 前i个物品，背包容量为w时的最大价值

**基础解法**：
```javascript
function knapsack01(weights, values, capacity) {
    const n = weights.length;
    // dp[i][w] = 前i个物品，容量为w的最大价值
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // 不选第i个物品
            dp[i][w] = dp[i - 1][w];
            
            // 选第i个物品（如果能放下）
            if (w >= weights[i - 1]) {
                dp[i][w] = Math.max(
                    dp[i][w], 
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}
```

**空间优化版本**：
```javascript
function knapsack01Optimized(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < weights.length; i++) {
        // 从右到左遍历，避免重复使用
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}
```

**路径回溯**（找出选择了哪些物品）：
```javascript
function knapsackWithPath(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    // 填充DP表
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (w >= weights[i - 1]) {
                dp[i][w] = Math.max(
                    dp[i][w], 
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    // 回溯路径
    const selected = [];
    let i = n, w = capacity;
    
    while (i > 0 && w > 0) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(i - 1);  // 选择了第i-1个物品
            w -= weights[i - 1];
        }
        i--;
    }
    
    return {
        maxValue: dp[n][capacity],
        items: selected.reverse()
    };
}
```

**经典题目**：
- **[416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)**
- **[494. 目标和](https://leetcode.cn/problems/target-sum/)**

### 2. 完全背包（每个物品可以用无限次）

**状态转移**：`dp[i][w] = max(dp[i-1][w], dp[i][w-weight[i]] + value[i])`

**关键区别**：选择物品i后，下次仍可选择物品i（从dp[i][w-weight[i]]转移）

```javascript
function unboundedKnapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // 不选第i个物品
            dp[i][w] = dp[i - 1][w];
            
            // 选第i个物品（注意：从dp[i][w-weights[i-1]]转移）
            if (w >= weights[i - 1]) {
                dp[i][w] = Math.max(
                    dp[i][w], 
                    dp[i][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}
```

**空间优化版本**：
```javascript
function unboundedKnapsackOptimized(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < weights.length; i++) {
        // 从左到右遍历，允许重复使用
        for (let w = weights[i]; w <= capacity; w++) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}
```

**经典题目**：
- **[322. 零钱兑换](https://leetcode.cn/problems/coin-change/)**
- **[518. 零钱兑换 II](https://leetcode.cn/problems/coin-change-2/)**
- **[139. 单词拆分](https://leetcode.cn/problems/word-break/)**

### 3. 多重背包（每个物品有数量限制）

**问题描述**：第i个物品最多可以选择nums[i]次

**朴素解法**（转化为0-1背包）：
```javascript
function boundedKnapsack(weights, values, nums, capacity) {
    const newWeights = [];
    const newValues = [];
    
    // 将多重背包转化为0-1背包
    for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < nums[i]; j++) {
            newWeights.push(weights[i]);
            newValues.push(values[i]);
        }
    }
    
    return knapsack01(newWeights, newValues, capacity);
}
```

**二进制优化**：
```javascript
function boundedKnapsackOptimized(weights, values, nums, capacity) {
    const newWeights = [];
    const newValues = [];
    
    for (let i = 0; i < weights.length; i++) {
        let num = nums[i];
        let k = 1;
        
        // 二进制拆分：1, 2, 4, 8, ..., 剩余
        while (k < num) {
            newWeights.push(k * weights[i]);
            newValues.push(k * values[i]);
            num -= k;
            k *= 2;
        }
        
        if (num > 0) {
            newWeights.push(num * weights[i]);
            newValues.push(num * values[i]);
        }
    }
    
    return knapsack01(newWeights, newValues, capacity);
}
```

## 🧠 背包变形问题

### 1. 分组背包

**问题**：物品分为若干组，每组最多选一个

```javascript
function groupKnapsack(groups, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let group of groups) {
        // 从后往前遍历容量
        for (let w = capacity; w >= 0; w--) {
            // 尝试组内每个物品
            for (let item of group) {
                if (w >= item.weight) {
                    dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
                }
            }
        }
    }
    
    return dp[capacity];
}
```

### 2. 二维费用背包

**问题**：物品有两个维度的费用（如重量和体积）

```javascript
function twoDimensionKnapsack(items, capacity1, capacity2) {
    const dp = Array(capacity1 + 1).fill()
        .map(() => Array(capacity2 + 1).fill(0));
    
    for (let item of items) {
        for (let w1 = capacity1; w1 >= item.weight1; w1--) {
            for (let w2 = capacity2; w2 >= item.weight2; w2--) {
                dp[w1][w2] = Math.max(
                    dp[w1][w2], 
                    dp[w1 - item.weight1][w2 - item.weight2] + item.value
                );
            }
        }
    }
    
    return dp[capacity1][capacity2];
}
```

### 3. 背包计数问题

**零钱兑换方案数**：
```javascript
function coinChange2(amount, coins) {
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;  // 组成0的方案数为1
    
    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    
    return dp[amount];
}
```

**注意**：遍历顺序很重要，先遍历物品再遍历容量是组合数，先遍历容量再遍历物品是排列数。

## 💡 实战技巧

### 1. 状态定义技巧
```javascript
// 有时需要多维状态
// dp[i][j][k] = 前i个物品，容量j，额外约束k的最优值

function knapsackWithConstraint(items, capacity, maxItems) {
    // dp[w][cnt] = 容量w，选择cnt个物品的最大价值
    const dp = Array(capacity + 1).fill()
        .map(() => Array(maxItems + 1).fill(-Infinity));
    
    dp[0][0] = 0;
    
    for (let item of items) {
        for (let w = capacity; w >= item.weight; w--) {
            for (let cnt = maxItems; cnt >= 1; cnt--) {
                if (dp[w - item.weight][cnt - 1] !== -Infinity) {
                    dp[w][cnt] = Math.max(
                        dp[w][cnt], 
                        dp[w - item.weight][cnt - 1] + item.value
                    );
                }
            }
        }
    }
    
    let result = 0;
    for (let cnt = 0; cnt <= maxItems; cnt++) {
        result = Math.max(result, dp[capacity][cnt]);
    }
    
    return result;
}
```

### 2. 初始化技巧
```javascript
// 求最大值：初始化为0或-Infinity
// 求最小值：初始化为Infinity
// 求方案数：初始化为0，dp[0] = 1

function coinChangeMin(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;  // 组成0需要0个硬币
    
    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            if (dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

### 3. 优化技巧
```javascript
// 滚动数组优化空间
function knapsackRollingArray(weights, values, capacity) {
    let prev = new Array(capacity + 1).fill(0);
    let curr = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < weights.length; i++) {
        for (let w = 0; w <= capacity; w++) {
            curr[w] = prev[w];
            if (w >= weights[i]) {
                curr[w] = Math.max(curr[w], prev[w - weights[i]] + values[i]);
            }
        }
        [prev, curr] = [curr, prev];  // 交换数组
    }
    
    return prev[capacity];
}
```

## 🎯 模板总结

### 背包问题选择指南

```javascript
function chooseKnapsackType(problem) {
    if (problem.itemUsageLimit === 1) {
        return "0-1背包";
    } else if (problem.itemUsageLimit === Infinity) {
        return "完全背包";
    } else if (problem.itemUsageLimit > 1) {
        return "多重背包";
    } else if (problem.hasGroups) {
        return "分组背包";
    } else if (problem.constraintDimensions > 1) {
        return "多维背包";
    }
}
```

### 通用模板
```javascript
function knapsackTemplate(items, capacity, type) {
    const dp = new Array(capacity + 1).fill(initialValue);
    
    for (let item of items) {
        if (type === "01") {
            // 0-1背包：从右到左
            for (let w = capacity; w >= item.weight; w--) {
                dp[w] = optimize(dp[w], dp[w - item.weight] + item.value);
            }
        } else if (type === "complete") {
            // 完全背包：从左到右
            for (let w = item.weight; w <= capacity; w++) {
                dp[w] = optimize(dp[w], dp[w - item.weight] + item.value);
            }
        }
    }
    
    return dp[capacity];
}
```

## 🎯 练习题目

### 基础练习
- **[416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)**
- **[322. 零钱兑换](https://leetcode.cn/problems/coin-change/)**
- **[518. 零钱兑换 II](https://leetcode.cn/problems/coin-change-2/)**

### 进阶练习
- **[494. 目标和](https://leetcode.cn/problems/target-sum/)**
- **[474. 一和零](https://leetcode.cn/problems/ones-and-zeroes/)**
- **[1049. 最后一块石头的重量 II](https://leetcode.cn/problems/last-stone-weight-ii/)**

### 困难练习
- **[879. 盈利计划](https://leetcode.cn/problems/profitable-schemes/)**
- **[1639. 通过给定词典构造目标字符串的方案数](https://leetcode.cn/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/)**

## 🔄 总结

背包问题的核心要点：

1. **0-1背包**：每个物品只能用一次，倒序遍历容量
2. **完全背包**：每个物品可以用无限次，正序遍历容量
3. **多重背包**：每个物品有数量限制，可转化为0-1背包
4. **变形问题**：根据约束条件调整状态定义和转移方程

**解题步骤**：
1. 识别背包类型
2. 定义状态（通常是容量相关）
3. 写出状态转移方程
4. 确定遍历顺序
5. 考虑空间优化

掌握这些模式，背包问题就能轻松应对！
