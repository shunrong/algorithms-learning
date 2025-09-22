# 算法快速参考手册

> 快速查找解题模板和关键技巧，提升刷题效率

## 🚀 问题快速识别

### 数据结构特征 → 解题技巧

| 数据结构 | 常见问题 | 首选技巧 | 时间复杂度 |
|---------|---------|---------|-----------|
| **数组** | 两数之和、区间查询 | 双指针、前缀和 | O(n) |
| **字符串** | 子串匹配、回文检测 | 滑动窗口、中心扩展 | O(n) |
| **链表** | 环检测、链表反转 | 快慢指针、迭代反转 | O(n) |
| **二叉树** | 路径问题、层序遍历 | DFS、BFS | O(n) |
| **图** | 最短路径、连通性 | BFS、并查集 | O(V+E) |

### 问题类型 → 算法模式

| 问题类型 | 关键词 | 解题思路 | 经典算法 |
|---------|-------|---------|---------|
| **最优化** | 最大、最小、最长、最短 | 动态规划、贪心 | DP、贪心 |
| **计数** | 有多少种、方案数 | 动态规划、组合数学 | DP |
| **查找** | 是否存在、位置 | 二分查找、哈希表 | 二分、哈希 |
| **排序** | 有序、第K大 | 排序算法、堆 | 快排、堆排序 |

## 📚 核心算法模板

### 1. 双指针模板

```javascript
// 对撞指针
function twoSum(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) return [left, right];
        else if (sum < target) left++;
        else right--;
    }
    return [-1, -1];
}

// 滑动窗口
function minWindow(s, t) {
    let left = 0, right = 0;
    const need = new Map(), window = new Map();
    
    for (let char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    let valid = 0;
    while (right < s.length) {
        // 扩大窗口
        const c = s[right];
        right++;
        window.set(c, (window.get(c) || 0) + 1);
        if (window.get(c) === need.get(c)) valid++;
        
        // 收缩窗口
        while (valid === need.size) {
            // 更新结果
            const d = s[left];
            left++;
            if (need.has(d)) {
                if (window.get(d) === need.get(d)) valid--;
                window.set(d, window.get(d) - 1);
            }
        }
    }
}
```

### 2. 二分查找模板

```javascript
// 基础二分
function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// 左边界
function leftBound(nums, target) {
    let left = 0, right = nums.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}

// 右边界
function rightBound(nums, target) {
    let left = 0, right = nums.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] <= target) left = mid + 1;
        else right = mid;
    }
    return left - 1;
}
```

### 3. DFS/BFS模板

```javascript
// DFS递归
function dfs(node, visited) {
    if (!node || visited.has(node)) return;
    
    visited.add(node);
    // 处理当前节点
    
    for (let neighbor of node.neighbors) {
        dfs(neighbor, visited);
    }
}

// BFS迭代
function bfs(start) {
    const queue = [start];
    const visited = new Set([start]);
    
    while (queue.length > 0) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            // 处理当前节点
            
            for (let neighbor of node.neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
    }
}
```

### 4. 动态规划模板

```javascript
// 线性DP
function linearDP(nums) {
    const dp = new Array(nums.length);
    dp[0] = nums[0];  // 初始状态
    
    for (let i = 1; i < nums.length; i++) {
        dp[i] = Math.max(dp[i-1], nums[i]);  // 状态转移
    }
    
    return dp[nums.length - 1];
}

// 背包DP
function knapsack(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < weights.length; i++) {
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}
```

### 5. 回溯模板

```javascript
function backtrack(nums, path, result) {
    if (满足结束条件) {
        result.push([...path]);
        return;
    }
    
    for (let i = 0; i < nums.length; i++) {
        if (需要剪枝) continue;
        
        // 做选择
        path.push(nums[i]);
        
        // 递归
        backtrack(nums, path, result);
        
        // 撤销选择
        path.pop();
    }
}
```

## 🎯 常见问题速查

### 数组问题

| 问题描述 | 解法 | 复杂度 | 题目链接 |
|---------|------|-------|---------|
| 两数之和 | 哈希表 | O(n) | [1](https://leetcode.cn/problems/two-sum/) |
| 三数之和 | 排序+双指针 | O(n²) | [15](https://leetcode.cn/problems/3sum/) |
| 最大子数组和 | Kadane算法 | O(n) | [53](https://leetcode.cn/problems/maximum-subarray/) |
| 旋转数组查找 | 二分查找 | O(log n) | [33](https://leetcode.cn/problems/search-in-rotated-sorted-array/) |

### 字符串问题

| 问题描述 | 解法 | 复杂度 | 题目链接 |
|---------|------|-------|---------|
| 最长回文子串 | 中心扩展 | O(n²) | [5](https://leetcode.cn/problems/longest-palindromic-substring/) |
| 最长无重复子串 | 滑动窗口 | O(n) | [3](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) |
| 字符串匹配 | KMP | O(n+m) | [28](https://leetcode.cn/problems/implement-strstr/) |
| 字母异位词 | 哈希表 | O(n) | [242](https://leetcode.cn/problems/valid-anagram/) |

### 链表问题

| 问题描述 | 解法 | 复杂度 | 题目链接 |
|---------|------|-------|---------|
| 反转链表 | 迭代/递归 | O(n) | [206](https://leetcode.cn/problems/reverse-linked-list/) |
| 检测环 | 快慢指针 | O(n) | [141](https://leetcode.cn/problems/linked-list-cycle/) |
| 合并有序链表 | 双指针 | O(n) | [21](https://leetcode.cn/problems/merge-two-sorted-lists/) |
| 删除倒数第N个 | 双指针 | O(n) | [19](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) |

### 树问题

| 问题描述 | 解法 | 复杂度 | 题目链接 |
|---------|------|-------|---------|
| 二叉树遍历 | DFS/BFS | O(n) | [144](https://leetcode.cn/problems/binary-tree-preorder-traversal/) |
| 最大深度 | 递归 | O(n) | [104](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) |
| 路径总和 | DFS | O(n) | [112](https://leetcode.cn/problems/path-sum/) |
| 最大路径和 | 树形DP | O(n) | [124](https://leetcode.cn/problems/binary-tree-maximum-path-sum/) |

## 🧠 解题思维导图

### 1. 看到数组 → 想到什么？

```
数组
├── 有序 → 二分查找、双指针
├── 无序 → 哈希表、排序
├── 区间问题 → 前缀和、差分数组
└── 子数组 → 滑动窗口、动态规划
```

### 2. 看到字符串 → 想到什么？

```
字符串
├── 匹配 → KMP、哈希
├── 回文 → 中心扩展、DP
├── 子串 → 滑动窗口
└── 变换 → 编辑距离DP
```

### 3. 看到树 → 想到什么？

```
二叉树
├── 遍历 → DFS、BFS
├── 路径 → 递归、回溯
├── 构造 → 分治
└── 查找 → BST性质
```

## ⚡ 时间复杂度速查

| 算法 | 最好 | 平均 | 最坏 | 空间 |
|------|------|------|------|------|
| **冒泡排序** | O(n) | O(n²) | O(n²) | O(1) |
| **快速排序** | O(n log n) | O(n log n) | O(n²) | O(log n) |
| **归并排序** | O(n log n) | O(n log n) | O(n log n) | O(n) |
| **堆排序** | O(n log n) | O(n log n) | O(n log n) | O(1) |
| **二分查找** | O(1) | O(log n) | O(log n) | O(1) |
| **DFS/BFS** | O(V+E) | O(V+E) | O(V+E) | O(V) |

## 🎯 刷题策略

### 新手入门（1-2个月）
1. **基础语法**：熟悉语言特性
2. **简单题目**：数组、字符串基础操作
3. **核心算法**：排序、查找、遍历
4. **数据结构**：数组、链表、栈、队列

### 进阶提升（3-6个月）
1. **经典算法**：动态规划、回溯、贪心
2. **高级数据结构**：堆、哈希表、并查集
3. **图算法**：BFS、DFS、最短路径
4. **优化技巧**：时空复杂度优化

### 高级冲刺（6个月以上）
1. **困难题目**：复杂DP、图论进阶
2. **系统设计**：大数据处理、分布式
3. **数学算法**：数论、组合数学
4. **竞赛题目**：多种技巧综合运用

## 📝 面试技巧

### 1. 解题步骤
1. **理解题意**：确认输入输出、边界条件
2. **分析复杂度**：时间空间要求
3. **选择算法**：根据数据规模选择
4. **编码实现**：先写框架再填细节
5. **测试验证**：边界用例、正常用例

### 2. 沟通技巧
- **大声思考**：说出解题思路
- **从简单开始**：先实现暴力解法
- **逐步优化**：分析瓶颈，提出改进
- **处理边界**：考虑特殊情况

### 3. 常见陷阱
- **整数溢出**：注意数值范围
- **数组越界**：检查边界条件
- **空指针**：判断null/undefined
- **时间复杂度**：避免TLE

记住：**算法能力 = 模式识别 + 代码实现**。多练习，形成条件反射！
