# 二叉树遍历技巧

> 树的遍历是树形结构问题的基础，掌握各种遍历方式是解决树问题的前提

## 🎯 核心思想

二叉树遍历的本质是**按照某种规则访问树中的每个节点**。不同的遍历顺序适用于不同的问题场景，关键是理解何时访问根节点。

## 📋 遍历分类

### 1. 深度优先遍历（DFS）

#### 前序遍历（根→左→右）

**递归实现**：
```javascript
function preorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        
        result.push(node.val);  // 访问根节点
        dfs(node.left);         // 遍历左子树
        dfs(node.right);        // 遍历右子树
    }
    
    dfs(root);
    return result;
}
```

**迭代实现**：
```javascript
function preorderTraversal(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);
        
        // 先压右子树，再压左子树（栈的后进先出特性）
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    
    return result;
}
```

**应用场景**：
- 树的复制
- 表达式树的前缀表示
- 目录结构的显示

#### 中序遍历（左→根→右）

**递归实现**：
```javascript
function inorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        
        dfs(node.left);         // 遍历左子树
        result.push(node.val);  // 访问根节点
        dfs(node.right);        // 遍历右子树
    }
    
    dfs(root);
    return result;
}
```

**迭代实现**：
```javascript
function inorderTraversal(root) {
    const result = [];
    const stack = [];
    let curr = root;
    
    while (curr || stack.length > 0) {
        // 一直向左走到底
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        
        // 处理栈顶节点
        curr = stack.pop();
        result.push(curr.val);
        
        // 转向右子树
        curr = curr.right;
    }
    
    return result;
}
```

**应用场景**：
- **二叉搜索树**：中序遍历得到有序序列
- 表达式树的中缀表示
- 验证BST的有效性

#### 后序遍历（左→右→根）

**递归实现**：
```javascript
function postorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        
        dfs(node.left);         // 遍历左子树
        dfs(node.right);        // 遍历右子树
        result.push(node.val);  // 访问根节点
    }
    
    dfs(root);
    return result;
}
```

**迭代实现**：
```javascript
function postorderTraversal(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [];
    let lastVisited = null;
    let curr = root;
    
    while (curr || stack.length > 0) {
        if (curr) {
            stack.push(curr);
            curr = curr.left;
        } else {
            const peekNode = stack[stack.length - 1];
            
            // 如果右子树存在且未被访问
            if (peekNode.right && lastVisited !== peekNode.right) {
                curr = peekNode.right;
            } else {
                result.push(peekNode.val);
                lastVisited = stack.pop();
            }
        }
    }
    
    return result;
}
```

**应用场景**：
- 计算目录大小
- 删除节点（先删子节点再删父节点）
- 表达式树的后缀表示

### 2. 广度优先遍历（BFS）

#### 层序遍历

**基础层序遍历**：
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

**锯齿形层序遍历**：
```javascript
function zigzagLevelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    let leftToRight = true;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}
```

## 🧠 解题模式

### 1. 遍历型问题

**模板**：
```javascript
function traversalSolution(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        
        // 在这里处理节点
        if (满足条件) {
            result.push(node.val);
        }
        
        dfs(node.left);
        dfs(node.right);
    }
    
    dfs(root);
    return result;
}
```

### 2. 分治型问题

**模板**：
```javascript
function divideConquer(root) {
    // 递归出口
    if (!root) return 基础值;
    
    // 分治
    const leftResult = divideConquer(root.left);
    const rightResult = divideConquer(root.right);
    
    // 合并结果
    return combine(leftResult, rightResult, root.val);
}
```

### 3. 路径问题

**路径和模板**：
```javascript
function hasPathSum(root, targetSum) {
    if (!root) return false;
    
    // 叶子节点
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }
    
    // 递归查找
    const remainingSum = targetSum - root.val;
    return hasPathSum(root.left, remainingSum) || 
           hasPathSum(root.right, remainingSum);
}
```

**路径收集模板**：
```javascript
function findPaths(root, target) {
    const result = [];
    const path = [];
    
    function dfs(node, remainingSum) {
        if (!node) return;
        
        path.push(node.val);
        
        if (!node.left && !node.right && remainingSum === node.val) {
            result.push([...path]);  // 复制路径
        }
        
        dfs(node.left, remainingSum - node.val);
        dfs(node.right, remainingSum - node.val);
        
        path.pop();  // 回溯
    }
    
    dfs(root, target);
    return result;
}
```

## 💡 实战技巧

### 1. 递归边界处理
```javascript
function handleBoundary(root) {
    // 空节点
    if (!root) return null;
    
    // 叶子节点
    if (!root.left && !root.right) {
        return 处理叶子节点;
    }
    
    // 只有一个子节点
    if (!root.left) return handleBoundary(root.right);
    if (!root.right) return handleBoundary(root.left);
    
    // 有两个子节点
    // 正常递归处理
}
```

### 2. 迭代中的状态维护
```javascript
// 使用额外信息扩展节点
class TreeNodeWithInfo {
    constructor(node, depth, path) {
        this.node = node;
        this.depth = depth;
        this.path = path;
    }
}

function iterativeWithState(root) {
    const stack = [new TreeNodeWithInfo(root, 0, [])];
    
    while (stack.length > 0) {
        const {node, depth, path} = stack.pop();
        
        // 处理当前节点
        const newPath = [...path, node.val];
        
        if (node.right) {
            stack.push(new TreeNodeWithInfo(node.right, depth + 1, newPath));
        }
        if (node.left) {
            stack.push(new TreeNodeWithInfo(node.left, depth + 1, newPath));
        }
    }
}
```

### 3. Morris遍历（O(1)空间）
```javascript
function morrisInorder(root) {
    const result = [];
    let curr = root;
    
    while (curr) {
        if (!curr.left) {
            result.push(curr.val);
            curr = curr.right;
        } else {
            // 找到中序前驱
            let predecessor = curr.left;
            while (predecessor.right && predecessor.right !== curr) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                // 建立线索
                predecessor.right = curr;
                curr = curr.left;
            } else {
                // 断开线索，访问节点
                predecessor.right = null;
                result.push(curr.val);
                curr = curr.right;
            }
        }
    }
    
    return result;
}
```

## 🎯 练习题目

### 基础练习
- [144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)
- [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)
- [145. 二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)

### 进阶练习
- [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)
- [103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)
- [112. 路径总和](https://leetcode.cn/problems/path-sum/)

### 困难练习
- [99. 恢复二叉搜索树](https://leetcode.cn/problems/recover-binary-search-tree/)
- [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)
- [297. 二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)

## 🔄 总结

二叉树遍历的选择策略：

1. **前序遍历**：需要先处理根节点的问题（复制、输出结构）
2. **中序遍历**：BST相关问题（验证、转换为有序数组）
3. **后序遍历**：需要先处理子树的问题（计算高度、删除节点）
4. **层序遍历**：按层处理的问题（最短路径、层次结构）

**关键思路**：
- **递归**：代码简洁，思路清晰
- **迭代**：空间可控，避免栈溢出
- **Morris**：O(1)空间，但代码复杂

根据具体问题选择最合适的遍历方式和实现方法！
