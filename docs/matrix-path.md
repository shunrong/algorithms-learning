# 矩阵路径问题

> 矩阵路径问题是动态规划的经典应用，掌握不同路径约束下的解题策略是关键

## 🎯 核心思想

矩阵路径问题的本质是**在二维网格中寻找满足特定条件的路径**。核心是理解状态定义、边界处理和路径约束，选择合适的算法（DP、BFS、DFS）。

## 📋 基础路径

### 1. 基础路径计数

**不同路径I**：
```javascript
function uniquePaths(m, n) {
    // dp[i][j] = 到达位置(i,j)的路径数
    const dp = Array(m).fill().map(() => Array(n).fill(1));
    
    // 第一行和第一列都只有一种路径
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}
```

**空间优化版本**：
```javascript
function uniquePathsOptimized(m, n) {
    let dp = new Array(n).fill(1);
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] += dp[j-1];
        }
    }
    
    return dp[n-1];
}
```

**数学解法（组合数）**：
```javascript
function uniquePathsMath(m, n) {
    // 总共需要走m+n-2步，其中m-1步向下，n-1步向右
    // 答案是C(m+n-2, m-1)
    let result = 1;
    for (let i = 1; i <= Math.min(m-1, n-1); i++) {
        result = result * (m + n - 1 - i) / i;
    }
    return Math.round(result);
}
```

**不同路径II**（有障碍物）：
```javascript
function uniquePathsWithObstacles(obstacleGrid) {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
        return 0;
    }
    
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    dp[0][0] = 1;
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j-1];
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i-1][0];
    }
    
    // 填充DP表
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[i][j] = 0;
            } else {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
    }
    
    return dp[m-1][n-1];
}
```

**经典题目**：
- **[62. 不同路径](https://leetcode.cn/problems/unique-paths/)**
- **[63. 不同路径 II](https://leetcode.cn/problems/unique-paths-ii/)**

### 2. 最小路径和

**基础最小路径和**：
```javascript
function minPathSum(grid) {
    const m = grid.length;
    const n = grid[0].length;
    
    // dp[i][j] = 到达(i,j)的最小路径和
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // 初始化起点
    dp[0][0] = grid[0][0];
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }
    
    // 填充DP表
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }
    
    return dp[m-1][n-1];
}
```

**原地DP优化**：
```javascript
function minPathSumInPlace(grid) {
    const m = grid.length;
    const n = grid[0].length;
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        grid[0][j] += grid[0][j-1];
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        grid[i][0] += grid[i-1][0];
    }
    
    // 更新其他位置
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
        }
    }
    
    return grid[m-1][n-1];
}
```

**三角形最小路径和**：
```javascript
function minimumTotal(triangle) {
    const n = triangle.length;
    // 从底向上DP
    const dp = [...triangle[n-1]];
    
    for (let i = n - 2; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
            dp[j] = Math.min(dp[j], dp[j+1]) + triangle[i][j];
        }
    }
    
    return dp[0];
}
```

**经典题目**：
- **[64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/)**
- **[120. 三角形最小路径和](https://leetcode.cn/problems/triangle/)**

### 3. 最大路径和

**二叉树最大路径和**：
```javascript
function maxPathSum(root) {
    let maxSum = -Infinity;
    
    function maxPathSumHelper(node) {
        if (!node) return 0;
        
        // 计算左右子树的最大贡献值
        const leftGain = Math.max(maxPathSumHelper(node.left), 0);
        const rightGain = Math.max(maxPathSumHelper(node.right), 0);
        
        // 当前节点为根的路径最大值
        const currentMax = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentMax);
        
        // 返回当前节点能向上提供的最大值
        return node.val + Math.max(leftGain, rightGain);
    }
    
    maxPathSumHelper(root);
    return maxSum;
}
```

**矩阵中的最大路径和**：
```javascript
function maxPathSumMatrix(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    const dp = Array(m).fill().map(() => Array(n).fill(-Infinity));
    
    dp[0][0] = matrix[0][0];
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + matrix[0][j];
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + matrix[i][0];
    }
    
    // 填充DP表
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]) + matrix[i][j];
        }
    }
    
    return dp[m-1][n-1];
}
```

## 🧠 复杂路径问题

### 1. 多方向路径

**下降路径最小和**：
```javascript
function minFallingPathSum(matrix) {
    const n = matrix.length;
    let dp = [...matrix[0]];
    
    for (let i = 1; i < n; i++) {
        const newDp = new Array(n);
        for (let j = 0; j < n; j++) {
            newDp[j] = dp[j];  // 正上方
            if (j > 0) newDp[j] = Math.min(newDp[j], dp[j-1]);  // 左上方
            if (j < n-1) newDp[j] = Math.min(newDp[j], dp[j+1]);  // 右上方
            newDp[j] += matrix[i][j];
        }
        dp = newDp;
    }
    
    return Math.min(...dp);
}
```

**八方向路径**：
```javascript
function minPathSumEightDirections(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    // 使用Dijkstra算法
    const dist = Array(m).fill().map(() => Array(n).fill(Infinity));
    const pq = [[grid[0][0], 0, 0]];  // [distance, row, col]
    dist[0][0] = grid[0][0];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, row, col] = pq.shift();
        
        if (d > dist[row][col]) continue;
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
                const newDist = dist[row][col] + grid[newRow][newCol];
                
                if (newDist < dist[newRow][newCol]) {
                    dist[newRow][newCol] = newDist;
                    pq.push([newDist, newRow, newCol]);
                }
            }
        }
    }
    
    return dist[m-1][n-1];
}
```

### 2. 路径计数的高级问题

**骑士在棋盘上的概率**：
```javascript
function knightProbability(n, k, row, column) {
    const directions = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    
    // dp[i][j] = 在位置(i,j)的概率
    let dp = Array(n).fill().map(() => Array(n).fill(0));
    dp[row][column] = 1;
    
    for (let step = 0; step < k; step++) {
        const newDp = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dp[i][j] > 0) {
                    for (let [di, dj] of directions) {
                        const ni = i + di;
                        const nj = j + dj;
                        
                        if (ni >= 0 && ni < n && nj >= 0 && nj < n) {
                            newDp[ni][nj] += dp[i][j] / 8;
                        }
                    }
                }
            }
        }
        
        dp = newDp;
    }
    
    // 计算仍在棋盘上的概率
    let result = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            result += dp[i][j];
        }
    }
    
    return result;
}
```

### 3. 路径恢复

**路径恢复模板**：
```javascript
function pathWithReconstruction(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(m).fill().map(() => Array(n).fill(Infinity));
    const parent = Array(m).fill().map(() => Array(n).fill(null));
    
    dp[0][0] = grid[0][0];
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i > 0 && dp[i-1][j] + grid[i][j] < dp[i][j]) {
                dp[i][j] = dp[i-1][j] + grid[i][j];
                parent[i][j] = [i-1, j];
            }
            if (j > 0 && dp[i][j-1] + grid[i][j] < dp[i][j]) {
                dp[i][j] = dp[i][j-1] + grid[i][j];
                parent[i][j] = [i, j-1];
            }
        }
    }
    
    // 重构路径
    const path = [];
    let curr = [m-1, n-1];
    while (curr) {
        path.unshift(curr);
        curr = parent[curr[0]][curr[1]];
    }
    
    return {minSum: dp[m-1][n-1], path};
}
```

## 💡 高级技巧

### 1. 滚动数组优化

```javascript
function optimizedSpaceDP(grid) {
    const n = grid[0].length;
    let prev = new Array(n).fill(Infinity);
    let curr = new Array(n).fill(Infinity);
    
    prev[0] = grid[0][0];
    for (let j = 1; j < n; j++) {
        prev[j] = prev[j-1] + grid[0][j];
    }
    
    for (let i = 1; i < grid.length; i++) {
        curr[0] = prev[0] + grid[i][0];
        
        for (let j = 1; j < n; j++) {
            curr[j] = Math.min(prev[j], curr[j-1]) + grid[i][j];
        }
        
        [prev, curr] = [curr, prev];
    }
    
    return prev[n-1];
}
```

### 2. 状态压缩

```javascript
function pathWithState(grid) {
    const m = grid.length;
    const n = grid[0].length;
    
    // dp[i][j][state] = 到达(i,j)且状态为state的最优值
    const dp = Array(m).fill().map(() => 
        Array(n).fill().map(() => Array(stateCount).fill(Infinity)));
    
    dp[0][0][initialState] = grid[0][0];
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let state = 0; state < stateCount; state++) {
                if (dp[i][j][state] === Infinity) continue;
                
                // 尝试所有可能的移动和状态转换
                const moves = [[0,1], [1,0]];  // 右、下
                for (let [di, dj] of moves) {
                    const ni = i + di;
                    const nj = j + dj;
                    
                    if (ni < m && nj < n) {
                        const newState = getNewState(state, grid[ni][nj]);
                        const newCost = dp[i][j][state] + getCost(grid[ni][nj], state);
                        
                        dp[ni][nj][newState] = Math.min(dp[ni][nj][newState], newCost);
                    }
                }
            }
        }
    }
    
    return Math.min(...dp[m-1][n-1]);
}
```

## 🎯 练习题目

### 基础练习
- **[62. 不同路径](https://leetcode.cn/problems/unique-paths/)**
- **[64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/)**
- **[120. 三角形最小路径和](https://leetcode.cn/problems/triangle/)**

### 进阶练习
- **[931. 下降路径最小和](https://leet.cn/problems/minimum-falling-path-sum/)**
- **[1463. 摘樱桃 II](https://leetcode.cn/problems/cherry-pickup-ii/)**
- **[688. 骑士在棋盘上的概率](https://leetcode.cn/problems/knight-probability-in-chessboard/)**

### 困难练习
- **[741. 摘樱桃](https://leetcode.cn/problems/cherry-pickup/)**
- **[1575. 统计所有可行路径](https://leetcode.cn/problems/count-all-possible-routes/)**

## 🔄 总结

矩阵路径问题的核心要点：

1. **状态定义**：通常是`dp[i][j]`表示到达位置(i,j)的最优值
2. **转移方程**：根据可行的移动方向确定状态转移
3. **边界处理**：正确初始化第一行和第一列
4. **空间优化**：利用滚动数组减少空间复杂度

**问题分类**：
- **路径计数** → 基础DP，状态转移相加
- **最优路径** → DP，状态转移取最值
- **概率问题** → DP，状态转移累积概率
- **复杂约束** → 增加状态维度

**解题策略**：
1. 确定可行的移动方向
2. 设计状态定义（位置 + 额外信息）
3. 写出状态转移方程
4. 处理边界条件
5. 考虑空间优化

**常用优化**：
- 滚动数组优化空间
- 原地DP节省空间
- 数学公式直接计算（组合数）

掌握这些技巧，矩阵路径问题就能轻松应对！
