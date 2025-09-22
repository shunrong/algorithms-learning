# 图算法技巧

> 图算法是解决复杂关系问题的重要工具，掌握基本的图遍历和经典算法是关键

## 🎯 核心思想

图算法的本质是**处理节点间的关系和连接**。关键是选择合适的图表示方法和遍历策略，理解不同算法的适用场景和时间复杂度。

## 📋 图的表示

### 1. 邻接矩阵

```javascript
class GraphMatrix {
    constructor(vertices) {
        this.V = vertices;
        this.matrix = Array(vertices).fill().map(() => Array(vertices).fill(0));
    }
    
    addEdge(u, v, weight = 1) {
        this.matrix[u][v] = weight;
        this.matrix[v][u] = weight;  // 无向图
    }
    
    hasEdge(u, v) {
        return this.matrix[u][v] !== 0;
    }
}
```

### 2. 邻接表

```javascript
class GraphList {
    constructor(vertices) {
        this.V = vertices;
        this.adjList = Array(vertices).fill().map(() => []);
    }
    
    addEdge(u, v, weight = 1) {
        this.adjList[u].push({node: v, weight});
        this.adjList[v].push({node: u, weight});  // 无向图
    }
    
    getNeighbors(u) {
        return this.adjList[u];
    }
}
```

## 🧠 基础遍历

### 1. 深度优先搜索（DFS）

**递归实现**：
```javascript
function dfsRecursive(graph, start, visited = new Set()) {
    visited.add(start);
    console.log(start);  // 处理当前节点
    
    for (let neighbor of graph.getNeighbors(start)) {
        if (!visited.has(neighbor.node)) {
            dfsRecursive(graph, neighbor.node, visited);
        }
    }
}
```

**迭代实现**：
```javascript
function dfsIterative(graph, start) {
    const visited = new Set();
    const stack = [start];
    
    while (stack.length > 0) {
        const current = stack.pop();
        
        if (!visited.has(current)) {
            visited.add(current);
            console.log(current);  // 处理当前节点
            
            // 将邻居节点加入栈
            for (let neighbor of graph.getNeighbors(current)) {
                if (!visited.has(neighbor.node)) {
                    stack.push(neighbor.node);
                }
            }
        }
    }
}
```

**应用：检测环**：
```javascript
function hasCycleDFS(graph) {
    const visited = new Set();
    const recStack = new Set();
    
    function dfs(node) {
        visited.add(node);
        recStack.add(node);
        
        for (let neighbor of graph.getNeighbors(node)) {
            if (!visited.has(neighbor.node)) {
                if (dfs(neighbor.node)) return true;
            } else if (recStack.has(neighbor.node)) {
                return true;  // 发现环
            }
        }
        
        recStack.delete(node);
        return false;
    }
    
    for (let i = 0; i < graph.V; i++) {
        if (!visited.has(i)) {
            if (dfs(i)) return true;
        }
    }
    
    return false;
}
```

### 2. 广度优先搜索（BFS）

**标准BFS**：
```javascript
function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const current = queue.shift();
        console.log(current);  // 处理当前节点
        
        for (let neighbor of graph.getNeighbors(current)) {
            if (!visited.has(neighbor.node)) {
                visited.add(neighbor.node);
                queue.push(neighbor.node);
            }
        }
    }
}
```

**层序BFS**：
```javascript
function bfsLevels(graph, start) {
    const visited = new Set();
    const queue = [{node: start, level: 0}];
    visited.add(start);
    
    while (queue.length > 0) {
        const {node, level} = queue.shift();
        console.log(`Node ${node} at level ${level}`);
        
        for (let neighbor of graph.getNeighbors(node)) {
            if (!visited.has(neighbor.node)) {
                visited.add(neighbor.node);
                queue.push({node: neighbor.node, level: level + 1});
            }
        }
    }
}
```

**应用：最短路径**：
```javascript
function shortestPath(graph, start, end) {
    const visited = new Set();
    const queue = [{node: start, path: [start]}];
    visited.add(start);
    
    while (queue.length > 0) {
        const {node, path} = queue.shift();
        
        if (node === end) {
            return path;
        }
        
        for (let neighbor of graph.getNeighbors(node)) {
            if (!visited.has(neighbor.node)) {
                visited.add(neighbor.node);
                queue.push({
                    node: neighbor.node, 
                    path: [...path, neighbor.node]
                });
            }
        }
    }
    
    return null;  // 无路径
}
```

## 🔍 拓扑排序

### Kahn算法（基于入度）

```javascript
function topologicalSort(graph) {
    const inDegree = new Array(graph.V).fill(0);
    
    // 计算每个节点的入度
    for (let u = 0; u < graph.V; u++) {
        for (let neighbor of graph.getNeighbors(u)) {
            inDegree[neighbor.node]++;
        }
    }
    
    // 将入度为0的节点加入队列
    const queue = [];
    for (let i = 0; i < graph.V; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result = [];
    
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        
        // 减少邻居节点的入度
        for (let neighbor of graph.getNeighbors(current)) {
            inDegree[neighbor.node]--;
            if (inDegree[neighbor.node] === 0) {
                queue.push(neighbor.node);
            }
        }
    }
    
    return result.length === graph.V ? result : [];  // 有环则返回空数组
}
```

### DFS拓扑排序

```javascript
function topologicalSortDFS(graph) {
    const visited = new Set();
    const stack = [];
    
    function dfs(node) {
        visited.add(node);
        
        for (let neighbor of graph.getNeighbors(node)) {
            if (!visited.has(neighbor.node)) {
                dfs(neighbor.node);
            }
        }
        
        stack.push(node);  // 后序添加
    }
    
    for (let i = 0; i < graph.V; i++) {
        if (!visited.has(i)) {
            dfs(i);
        }
    }
    
    return stack.reverse();
}
```

**经典题目**：
- **[207. 课程表](https://leetcode.cn/problems/course-schedule/)**
- **[210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/)**

## 🛣️ 最短路径算法

### 1. Dijkstra算法（单源最短路径）

```javascript
function dijkstra(graph, start) {
    const dist = new Array(graph.V).fill(Infinity);
    const visited = new Set();
    const pq = [{node: start, distance: 0}];
    
    dist[start] = 0;
    
    while (pq.length > 0) {
        // 简化的优先队列（实际应用中使用堆）
        pq.sort((a, b) => a.distance - b.distance);
        const {node: u, distance} = pq.shift();
        
        if (visited.has(u)) continue;
        visited.add(u);
        
        for (let {node: v, weight} of graph.getNeighbors(u)) {
            const newDist = dist[u] + weight;
            
            if (newDist < dist[v]) {
                dist[v] = newDist;
                pq.push({node: v, distance: newDist});
            }
        }
    }
    
    return dist;
}
```

### 2. Bellman-Ford算法（处理负权边）

```javascript
function bellmanFord(graph, start) {
    const dist = new Array(graph.V).fill(Infinity);
    dist[start] = 0;
    
    // 松弛操作，进行V-1次
    for (let i = 0; i < graph.V - 1; i++) {
        for (let u = 0; u < graph.V; u++) {
            if (dist[u] !== Infinity) {
                for (let {node: v, weight} of graph.getNeighbors(u)) {
                    if (dist[u] + weight < dist[v]) {
                        dist[v] = dist[u] + weight;
                    }
                }
            }
        }
    }
    
    // 检测负权环
    for (let u = 0; u < graph.V; u++) {
        if (dist[u] !== Infinity) {
            for (let {node: v, weight} of graph.getNeighbors(u)) {
                if (dist[u] + weight < dist[v]) {
                    throw new Error("图中存在负权环");
                }
            }
        }
    }
    
    return dist;
}
```

### 3. Floyd-Warshall算法（所有点对最短路径）

```javascript
function floydWarshall(graph) {
    const dist = Array(graph.V).fill().map(() => Array(graph.V).fill(Infinity));
    
    // 初始化距离矩阵
    for (let i = 0; i < graph.V; i++) {
        dist[i][i] = 0;
        for (let {node: j, weight} of graph.getNeighbors(i)) {
            dist[i][j] = weight;
        }
    }
    
    // 三重循环更新最短距离
    for (let k = 0; k < graph.V; k++) {
        for (let i = 0; i < graph.V; i++) {
            for (let j = 0; j < graph.V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    return dist;
}
```

## 🌲 并查集（Union-Find）

```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill().map((_, i) => i);
        this.rank = new Array(n).fill(0);
        this.components = n;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // 路径压缩
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            // 按秩合并
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
            this.components--;
            return true;
        }
        return false;
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getComponents() {
        return this.components;
    }
}
```

**应用：Kruskal最小生成树**：
```javascript
function kruskal(edges, vertices) {
    // 按权重排序
    edges.sort((a, b) => a.weight - b.weight);
    
    const uf = new UnionFind(vertices);
    const mst = [];
    let totalWeight = 0;
    
    for (let {u, v, weight} of edges) {
        if (uf.union(u, v)) {
            mst.push({u, v, weight});
            totalWeight += weight;
            
            if (mst.length === vertices - 1) break;
        }
    }
    
    return {mst, totalWeight};
}
```

**经典题目**：
- **[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)**
- **[1319. 连通网络的操作次数](https://leetcode.cn/problems/number-of-operations-to-make-network-connected/)**

## 💡 高级算法

### 1. 强连通分量（Tarjan算法）

```javascript
function tarjanSCC(graph) {
    let index = 0;
    const stack = [];
    const indices = new Array(graph.V).fill(-1);
    const lowlinks = new Array(graph.V).fill(-1);
    const onStack = new Array(graph.V).fill(false);
    const sccs = [];
    
    function strongConnect(v) {
        indices[v] = index;
        lowlinks[v] = index;
        index++;
        stack.push(v);
        onStack[v] = true;
        
        for (let {node: w} of graph.getNeighbors(v)) {
            if (indices[w] === -1) {
                strongConnect(w);
                lowlinks[v] = Math.min(lowlinks[v], lowlinks[w]);
            } else if (onStack[w]) {
                lowlinks[v] = Math.min(lowlinks[v], indices[w]);
            }
        }
        
        // 如果v是强连通分量的根
        if (lowlinks[v] === indices[v]) {
            const scc = [];
            let w;
            do {
                w = stack.pop();
                onStack[w] = false;
                scc.push(w);
            } while (w !== v);
            sccs.push(scc);
        }
    }
    
    for (let i = 0; i < graph.V; i++) {
        if (indices[i] === -1) {
            strongConnect(i);
        }
    }
    
    return sccs;
}
```

### 2. 最大流算法（Ford-Fulkerson）

```javascript
function maxFlow(graph, source, sink) {
    const residualGraph = createResidualGraph(graph);
    let maxFlowValue = 0;
    
    while (true) {
        const path = findAugmentingPath(residualGraph, source, sink);
        if (!path) break;
        
        // 找到路径上的最小容量
        let pathFlow = Infinity;
        for (let i = 0; i < path.length - 1; i++) {
            const u = path[i];
            const v = path[i + 1];
            pathFlow = Math.min(pathFlow, residualGraph[u][v]);
        }
        
        // 更新残余图
        for (let i = 0; i < path.length - 1; i++) {
            const u = path[i];
            const v = path[i + 1];
            residualGraph[u][v] -= pathFlow;
            residualGraph[v][u] += pathFlow;
        }
        
        maxFlowValue += pathFlow;
    }
    
    return maxFlowValue;
}

function findAugmentingPath(graph, source, sink) {
    const visited = new Set();
    const queue = [{node: source, path: [source]}];
    visited.add(source);
    
    while (queue.length > 0) {
        const {node, path} = queue.shift();
        
        if (node === sink) return path;
        
        for (let i = 0; i < graph.length; i++) {
            if (!visited.has(i) && graph[node][i] > 0) {
                visited.add(i);
                queue.push({node: i, path: [...path, i]});
            }
        }
    }
    
    return null;
}
```

## 🎯 练习题目

### 基础练习
- **[797. 所有可能的路径](https://leetcode.cn/problems/all-paths-from-source-to-target/)**
- **[1971. 寻找图中是否存在路径](https://leetcode.cn/problems/find-if-path-exists-in-graph/)**

### 进阶练习
- **[207. 课程表](https://leetcode.cn/problems/course-schedule/)**
- **[785. 判断二分图](https://leetcode.cn/problems/is-graph-bipartite/)**
- **[743. 网络延迟时间](https://leetcode.cn/problems/network-delay-time/)**

### 困难练习
- **[332. 重新安排行程](https://leetcode.cn/problems/reconstruct-itinerary/)**
- **[1584. 连接所有点的最小费用](https://leetcode.cn/problems/min-cost-to-connect-all-points/)**

## 🔄 总结

图算法的核心要点：

1. **图的表示**：根据问题选择邻接矩阵或邻接表
2. **遍历策略**：DFS适合路径问题，BFS适合最短路径
3. **算法选择**：
   - 连通性 → DFS/BFS/并查集
   - 最短路径 → Dijkstra/Bellman-Ford
   - 拓扑排序 → Kahn/DFS
   - 最小生成树 → Kruskal/Prim

**解题思路**：
1. 识别问题类型（连通性、路径、环检测等）
2. 选择合适的图表示方法
3. 应用对应的经典算法
4. 注意时间复杂度和边界条件

掌握这些图算法，复杂的关系问题就能迎刃而解！
