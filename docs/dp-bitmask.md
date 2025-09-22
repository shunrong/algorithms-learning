# 动态规划 - 状态压缩DP

> 状态压缩DP是处理小规模集合问题的高级技巧，通过位运算优化状态表示

## 🎯 核心思想

状态压缩DP的本质是**用位掩码表示集合状态，将指数级的状态空间压缩到可处理的范围**。核心是理解如何用位运算操作集合，以及设计合适的状态转移。

## 📋 基础模式

### 1. 旅行商问题（TSP）

**问题描述**：访问所有城市一次并回到起点的最短路径

```javascript
function tsp(dist) {
    const n = dist.length;
    const VISITED_ALL = (1 << n) - 1;
    
    // dp[mask][i] = 访问了mask表示的城市集合，当前在城市i的最小代价
    const dp = Array(1 << n).fill().map(() => Array(n).fill(Infinity));
    
    // 从城市0开始
    dp[1][0] = 0;  // mask=1表示只访问了城市0
    
    for (let mask = 0; mask < (1 << n); mask++) {
        for (let u = 0; u < n; u++) {
            if (!(mask & (1 << u))) continue;  // 城市u不在当前集合中
            if (dp[mask][u] === Infinity) continue;
            
            for (let v = 0; v < n; v++) {
                if (mask & (1 << v)) continue;  // 城市v已访问
                
                const newMask = mask | (1 << v);
                dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
            }
        }
    }
    
    // 找到访问所有城市后回到起点的最小代价
    let result = Infinity;
    for (let i = 1; i < n; i++) {
        result = Math.min(result, dp[VISITED_ALL][i] + dist[i][0]);
    }
    
    return result;
}
```

### 2. 子集枚举

**所有子集的枚举**：
```javascript
function enumerateSubsets(n) {
    const subsets = [];
    
    // 枚举所有2^n个子集
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(i);
            }
        }
        subsets.push(subset);
    }
    
    return subsets;
}
```

**子集的子集枚举**：
```javascript
function enumerateSubsetsOfSubset(originalMask) {
    const subsets = [];
    let mask = originalMask;
    
    do {
        subsets.push(mask);
        mask = (mask - 1) & originalMask;  // 关键操作
    } while (mask !== originalMask);
    
    return subsets;
}
```

### 3. 最短Hamilton路径

**访问所有点一次的最短路径**：
```javascript
function shortestPathVisitingAllNodes(graph) {
    const n = graph.length;
    const VISITED_ALL = (1 << n) - 1;
    
    // BFS + 状态压缩
    const queue = [];
    const visited = new Set();
    
    // 从每个节点开始都有可能
    for (let i = 0; i < n; i++) {
        const state = `${1 << i},${i}`;  // mask,node
        queue.push([1 << i, i, 0]);  // mask, node, distance
        visited.add(state);
    }
    
    while (queue.length > 0) {
        const [mask, node, dist] = queue.shift();
        
        if (mask === VISITED_ALL) {
            return dist;
        }
        
        for (let neighbor of graph[node]) {
            const newMask = mask | (1 << neighbor);
            const newState = `${newMask},${neighbor}`;
            
            if (!visited.has(newState)) {
                visited.add(newState);
                queue.push([newMask, neighbor, dist + 1]);
            }
        }
    }
    
    return -1;
}
```

**经典题目**：
- **[847. 访问所有节点的最短路径](https://leetcode.cn/problems/shortest-path-visiting-all-nodes/)**
- **[943. 最短超级串](https://leetcode.cn/problems/find-the-shortest-superstring/)**

## 🧠 高级应用

### 1. 分配问题

**任务分配的最小代价**：
```javascript
function assignmentProblem(cost) {
    const n = cost.length;
    // dp[mask] = 分配mask表示的任务集合的最小代价
    const dp = new Array(1 << n).fill(Infinity);
    dp[0] = 0;
    
    for (let mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] === Infinity) continue;
        
        const person = __builtin_popcount(mask);  // 当前要分配给第几个人
        if (person >= n) continue;
        
        for (let task = 0; task < n; task++) {
            if (!(mask & (1 << task))) {  // 任务task还没分配
                const newMask = mask | (1 << task);
                dp[newMask] = Math.min(dp[newMask], dp[mask] + cost[person][task]);
            }
        }
    }
    
    return dp[(1 << n) - 1];
}

// 计算二进制中1的个数
function __builtin_popcount(x) {
    let count = 0;
    while (x) {
        count += x & 1;
        x >>= 1;
    }
    return count;
}
```

### 2. 数字DP结合状态压缩

**数位DP + 状态压缩**：
```javascript
function countSpecialNumbers(n) {
    const s = n.toString();
    const memo = new Map();
    
    function dp(pos, mask, isLimit, isNum) {
        if (pos === s.length) {
            return isNum ? 1 : 0;
        }
        
        const key = `${pos},${mask},${isLimit},${isNum}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        let result = 0;
        
        // 可以不填数字（前导零）
        if (!isNum) {
            result += dp(pos + 1, mask, false, false);
        }
        
        const start = isNum ? 0 : 1;  // 如果前面没填数字，这位最小是1
        const end = isLimit ? parseInt(s[pos]) : 9;
        
        for (let digit = start; digit <= end; digit++) {
            if (!(mask & (1 << digit))) {  // 数字digit还没使用过
                const newMask = mask | (1 << digit);
                const newLimit = isLimit && (digit === end);
                result += dp(pos + 1, newMask, newLimit, true);
            }
        }
        
        memo.set(key, result);
        return result;
    }
    
    return dp(0, 0, true, false);
}
```

### 3. 游戏状态DP

**Nim游戏的变种**：
```javascript
function canWinNim(piles) {
    const n = piles.length;
    const memo = new Map();
    
    function canWin(mask) {
        if (mask === 0) return false;  // 没有石头，当前玩家输
        
        if (memo.has(mask)) {
            return memo.get(mask);
        }
        
        // 尝试所有可能的移动
        for (let i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;  // 第i堆已经空了
            
            const currentPile = getPileSize(mask, i);
            for (let take = 1; take <= currentPile; take++) {
                const newMask = updateMask(mask, i, currentPile - take);
                if (!canWin(newMask)) {  // 对手无法获胜
                    memo.set(mask, true);
                    return true;
                }
            }
        }
        
        memo.set(mask, false);
        return false;
    }
    
    const initialMask = encodePiles(piles);
    return canWin(initialMask);
}
```

## 💡 位运算技巧

### 1. 基础位运算

```javascript
// 常用位运算操作
class BitOperations {
    // 检查第i位是否为1
    static check(mask, i) {
        return (mask & (1 << i)) !== 0;
    }
    
    // 设置第i位为1
    static set(mask, i) {
        return mask | (1 << i);
    }
    
    // 设置第i位为0
    static clear(mask, i) {
        return mask & ~(1 << i);
    }
    
    // 翻转第i位
    static toggle(mask, i) {
        return mask ^ (1 << i);
    }
    
    // 获取最低位的1
    static lowbit(mask) {
        return mask & (-mask);
    }
    
    // 计算1的个数
    static popcount(mask) {
        let count = 0;
        while (mask) {
            count++;
            mask &= mask - 1;  // 清除最低位的1
        }
        return count;
    }
    
    // 获取下一个具有相同1个数的数
    static nextPermutation(mask) {
        const c = mask;
        const c0 = this.trailingZeros(mask);
        const c1 = this.trailingZeros(~mask >> c0);
        
        if (c0 + c1 === 31 || c0 + c1 === 0) return -1;
        
        const pos = c0 + c1;
        mask |= (1 << pos);  // 翻转最右的非拖尾0
        mask &= ~((1 << pos) - 1);  // 清除pos右边的所有位
        mask |= (1 << (c1 - 1)) - 1;  // 在右边插入(c1-1)个1
        
        return mask;
    }
    
    static trailingZeros(n) {
        if (n === 0) return 32;
        let count = 0;
        while ((n & 1) === 0) {
            count++;
            n >>= 1;
        }
        return count;
    }
}
```

### 2. 集合操作

```javascript
class SetOperations {
    // 并集
    static union(set1, set2) {
        return set1 | set2;
    }
    
    // 交集
    static intersection(set1, set2) {
        return set1 & set2;
    }
    
    // 差集
    static difference(set1, set2) {
        return set1 & (~set2);
    }
    
    // 对称差集
    static symmetricDifference(set1, set2) {
        return set1 ^ set2;
    }
    
    // 子集判断
    static isSubset(subset, superset) {
        return (subset & superset) === subset;
    }
    
    // 获取补集
    static complement(set, universe) {
        return universe ^ set;
    }
}
```

## 🎯 实战模板

### 通用状态压缩DP模板

```javascript
function bitmaskDP(n, items) {
    // dp[mask] = 选择mask表示的物品集合的最优值
    const dp = new Array(1 << n).fill(initialValue);
    dp[0] = baseCase;
    
    for (let mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] === initialValue) continue;
        
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) continue;  // 物品i已选择
            
            const newMask = mask | (1 << i);
            dp[newMask] = optimize(dp[newMask], dp[mask] + cost(items[i]));
        }
    }
    
    return dp[(1 << n) - 1];
}
```

### 状态压缩BFS模板

```javascript
function bitmaskBFS(n, graph) {
    const queue = [];
    const visited = new Set();
    const target = (1 << n) - 1;
    
    // 初始化：从每个节点开始
    for (let i = 0; i < n; i++) {
        const state = `${1 << i},${i}`;
        queue.push([1 << i, i, 0]);
        visited.add(state);
    }
    
    while (queue.length > 0) {
        const [mask, node, dist] = queue.shift();
        
        if (mask === target) {
            return dist;
        }
        
        for (let next of graph[node]) {
            const newMask = mask | (1 << next);
            const newState = `${newMask},${next}`;
            
            if (!visited.has(newState)) {
                visited.add(newState);
                queue.push([newMask, next, dist + 1]);
            }
        }
    }
    
    return -1;
}
```

## 🎯 练习题目

### 基础练习
- **[698. 划分为k个相等的子集](https://leetcode.cn/problems/partition-to-k-equal-sum-subsets/)**
- **[526. 优美的排列](https://leetcode.cn/problems/beautiful-arrangement/)**

### 进阶练习
- **[847. 访问所有节点的最短路径](https://leetcode.cn/problems/shortest-path-visiting-all-nodes/)**
- **[1125. 最小的必要团队](https://leetcode.cn/problems/smallest-sufficient-team/)**
- **[1681. 最小不兼容性](https://leetcode.cn/problems/minimum-incompatibility/)**

### 困难练习
- **[943. 最短超级串](https://leetcode.cn/problems/find-the-shortest-superstring/)**
- **[1349. 参加考试的最大学生数](https://leetcode.cn/problems/maximum-students-taking-exam/)**

## 🔄 总结

状态压缩DP的核心要点：

1. **适用条件**：集合大小通常 ≤ 20，状态数不超过 2^20
2. **状态表示**：用位掩码表示集合，第i位为1表示元素i在集合中
3. **状态转移**：通过位运算操作集合，添加或删除元素
4. **优化技巧**：
   - 子集枚举：`mask = (mask - 1) & original`
   - 位运算优化：`__builtin_popcount`等内置函数
   - 滚动数组：当只依赖前一层状态时

**解题步骤**：
1. 确定状态压缩的对象（通常是大小 ≤ 20的集合）
2. 设计状态定义（用位掩码表示）
3. 写出状态转移方程
4. 注意位运算的正确性
5. 考虑时间复杂度优化

**常见应用场景**：
- 旅行商问题
- 任务分配问题
- 集合划分问题
- 图的Hamilton路径

掌握状态压缩DP，小规模集合的组合优化问题就能高效解决！
