# 队列应用技巧

> 队列的FIFO特性使其在BFS、滑动窗口等场景中发挥重要作用

## 🎯 核心思想

队列（Queue）遵循**先进先出（FIFO）**原则，特别适合**层次化处理**和**时间序列**相关的问题。关键是理解何时使用队列来维护元素的顺序性。

## 📋 应用场景

### 1. 广度优先搜索（BFS）

**基础BFS模板**：
```javascript
function bfs(start, target) {
    const queue = [start];
    const visited = new Set([start]);
    let level = 0;
    
    while (queue.length > 0) {
        const size = queue.length;
        
        // 处理当前层的所有节点
        for (let i = 0; i < size; i++) {
            const current = queue.shift();
            
            if (current === target) {
                return level;
            }
            
            // 扩展邻居节点
            for (let neighbor of getNeighbors(current)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        
        level++;
    }
    
    return -1;  // 未找到
}
```

**二叉树层序遍历**：
```javascript
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}
```

**网格中的最短路径**：
```javascript
function shortestPathBinaryMatrix(grid) {
    const n = grid.length;
    if (grid[0][0] !== 0 || grid[n-1][n-1] !== 0) return -1;
    
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    const queue = [[0, 0, 1]];  // [row, col, distance]
    const visited = new Set(['0,0']);
    
    while (queue.length > 0) {
        const [row, col, dist] = queue.shift();
        
        if (row === n - 1 && col === n - 1) {
            return dist;
        }
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const key = `${newRow},${newCol}`;
            
            if (newRow >= 0 && newRow < n && 
                newCol >= 0 && newCol < n && 
                grid[newRow][newCol] === 0 && 
                !visited.has(key)) {
                
                visited.add(key);
                queue.push([newRow, newCol, dist + 1]);
            }
        }
    }
    
    return -1;
}
```

**经典题目**：
- **[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)**
- **[1091. 二进制矩阵中的最短路径](https://leetcode.cn/problems/shortest-path-in-binary-matrix/)**
- **[127. 单词接龙](https://leetcode.cn/problems/word-ladder/)**

### 2. 滑动窗口最值

**单调队列维护滑动窗口最大值**：
```javascript
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = [];  // 存储数组下标，维护单调递减
    
    for (let i = 0; i < nums.length; i++) {
        // 移除窗口外的元素
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        // 维护单调递减性
        while (deque.length > 0 && nums[i] >= nums[deque[deque.length - 1]]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // 窗口形成后开始记录结果
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}
```

**滑动窗口最小值**：
```javascript
function minSlidingWindow(nums, k) {
    const result = [];
    const deque = [];  // 维护单调递增
    
    for (let i = 0; i < nums.length; i++) {
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        while (deque.length > 0 && nums[i] <= nums[deque[deque.length - 1]]) {
            deque.pop();
        }
        
        deque.push(i);
        
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}
```

**经典题目**：
- **[239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)**
- **[1438. 绝对差不超过限制的最长连续子数组](https://leetcode.cn/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)**

### 3. 拓扑排序

**Kahn算法（基于队列的拓扑排序）**：
```javascript
function topologicalSort(numCourses, prerequisites) {
    // 构建图和入度数组
    const graph = Array(numCourses).fill().map(() => []);
    const inDegree = new Array(numCourses).fill(0);
    
    for (let [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // 将入度为0的节点加入队列
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result = [];
    
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        
        // 处理当前节点的邻居
        for (let neighbor of graph[current]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return result.length === numCourses ? result : [];
}
```

**检测有向图中的环**：
```javascript
function canFinish(numCourses, prerequisites) {
    const result = topologicalSort(numCourses, prerequisites);
    return result.length === numCourses;
}
```

**经典题目**：
- **[207. 课程表](https://leetcode.cn/problems/course-schedule/)**
- **[210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/)**

### 4. 多源BFS

**问题特征**：从多个起点同时开始搜索

```javascript
function wallsAndGates(rooms) {
    if (!rooms || rooms.length === 0) return;
    
    const rows = rooms.length;
    const cols = rooms[0].length;
    const queue = [];
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    
    // 将所有门（值为0）加入队列作为起点
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (rooms[i][j] === 0) {
                queue.push([i, j]);
            }
        }
    }
    
    while (queue.length > 0) {
        const [row, col] = queue.shift();
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                rooms[newRow][newCol] === 2147483647) {  // INF表示空房间
                
                rooms[newRow][newCol] = rooms[row][col] + 1;
                queue.push([newRow, newCol]);
            }
        }
    }
}
```

**01矩阵**：
```javascript
function updateMatrix(mat) {
    const rows = mat.length;
    const cols = mat[0].length;
    const queue = [];
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    
    // 初始化：0保持0，1设为无穷大
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (mat[i][j] === 0) {
                queue.push([i, j]);
            } else {
                mat[i][j] = Infinity;
            }
        }
    }
    
    while (queue.length > 0) {
        const [row, col] = queue.shift();
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                mat[newRow][newCol] > mat[row][col] + 1) {
                
                mat[newRow][newCol] = mat[row][col] + 1;
                queue.push([newRow, newCol]);
            }
        }
    }
    
    return mat;
}
```

**经典题目**：
- **[542. 01 矩阵](https://leetcode.cn/problems/01-matrix/)**
- **[994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)**

## 🧠 队列变种

### 1. 双端队列（Deque）

**特点**：两端都可以进出

```javascript
class Deque {
    constructor() {
        this.items = [];
    }
    
    // 前端操作
    addFront(item) {
        this.items.unshift(item);
    }
    
    removeFront() {
        return this.items.shift();
    }
    
    // 后端操作
    addRear(item) {
        this.items.push(item);
    }
    
    removeRear() {
        return this.items.pop();
    }
    
    getFront() {
        return this.items[0];
    }
    
    getRear() {
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}
```

### 2. 优先队列（堆）

**最小堆实现**：
```javascript
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
    
    insert(value) {
        this.heap.push(value);
        this.heapifyUp();
    }
    
    heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.heap[parentIndex] <= this.heap[index]) break;
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }
    
    heapifyDown() {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            const rightChildIndex = this.getRightChildIndex(index);
            
            if (rightChildIndex < this.heap.length && 
                this.heap[rightChildIndex] < this.heap[smallerChildIndex]) {
                smallerChildIndex = rightChildIndex;
            }
            
            if (this.heap[index] <= this.heap[smallerChildIndex]) break;
            
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }
    
    peek() {
        return this.heap[0];
    }
    
    size() {
        return this.heap.length;
    }
}
```

## 💡 实战技巧

### 1. BFS优化技巧
```javascript
// 双向BFS：从起点和终点同时搜索
function bidirectionalBFS(start, end) {
    if (start === end) return 0;
    
    let frontQueue = new Set([start]);
    let backQueue = new Set([end]);
    let frontVisited = new Set([start]);
    let backVisited = new Set([end]);
    let level = 0;
    
    while (frontQueue.size > 0 && backQueue.size > 0) {
        // 始终从较小的队列开始搜索
        if (frontQueue.size > backQueue.size) {
            [frontQueue, backQueue] = [backQueue, frontQueue];
            [frontVisited, backVisited] = [backVisited, frontVisited];
        }
        
        level++;
        const nextQueue = new Set();
        
        for (let node of frontQueue) {
            for (let neighbor of getNeighbors(node)) {
                if (backVisited.has(neighbor)) {
                    return level;
                }
                
                if (!frontVisited.has(neighbor)) {
                    frontVisited.add(neighbor);
                    nextQueue.add(neighbor);
                }
            }
        }
        
        frontQueue = nextQueue;
    }
    
    return -1;
}
```

### 2. 状态压缩BFS
```javascript
// 使用位运算压缩状态
function shortestPathAllKeys(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let start = null;
    let totalKeys = 0;
    
    // 找起点和钥匙数量
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '@') {
                start = [i, j];
            } else if (grid[i][j] >= 'a' && grid[i][j] <= 'f') {
                totalKeys++;
            }
        }
    }
    
    const target = (1 << totalKeys) - 1;  // 所有钥匙的状态
    const queue = [[...start, 0, 0]];     // [row, col, keys, steps]
    const visited = new Set([`${start[0]},${start[1]},0`]);
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    
    while (queue.length > 0) {
        const [row, col, keys, steps] = queue.shift();
        
        if (keys === target) return steps;
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols) {
                
                const cell = grid[newRow][newCol];
                let newKeys = keys;
                
                // 处理不同类型的格子
                if (cell === '#') continue;  // 墙
                if (cell >= 'A' && cell <= 'F') {  // 锁
                    const keyBit = 1 << (cell.charCodeAt(0) - 'A'.charCodeAt(0));
                    if ((keys & keyBit) === 0) continue;  // 没有对应钥匙
                }
                if (cell >= 'a' && cell <= 'f') {  // 钥匙
                    const keyBit = 1 << (cell.charCodeAt(0) - 'a'.charCodeAt(0));
                    newKeys |= keyBit;
                }
                
                const state = `${newRow},${newCol},${newKeys}`;
                if (!visited.has(state)) {
                    visited.add(state);
                    queue.push([newRow, newCol, newKeys, steps + 1]);
                }
            }
        }
    }
    
    return -1;
}
```

## 🎯 练习题目

### 基础练习
- **[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)**
- **[107. 二叉树的层序遍历 II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)**
- **[111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)**

### 进阶练习
- **[239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)**
- **[207. 课程表](https://leetcode.cn/problems/course-schedule/)**
- **[542. 01 矩阵](https://leetcode.cn/problems/01-matrix/)**

### 困难练习
- **[127. 单词接龙](https://leetcode.cn/problems/word-ladder/)**
- **[815. 公交路线](https://leetcode.cn/problems/bus-routes/)**
- **[864. 获取所有钥匙的最短路径](https://leetcode.cn/problems/shortest-path-to-get-all-keys/)**

## 🔄 总结

队列应用的核心要点：

1. **BFS遍历**：层次化搜索，求最短路径
2. **滑动窗口**：维护窗口内的最值
3. **拓扑排序**：处理有依赖关系的任务
4. **多源BFS**：多个起点的并行搜索

**选择策略**：
- 需要层次化处理 → BFS
- 需要维护顺序关系 → 队列
- 需要两端操作 → 双端队列
- 需要优先级 → 优先队列

掌握队列的这些应用，图论和搜索问题就能得心应手！
