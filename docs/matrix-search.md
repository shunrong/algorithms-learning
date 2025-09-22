# 矩阵搜索技巧

> 矩阵搜索结合了二分查找和图论搜索的特点，掌握不同场景的搜索策略是关键

## 🎯 核心思想

矩阵搜索的本质是**在二维空间中高效定位目标**。根据矩阵的性质（有序、部分有序、无序）选择合适的搜索策略，关键是理解如何利用矩阵的结构特点优化搜索过程。

## 📋 基础搜索

### 1. 完全有序矩阵搜索

**问题特征**：矩阵可以看作一维有序数组

```javascript
function searchMatrix(matrix, target) {
    if (!matrix || matrix.length === 0) return false;
    
    const m = matrix.length;
    const n = matrix[0].length;
    let left = 0, right = m * n - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const row = Math.floor(mid / n);
        const col = mid % n;
        const midValue = matrix[row][col];
        
        if (midValue === target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}
```

**应用场景**：每行第一个元素大于前一行最后一个元素

### 2. 行列有序矩阵搜索

**问题特征**：每行从左到右递增，每列从上到下递增

```javascript
function searchMatrix2(matrix, target) {
    if (!matrix || matrix.length === 0) return false;
    
    let row = 0;
    let col = matrix[0].length - 1;
    
    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] === target) {
            return true;
        } else if (matrix[row][col] > target) {
            col--;  // 当前值太大，向左移动
        } else {
            row++;  // 当前值太小，向下移动
        }
    }
    
    return false;
}
```

**关键思路**：从右上角或左下角开始搜索，每次能排除一行或一列

### 3. 矩阵中的第K小元素

**二分答案 + 计数**：
```javascript
function kthSmallest(matrix, k) {
    const n = matrix.length;
    let left = matrix[0][0];
    let right = matrix[n - 1][n - 1];
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const count = countLessEqual(matrix, mid);
        
        if (count < k) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}

function countLessEqual(matrix, target) {
    const n = matrix.length;
    let count = 0;
    let row = n - 1;
    let col = 0;
    
    while (row >= 0 && col < n) {
        if (matrix[row][col] <= target) {
            count += row + 1;  // 当前列的所有元素都<=target
            col++;
        } else {
            row--;
        }
    }
    
    return count;
}
```

**经典题目**：
- **[74. 搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/)**
- **[240. 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/)**
- **[378. 有序矩阵中第K小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix/)**

## 🧠 DFS/BFS搜索

### 1. 岛屿数量问题

**DFS解法**：
```javascript
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    
    function dfs(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] === '0') {
            return;
        }
        
        grid[row][col] = '0';  // 标记为已访问
        
        // 访问四个方向
        dfs(row - 1, col);
        dfs(row + 1, col);
        dfs(row, col - 1);
        dfs(row, col + 1);
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);
            }
        }
    }
    
    return count;
}
```

**BFS解法**：
```javascript
function numIslandsBFS(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let count = 0;
    
    function bfs(startRow, startCol) {
        const queue = [[startRow, startCol]];
        grid[startRow][startCol] = '0';
        
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            
            for (let [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    grid[newRow][newCol] === '1') {
                    
                    grid[newRow][newCol] = '0';
                    queue.push([newRow, newCol]);
                }
            }
        }
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                count++;
                bfs(i, j);
            }
        }
    }
    
    return count;
}
```

### 2. 最短路径问题

**BFS求最短路径**：
```javascript
function shortestPath(grid, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    const queue = [[startRow, startCol, 0]];  // [row, col, distance]
    const visited = new Set([`${startRow},${startCol}`]);
    
    while (queue.length > 0) {
        const [row, col, dist] = queue.shift();
        
        if (row === endRow && col === endCol) {
            return dist;
        }
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const key = `${newRow},${newCol}`;
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                grid[newRow][newCol] === 0 &&  // 0表示可通行
                !visited.has(key)) {
                
                visited.add(key);
                queue.push([newRow, newCol, dist + 1]);
            }
        }
    }
    
    return -1;  // 无法到达
}
```

**带权重的最短路径（Dijkstra）**：
```javascript
function shortestPathWeighted(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    // 最小堆实现
    const pq = [[0, 0, 0]];  // [distance, row, col]
    const dist = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    dist[0][0] = grid[0][0];
    
    while (pq.length > 0) {
        // 简化的优先队列（实际应用中使用堆）
        pq.sort((a, b) => a[0] - b[0]);
        const [d, row, col] = pq.shift();
        
        if (d > dist[row][col]) continue;
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const newDist = dist[row][col] + grid[newRow][newCol];
                
                if (newDist < dist[newRow][newCol]) {
                    dist[newRow][newCol] = newDist;
                    pq.push([newDist, newRow, newCol]);
                }
            }
        }
    }
    
    return dist[rows - 1][cols - 1];
}
```

### 3. 围绕区域问题

**DFS标记边界连通区域**：
```javascript
function solve(board) {
    if (!board || board.length === 0) return;
    
    const rows = board.length;
    const cols = board[0].length;
    
    function dfs(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col] !== 'O') {
            return;
        }
        
        board[row][col] = 'T';  // 临时标记
        
        dfs(row - 1, col);
        dfs(row + 1, col);
        dfs(row, col - 1);
        dfs(row, col + 1);
    }
    
    // 标记边界连通的'O'
    for (let i = 0; i < rows; i++) {
        if (board[i][0] === 'O') dfs(i, 0);
        if (board[i][cols - 1] === 'O') dfs(i, cols - 1);
    }
    
    for (let j = 0; j < cols; j++) {
        if (board[0][j] === 'O') dfs(0, j);
        if (board[rows - 1][j] === 'O') dfs(rows - 1, j);
    }
    
    // 处理剩余的'O'和恢复'T'
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 'O') {
                board[i][j] = 'X';
            } else if (board[i][j] === 'T') {
                board[i][j] = 'O';
            }
        }
    }
}
```

**经典题目**：
- **[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)**
- **[1091. 二进制矩阵中的最短路径](https://leetcode.cn/problems/shortest-path-in-binary-matrix/)**
- **[130. 被围绕的区域](https://leetcode.cn/problems/surrounded-regions/)**

## 💡 高级搜索技巧

### 1. 双向BFS

```javascript
function bidirectionalBFS(grid, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    
    let frontQueue = new Set([`${startRow},${startCol}`]);
    let backQueue = new Set([`${endRow},${endCol}`]);
    let frontVisited = new Set([`${startRow},${startCol}`]);
    let backVisited = new Set([`${endRow},${endCol}`]);
    
    let steps = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (frontQueue.size > 0 && backQueue.size > 0) {
        // 总是从较小的队列开始搜索
        if (frontQueue.size > backQueue.size) {
            [frontQueue, backQueue] = [backQueue, frontQueue];
            [frontVisited, backVisited] = [backVisited, frontVisited];
        }
        
        steps++;
        const nextQueue = new Set();
        
        for (let pos of frontQueue) {
            const [row, col] = pos.split(',').map(Number);
            
            for (let [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                const newPos = `${newRow},${newCol}`;
                
                if (isValid(grid, newRow, newCol)) {
                    if (backVisited.has(newPos)) {
                        return steps;
                    }
                    
                    if (!frontVisited.has(newPos)) {
                        frontVisited.add(newPos);
                        nextQueue.add(newPos);
                    }
                }
            }
        }
        
        frontQueue = nextQueue;
    }
    
    return -1;
}
```

### 2. A*搜索算法

```javascript
function aStarSearch(grid, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    
    function heuristic(row, col) {
        return Math.abs(row - endRow) + Math.abs(col - endCol);
    }
    
    const openSet = [{row: startRow, col: startCol, f: 0, g: 0}];
    const closedSet = new Set();
    const gScore = new Map();
    gScore.set(`${startRow},${startCol}`, 0);
    
    while (openSet.length > 0) {
        // 选择f值最小的节点
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        const {row, col, g} = current;
        
        if (row === endRow && col === endCol) {
            return g;
        }
        
        const currentKey = `${row},${col}`;
        closedSet.add(currentKey);
        
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const neighborKey = `${newRow},${newCol}`;
            
            if (!isValid(grid, newRow, newCol) || closedSet.has(neighborKey)) {
                continue;
            }
            
            const tentativeG = g + 1;
            
            if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
                gScore.set(neighborKey, tentativeG);
                const h = heuristic(newRow, newCol);
                const f = tentativeG + h;
                
                openSet.push({row: newRow, col: newCol, f, g: tentativeG});
            }
        }
    }
    
    return -1;
}
```

## 🎯 练习题目

### 基础练习
- **[74. 搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/)**
- **[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)**
- **[733. 图像渲染](https://leetcode.cn/problems/flood-fill/)**

### 进阶练习
- **[240. 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/)**
- **[542. 01 矩阵](https://leetcode.cn/problems/01-matrix/)**
- **[1091. 二进制矩阵中的最短路径](https://leetcode.cn/problems/shortest-path-in-binary-matrix/)**

### 困难练习
- **[378. 有序矩阵中第K小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix/)**
- **[1263. 推箱子](https://leetcode.cn/problems/minimum-moves-to-move-a-box-to-their-target-location/)**

## 🔄 总结

矩阵搜索的核心要点：

1. **根据矩阵性质选择算法**：
   - 完全有序 → 二分查找
   - 行列有序 → 从角落开始搜索
   - 无序 → DFS/BFS

2. **搜索策略**：
   - **目标查找** → 二分查找、有序搜索
   - **路径问题** → BFS求最短路径
   - **连通性** → DFS标记连通区域
   - **计数问题** → DFS/BFS遍历

3. **优化技巧**：
   - 双向BFS减少搜索空间
   - A*算法启发式搜索
   - 状态压缩减少重复计算

**算法选择指南**：
- 有序矩阵 → 二分查找
- 最短路径 → BFS
- 连通区域 → DFS
- 复杂约束 → A*或状态搜索

掌握这些搜索技巧，矩阵相关问题就能高效解决！
