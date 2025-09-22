# 矩阵遍历技巧

> 矩阵遍历是二维数组操作的基础，掌握各种遍历模式能解决大部分矩阵相关问题

## 🎯 核心思想

矩阵遍历的关键是**正确处理边界条件和遍历方向**。不同的遍历模式适用于不同的问题场景，核心是理解如何控制行列的移动。

## 📋 遍历模式

### 1. 螺旋遍历

**问题描述**：按螺旋顺序遍历矩阵

**思路**：维护四个边界，按照 右→下→左→上 的顺序遍历

```javascript
function spiralOrder(matrix) {
    if (!matrix || matrix.length === 0) return [];
    
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // 从左到右
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++;
        
        // 从上到下
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--;
        
        // 从右到左（注意边界检查）
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--;
        }
        
        // 从下到上（注意边界检查）
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++;
        }
    }
    
    return result;
}
```

**生成螺旋矩阵**：
```javascript
function generateMatrix(n) {
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    let num = 1;
    let top = 0, bottom = n - 1;
    let left = 0, right = n - 1;
    
    while (top <= bottom && left <= right) {
        // 填充上边
        for (let col = left; col <= right; col++) {
            matrix[top][col] = num++;
        }
        top++;
        
        // 填充右边
        for (let row = top; row <= bottom; row++) {
            matrix[row][right] = num++;
        }
        right--;
        
        // 填充下边
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                matrix[bottom][col] = num++;
            }
            bottom--;
        }
        
        // 填充左边
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                matrix[row][left] = num++;
            }
            left++;
        }
    }
    
    return matrix;
}
```

### 2. 对角线遍历

**主对角线遍历**（从左上到右下）：
```javascript
function traverseMainDiagonal(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    
    // 上半部分（包括主对角线）
    for (let k = 0; k < cols; k++) {
        let row = 0, col = k;
        const diagonal = [];
        
        while (row < rows && col >= 0) {
            diagonal.push(matrix[row][col]);
            row++;
            col--;
        }
        result.push(diagonal);
    }
    
    // 下半部分
    for (let k = 1; k < rows; k++) {
        let row = k, col = cols - 1;
        const diagonal = [];
        
        while (row < rows && col >= 0) {
            diagonal.push(matrix[row][col]);
            row++;
            col--;
        }
        result.push(diagonal);
    }
    
    return result;
}
```

**反对角线遍历**：
```javascript
function traverseAntiDiagonal(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    const result = [];
    
    for (let sum = 0; sum < m + n - 1; sum++) {
        const diagonal = [];
        
        if (sum % 2 === 0) {
            // 从下往上
            for (let i = Math.min(sum, m - 1); i >= Math.max(0, sum - n + 1); i--) {
                diagonal.push(matrix[i][sum - i]);
            }
        } else {
            // 从上往下
            for (let i = Math.max(0, sum - n + 1); i <= Math.min(sum, m - 1); i++) {
                diagonal.push(matrix[i][sum - i]);
            }
        }
        
        result.push(...diagonal);
    }
    
    return result;
}
```

### 3. Z字形遍历

```javascript
function zigzagTraversal(matrix) {
    const result = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    for (let i = 0; i < rows; i++) {
        if (i % 2 === 0) {
            // 偶数行：从左到右
            for (let j = 0; j < cols; j++) {
                result.push(matrix[i][j]);
            }
        } else {
            // 奇数行：从右到左
            for (let j = cols - 1; j >= 0; j--) {
                result.push(matrix[i][j]);
            }
        }
    }
    
    return result;
}
```

### 4. 层序遍历

**按层从外到内遍历**：
```javascript
function layerTraversal(matrix) {
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        const layer = [];
        
        // 当前层的所有元素
        for (let col = left; col <= right; col++) {
            layer.push(matrix[top][col]);
        }
        for (let row = top + 1; row <= bottom; row++) {
            layer.push(matrix[row][right]);
        }
        if (top < bottom) {
            for (let col = right - 1; col >= left; col--) {
                layer.push(matrix[bottom][col]);
            }
        }
        if (left < right) {
            for (let row = bottom - 1; row > top; row--) {
                layer.push(matrix[row][left]);
            }
        }
        
        result.push(layer);
        top++; bottom--; left++; right--;
    }
    
    return result;
}
```

## 🧠 边界处理技巧

### 1. 统一边界检查
```javascript
function safeAccess(matrix, row, col) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return null;  // 或者其他默认值
    }
    
    return matrix[row][col];
}
```

### 2. 方向数组
```javascript
// 四个方向：上、右、下、左
const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function spiralOrderWithDirections(matrix) {
    if (!matrix || matrix.length === 0) return [];
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    const result = [];
    
    let row = 0, col = 0, dir = 1;  // 从右方向开始
    
    for (let i = 0; i < rows * cols; i++) {
        result.push(matrix[row][col]);
        visited[row][col] = true;
        
        const [dr, dc] = directions[dir];
        const newRow = row + dr;
        const newCol = col + dc;
        
        // 如果需要转向
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || visited[newRow][newCol]) {
            dir = (dir + 1) % 4;  // 顺时针转90度
        }
        
        row += directions[dir][0];
        col += directions[dir][1];
    }
    
    return result;
}
```

### 3. 递归边界
```javascript
function recursiveTraversal(matrix, top, bottom, left, right, result) {
    if (top > bottom || left > right) return;
    
    // 遍历当前层
    for (let col = left; col <= right; col++) {
        result.push(matrix[top][col]);
    }
    
    for (let row = top + 1; row <= bottom; row++) {
        result.push(matrix[row][right]);
    }
    
    if (top < bottom) {
        for (let col = right - 1; col >= left; col--) {
            result.push(matrix[bottom][col]);
        }
    }
    
    if (left < right) {
        for (let row = bottom - 1; row > top; row--) {
            result.push(matrix[row][left]);
        }
    }
    
    // 递归处理内层
    recursiveTraversal(matrix, top + 1, bottom - 1, left + 1, right - 1, result);
}
```

## 💡 实战应用

### 1. 矩阵旋转
```javascript
function rotate(matrix) {
    const n = matrix.length;
    
    // 方法1：先转置，再水平翻转
    // 转置
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // 水平翻转
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}

function rotateInPlace(matrix) {
    const n = matrix.length;
    
    // 方法2：分层旋转
    for (let layer = 0; layer < Math.floor(n / 2); layer++) {
        const first = layer;
        const last = n - 1 - layer;
        
        for (let i = first; i < last; i++) {
            const offset = i - first;
            
            // 保存左上角
            const top = matrix[first][i];
            
            // 左上角 = 左下角
            matrix[first][i] = matrix[last - offset][first];
            
            // 左下角 = 右下角
            matrix[last - offset][first] = matrix[last][last - offset];
            
            // 右下角 = 右上角
            matrix[last][last - offset] = matrix[i][last];
            
            // 右上角 = 左上角
            matrix[i][last] = top;
        }
    }
}
```

### 2. 矩阵置零
```javascript
function setZeroes(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let firstRowZero = false;
    let firstColZero = false;
    
    // 检查第一行和第一列是否有零
    for (let j = 0; j < cols; j++) {
        if (matrix[0][j] === 0) {
            firstRowZero = true;
            break;
        }
    }
    
    for (let i = 0; i < rows; i++) {
        if (matrix[i][0] === 0) {
            firstColZero = true;
            break;
        }
    }
    
    // 用第一行和第一列作为标记
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    // 根据标记置零
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    // 处理第一行和第一列
    if (firstRowZero) {
        for (let j = 0; j < cols; j++) {
            matrix[0][j] = 0;
        }
    }
    
    if (firstColZero) {
        for (let i = 0; i < rows; i++) {
            matrix[i][0] = 0;
        }
    }
}
```

## 🎯 练习题目

### 基础练习
- [54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)
- [59. 螺旋矩阵 II](https://leetcode.cn/problems/spiral-matrix-ii/)
- [498. 对角线遍历](https://leetcode.cn/problems/diagonal-traverse/)

### 进阶练习
- [48. 旋转图像](https://leetcode.cn/problems/rotate-image/)
- [73. 矩阵置零](https://leetcode.cn/problems/set-matrix-zeroes/)
- [885. 螺旋矩阵 III](https://leetcode.cn/problems/spiral-matrix-iii/)

### 困难练习
- [1914. 循环轮转矩阵](https://leetcode.cn/problems/cyclically-rotating-a-grid/)
- [2326. 螺旋矩阵 IV](https://leetcode.cn/problems/spiral-matrix-iv/)

## 🔄 总结

矩阵遍历的核心要点：

1. **边界控制**：正确维护行列的边界条件
2. **方向管理**：使用方向数组统一处理方向变化
3. **边界检查**：避免越界访问
4. **状态维护**：使用visited数组或边界变量追踪状态

**常用技巧**：
- **四边界法**：维护top、bottom、left、right四个边界
- **方向数组**：用数组表示上下左右四个方向
- **层次遍历**：从外层到内层逐层处理
- **原地操作**：利用矩阵本身存储额外信息

掌握这些模式，矩阵遍历问题就能轻松解决！
