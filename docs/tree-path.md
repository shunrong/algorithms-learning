# 二叉树路径问题

> 树的路径问题是树形DP的经典应用，关键在于理解路径的定义和状态的传递

## 🎯 核心思想

树的路径问题核心是**在递归过程中维护路径信息**。需要区分是否要求路径**从根节点开始**、是否要求**到叶子节点结束**，以及路径是否可以**经过任意节点**。

## 📋 路径问题分类

### 1. 根到叶路径问题

**特征**：路径必须从根节点开始，到叶子节点结束

**路径总和**：
```javascript
function hasPathSum(root, targetSum) {
    if (!root) return false;
    
    // 叶子节点
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }
    
    // 递归检查左右子树
    const remainingSum = targetSum - root.val;
    return hasPathSum(root.left, remainingSum) || 
           hasPathSum(root.right, remainingSum);
}
```

**路径总和II**（返回所有路径）：
```javascript
function pathSum(root, targetSum) {
    const result = [];
    const path = [];
    
    function dfs(node, remainingSum) {
        if (!node) return;
        
        path.push(node.val);
        
        // 叶子节点且和等于目标值
        if (!node.left && !node.right && remainingSum === node.val) {
            result.push([...path]);  // 复制当前路径
        }
        
        // 递归左右子树
        dfs(node.left, remainingSum - node.val);
        dfs(node.right, remainingSum - node.val);
        
        path.pop();  // 回溯
    }
    
    dfs(root, targetSum);
    return result;
}
```

**路径总和III**（路径可以从任意节点开始）：
```javascript
function pathSum3(root, targetSum) {
    if (!root) return 0;
    
    // 以当前节点为起点的路径数 + 左子树的路径数 + 右子树的路径数
    return pathSumFrom(root, targetSum) + 
           pathSum3(root.left, targetSum) + 
           pathSum3(root.right, targetSum);
}

function pathSumFrom(node, sum) {
    if (!node) return 0;
    
    let count = 0;
    if (node.val === sum) count++;
    
    count += pathSumFrom(node.left, sum - node.val);
    count += pathSumFrom(node.right, sum - node.val);
    
    return count;
}
```

**优化版本**（使用前缀和）：
```javascript
function pathSum3Optimized(root, targetSum) {
    const prefixSumCount = new Map();
    prefixSumCount.set(0, 1);  // 前缀和为0出现1次
    
    function dfs(node, currentSum) {
        if (!node) return 0;
        
        currentSum += node.val;
        
        // 查找是否存在前缀和为 currentSum - targetSum 的路径
        let count = prefixSumCount.get(currentSum - targetSum) || 0;
        
        // 更新前缀和计数
        prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);
        
        // 递归处理左右子树
        count += dfs(node.left, currentSum);
        count += dfs(node.right, currentSum);
        
        // 回溯：移除当前路径的影响
        prefixSumCount.set(currentSum, prefixSumCount.get(currentSum) - 1);
        
        return count;
    }
    
    return dfs(root, 0);
}
```

**经典题目**：
- **[112. 路径总和](https://leetcode.cn/problems/path-sum/)**
- **[113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)**
- **[437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/)**

### 2. 任意路径问题

**特征**：路径可以从任意节点开始，到任意节点结束

**二叉树中的最大路径和**：
```javascript
function maxPathSum(root) {
    let maxSum = -Infinity;
    
    function maxPathSumHelper(node) {
        if (!node) return 0;
        
        // 计算左右子树的最大贡献值（负数不取）
        const leftGain = Math.max(maxPathSumHelper(node.left), 0);
        const rightGain = Math.max(maxPathSumHelper(node.right), 0);
        
        // 当前节点为根的路径最大值
        const currentMax = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentMax);
        
        // 返回当前节点能贡献给父节点的最大值
        return node.val + Math.max(leftGain, rightGain);
    }
    
    maxPathSumHelper(root);
    return maxSum;
}
```

**最长同值路径**：
```javascript
function longestUnivaluePath(root) {
    let maxLength = 0;
    
    function longestPath(node) {
        if (!node) return 0;
        
        const leftLength = longestPath(node.left);
        const rightLength = longestPath(node.right);
        
        let leftPath = 0, rightPath = 0;
        
        // 检查左子树是否与当前节点值相同
        if (node.left && node.left.val === node.val) {
            leftPath = leftLength + 1;
        }
        
        // 检查右子树是否与当前节点值相同
        if (node.right && node.right.val === node.val) {
            rightPath = rightLength + 1;
        }
        
        // 更新全局最大长度（左子树+右子树）
        maxLength = Math.max(maxLength, leftPath + rightPath);
        
        // 返回当前节点能提供的最大长度（选择左或右）
        return Math.max(leftPath, rightPath);
    }
    
    longestPath(root);
    return maxLength;
}
```

**经典题目**：
- **[124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)**
- **[687. 最长同值路径](https://leetcode.cn/problems/longest-univalue-path/)**
- **[543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)**

### 3. 路径计数问题

**二叉树的所有路径**：
```javascript
function binaryTreePaths(root) {
    const result = [];
    
    function dfs(node, path) {
        if (!node) return;
        
        path.push(node.val.toString());
        
        // 叶子节点
        if (!node.left && !node.right) {
            result.push(path.join('->'));
        } else {
            dfs(node.left, path);
            dfs(node.right, path);
        }
        
        path.pop();  // 回溯
    }
    
    dfs(root, []);
    return result;
}
```

**求根节点到叶节点数字之和**：
```javascript
function sumNumbers(root) {
    function dfs(node, currentNumber) {
        if (!node) return 0;
        
        currentNumber = currentNumber * 10 + node.val;
        
        // 叶子节点
        if (!node.left && !node.right) {
            return currentNumber;
        }
        
        return dfs(node.left, currentNumber) + dfs(node.right, currentNumber);
    }
    
    return dfs(root, 0);
}
```

**经典题目**：
- **[257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)**
- **[129. 求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/)**

## 🧠 路径问题的通用模式

### 1. 自顶向下递归

**特点**：从根节点开始，向下传递信息

```javascript
function topDownPath(root, target) {
    function dfs(node, currentInfo) {
        if (!node) return;
        
        // 更新当前信息
        const newInfo = updateInfo(currentInfo, node.val);
        
        // 检查是否满足条件
        if (satisfiesCondition(newInfo, target)) {
            // 处理结果
        }
        
        // 递归处理子树
        dfs(node.left, newInfo);
        dfs(node.right, newInfo);
    }
    
    dfs(root, initialInfo);
}
```

### 2. 自底向上递归

**特点**：从叶子节点开始，向上返回信息

```javascript
function bottomUpPath(root) {
    function dfs(node) {
        if (!node) return baseCase;
        
        const leftResult = dfs(node.left);
        const rightResult = dfs(node.right);
        
        // 基于子树结果计算当前节点的结果
        const currentResult = combineResults(leftResult, rightResult, node.val);
        
        // 更新全局最优解
        updateGlobalOptimal(currentResult);
        
        // 返回当前节点能向上提供的信息
        return getContribution(currentResult);
    }
    
    dfs(root);
    return globalOptimal;
}
```

### 3. 路径回溯模式

**特点**：需要记录完整路径，使用回溯

```javascript
function pathBacktrack(root, target) {
    const result = [];
    const path = [];
    
    function dfs(node, remainingTarget) {
        if (!node) return;
        
        // 选择
        path.push(node.val);
        
        // 检查是否到达目标
        if (isTarget(node, remainingTarget)) {
            result.push([...path]);  // 保存路径副本
        }
        
        // 递归
        dfs(node.left, updateTarget(remainingTarget, node.val));
        dfs(node.right, updateTarget(remainingTarget, node.val));
        
        // 撤销选择
        path.pop();
    }
    
    dfs(root, target);
    return result;
}
```

## 💡 实战技巧

### 1. 路径状态的维护

```javascript
// 使用对象维护复杂状态
function complexPathProblem(root) {
    function dfs(node, state) {
        if (!node) return;
        
        const newState = {
            sum: state.sum + node.val,
            count: state.count + 1,
            maxVal: Math.max(state.maxVal, node.val),
            path: [...state.path, node.val]
        };
        
        // 处理当前状态
        
        dfs(node.left, newState);
        dfs(node.right, newState);
    }
    
    dfs(root, { sum: 0, count: 0, maxVal: -Infinity, path: [] });
}
```

### 2. 前缀和优化

```javascript
// 使用前缀和优化路径和查询
function pathSumWithPrefix(root, targetSum) {
    const prefixSum = new Map();
    prefixSum.set(0, 1);
    
    function dfs(node, currentSum) {
        if (!node) return 0;
        
        currentSum += node.val;
        const count = prefixSum.get(currentSum - targetSum) || 0;
        
        prefixSum.set(currentSum, (prefixSum.get(currentSum) || 0) + 1);
        
        const result = count + dfs(node.left, currentSum) + dfs(node.right, currentSum);
        
        prefixSum.set(currentSum, prefixSum.get(currentSum) - 1);
        
        return result;
    }
    
    return dfs(root, 0);
}
```

### 3. 路径长度与路径值的区分

```javascript
// 路径长度问题
function maxDepth(root) {
    if (!root) return 0;
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}

// 路径值问题
function maxPathValue(root) {
    if (!root) return 0;
    
    const leftMax = Math.max(0, maxPathValue(root.left));
    const rightMax = Math.max(0, maxPathValue(root.right));
    
    return root.val + Math.max(leftMax, rightMax);
}
```

## 🎯 练习题目

### 基础练习
- **[112. 路径总和](https://leetcode.cn/problems/path-sum/)**
- **[257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)**
- **[129. 求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/)**

### 进阶练习
- **[113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)**
- **[437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/)**
- **[543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)**

### 困难练习
- **[124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)**
- **[687. 最长同值路径](https://leetcode.cn/problems/longest-univalue-path/)**
- **[1372. 二叉树中的最长交错路径](https://leetcode.cn/problems/longest-zigzag-path-in-a-binary-tree/)**

## 🔄 总结

树路径问题的解题要点：

1. **明确路径定义**：根到叶？任意节点？是否连续？
2. **选择递归方向**：自顶向下传递信息，还是自底向上汇总？
3. **状态维护**：需要维护什么信息？路径、和、长度？
4. **全局vs局部**：当前节点作为路径一部分 vs 作为路径起点

**解题模式**：
- **路径和问题** → 前缀和 + DFS
- **最大路径问题** → 自底向上递归
- **路径计数问题** → 回溯 + DFS
- **路径长度问题** → 树形DP

掌握这些模式，树的路径问题就能轻松解决！
