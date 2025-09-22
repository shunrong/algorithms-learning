# 二叉树构造技巧

> 树的构造是理解树形结构的高级技巧，关键在于掌握不同遍历序列的特点和递归分治思想

## 🎯 核心思想

二叉树构造的本质是**利用遍历序列的性质，通过分治法递归构建树的结构**。关键是理解不同遍历方式提供的信息，以及如何确定根节点和左右子树的边界。

## 📋 基础构造

### 1. 从前序和中序构造

**核心思路**：前序遍历确定根节点，中序遍历确定左右子树

```javascript
function buildTree(preorder, inorder) {
    if (preorder.length === 0) return null;
    
    // 前序遍历的第一个元素是根节点
    const rootVal = preorder[0];
    const root = new TreeNode(rootVal);
    
    // 在中序遍历中找到根节点的位置
    const rootIndex = inorder.indexOf(rootVal);
    
    // 划分左右子树
    const leftInorder = inorder.slice(0, rootIndex);
    const rightInorder = inorder.slice(rootIndex + 1);
    
    const leftPreorder = preorder.slice(1, 1 + leftInorder.length);
    const rightPreorder = preorder.slice(1 + leftInorder.length);
    
    // 递归构造左右子树
    root.left = buildTree(leftPreorder, leftInorder);
    root.right = buildTree(rightPreorder, rightInorder);
    
    return root;
}
```

**优化版本**（使用哈希表和索引）：
```javascript
function buildTreeOptimized(preorder, inorder) {
    // 构建中序遍历的索引映射
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }
    
    let preorderIndex = 0;
    
    function build(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) return null;
        
        // 从前序遍历中取根节点
        const rootVal = preorder[preorderIndex++];
        const root = new TreeNode(rootVal);
        
        // 在中序遍历中找到根节点位置
        const rootIndex = inorderMap.get(rootVal);
        
        // 先构造左子树，再构造右子树（重要！）
        root.left = build(inorderStart, rootIndex - 1);
        root.right = build(rootIndex + 1, inorderEnd);
        
        return root;
    }
    
    return build(0, inorder.length - 1);
}
```

### 2. 从中序和后序构造

**核心思路**：后序遍历的最后一个元素是根节点

```javascript
function buildTreeFromInorderPostorder(inorder, postorder) {
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }
    
    let postorderIndex = postorder.length - 1;
    
    function build(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) return null;
        
        // 从后序遍历的末尾取根节点
        const rootVal = postorder[postorderIndex--];
        const root = new TreeNode(rootVal);
        
        const rootIndex = inorderMap.get(rootVal);
        
        // 注意：先构造右子树，再构造左子树
        root.right = build(rootIndex + 1, inorderEnd);
        root.left = build(inorderStart, rootIndex - 1);
        
        return root;
    }
    
    return build(0, inorder.length - 1);
}
```

### 3. 从前序和后序构造

**注意**：前序+后序无法唯一确定二叉树，但可以构造一种可能的结果

```javascript
function constructFromPrePost(preorder, postorder) {
    const postMap = new Map();
    for (let i = 0; i < postorder.length; i++) {
        postMap.set(postorder[i], i);
    }
    
    let preIndex = 0;
    
    function build(postStart, postEnd) {
        if (postStart > postEnd) return null;
        
        const rootVal = preorder[preIndex++];
        const root = new TreeNode(rootVal);
        
        if (postStart === postEnd) return root;
        
        // 左子树的根是preorder中的下一个元素
        const leftRootVal = preorder[preIndex];
        const leftRootPostIndex = postMap.get(leftRootVal);
        
        // 构造左右子树
        root.left = build(postStart, leftRootPostIndex);
        root.right = build(leftRootPostIndex + 1, postEnd - 1);
        
        return root;
    }
    
    return build(0, postorder.length - 1);
}
```

**经典题目**：
- **[105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)**
- **[106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)**
- **[889. 根据前序和后序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)**

## 🧠 特殊构造

### 1. 从数组构造完全二叉树

```javascript
function arrayToTree(arr) {
    if (!arr || arr.length === 0) return null;
    
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        
        // 左子节点
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        
        // 右子节点
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}
```

### 2. 从字符串构造

**括号表示法**：
```javascript
function stringToTree(s) {
    if (!s) return null;
    
    let index = 0;
    
    function parseTree() {
        if (index >= s.length) return null;
        
        // 解析节点值
        let num = '';
        if (s[index] === '-') {
            num += s[index++];
        }
        while (index < s.length && s[index] >= '0' && s[index] <= '9') {
            num += s[index++];
        }
        
        const root = new TreeNode(parseInt(num));
        
        // 处理左子树
        if (index < s.length && s[index] === '(') {
            index++; // 跳过 '('
            root.left = parseTree();
            index++; // 跳过 ')'
        }
        
        // 处理右子树
        if (index < s.length && s[index] === '(') {
            index++; // 跳过 '('
            root.right = parseTree();
            index++; // 跳过 ')'
        }
        
        return root;
    }
    
    return parseTree();
}
```

### 3. 从有序数组构造BST

```javascript
function sortedArrayToBST(nums) {
    if (!nums || nums.length === 0) return null;
    
    function buildBST(left, right) {
        if (left > right) return null;
        
        // 选择中间元素作为根节点
        const mid = Math.floor((left + right) / 2);
        const root = new TreeNode(nums[mid]);
        
        // 递归构造左右子树
        root.left = buildBST(left, mid - 1);
        root.right = buildBST(mid + 1, right);
        
        return root;
    }
    
    return buildBST(0, nums.length - 1);
}
```

### 4. 从链表构造BST

```javascript
function sortedListToBST(head) {
    if (!head) return null;
    if (!head.next) return new TreeNode(head.val);
    
    // 找到中点并断开链表
    const mid = findMiddleAndSplit(head);
    const root = new TreeNode(mid.val);
    
    // 递归构造左右子树
    root.left = sortedListToBST(head);
    root.right = sortedListToBST(mid.next);
    
    return root;
}

function findMiddleAndSplit(head) {
    let prev = null;
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 断开链表
    if (prev) prev.next = null;
    
    return slow;
}
```

## 🎯 高级构造

### 1. 根据描述构造

**最大二叉树**：
```javascript
function constructMaximumBinaryTree(nums) {
    if (!nums || nums.length === 0) return null;
    
    function buildTree(start, end) {
        if (start > end) return null;
        
        // 找到最大值和其索引
        let maxIndex = start;
        for (let i = start + 1; i <= end; i++) {
            if (nums[i] > nums[maxIndex]) {
                maxIndex = i;
            }
        }
        
        const root = new TreeNode(nums[maxIndex]);
        
        // 递归构造左右子树
        root.left = buildTree(start, maxIndex - 1);
        root.right = buildTree(maxIndex + 1, end);
        
        return root;
    }
    
    return buildTree(0, nums.length - 1);
}
```

**优化版本（使用单调栈）**：
```javascript
function constructMaximumBinaryTreeOptimized(nums) {
    const stack = [];
    
    for (let num of nums) {
        const curr = new TreeNode(num);
        
        while (stack.length > 0 && stack[stack.length - 1].val < num) {
            curr.left = stack.pop();
        }
        
        if (stack.length > 0) {
            stack[stack.length - 1].right = curr;
        }
        
        stack.push(curr);
    }
    
    return stack[0];
}
```

### 2. 序列化和反序列化

**前序序列化**：
```javascript
class Codec {
    serialize(root) {
        const result = [];
        
        function preorder(node) {
            if (!node) {
                result.push('null');
                return;
            }
            
            result.push(node.val.toString());
            preorder(node.left);
            preorder(node.right);
        }
        
        preorder(root);
        return result.join(',');
    }
    
    deserialize(data) {
        const values = data.split(',');
        let index = 0;
        
        function buildTree() {
            if (index >= values.length || values[index] === 'null') {
                index++;
                return null;
            }
            
            const root = new TreeNode(parseInt(values[index++]));
            root.left = buildTree();
            root.right = buildTree();
            
            return root;
        }
        
        return buildTree();
    }
}
```

**层序序列化**：
```javascript
function serializeLevelOrder(root) {
    if (!root) return '[]';
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    
    // 移除末尾的null
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }
    
    return JSON.stringify(result);
}

function deserializeLevelOrder(data) {
    const arr = JSON.parse(data);
    if (arr.length === 0) return null;
    
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}
```

## 💡 实战技巧

### 1. 边界处理技巧

```javascript
function handleBoundary(start, end) {
    // 空区间检查
    if (start > end) return null;
    
    // 单元素处理
    if (start === end) {
        return new TreeNode(arr[start]);
    }
    
    // 正常递归
    const mid = Math.floor((start + end) / 2);
    const root = new TreeNode(arr[mid]);
    root.left = buildTree(start, mid - 1);
    root.right = buildTree(mid + 1, end);
    
    return root;
}
```

### 2. 索引管理技巧

```javascript
class TreeBuilder {
    constructor(preorder, inorder) {
        this.preorder = preorder;
        this.inorderMap = new Map();
        this.preIndex = 0;
        
        for (let i = 0; i < inorder.length; i++) {
            this.inorderMap.set(inorder[i], i);
        }
    }
    
    build(inStart, inEnd) {
        if (inStart > inEnd) return null;
        
        const rootVal = this.preorder[this.preIndex++];
        const root = new TreeNode(rootVal);
        const rootIndex = this.inorderMap.get(rootVal);
        
        root.left = this.build(inStart, rootIndex - 1);
        root.right = this.build(rootIndex + 1, inEnd);
        
        return root;
    }
}
```

### 3. 构造顺序优化

```javascript
// 对于后序+中序，要先构造右子树
function buildFromPostorderInorder(postorder, inorder) {
    let postIndex = postorder.length - 1;
    
    function build(inStart, inEnd) {
        if (inStart > inEnd) return null;
        
        const rootVal = postorder[postIndex--];
        const root = new TreeNode(rootVal);
        const rootIndex = inorderMap.get(rootVal);
        
        // 注意：先右后左
        root.right = build(rootIndex + 1, inEnd);
        root.left = build(inStart, rootIndex - 1);
        
        return root;
    }
    
    return build(0, inorder.length - 1);
}
```

## 🎯 练习题目

### 基础练习
- **[108. 将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)**
- **[109. 有序链表转换二叉搜索树](https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree/)**

### 进阶练习
- **[105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)**
- **[654. 最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/)**
- **[297. 二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)**

### 困难练习
- **[1008. 前序遍历构造二叉搜索树](https://leetcode.cn/problems/construct-binary-search-tree-from-preorder-traversal/)**
- **[1028. 从先序遍历还原二叉树](https://leetcode.cn/problems/recover-a-tree-from-preorder-traversal/)**

## 🔄 总结

二叉树构造的核心要点：

1. **遍历性质**：理解不同遍历方式提供的信息
2. **分治思想**：将大问题分解为左右子树的子问题
3. **边界确定**：正确划分左右子树的边界
4. **索引管理**：合理使用索引避免重复计算

**构造策略**：
- **前序+中序** → 前序确定根，中序划分子树
- **中序+后序** → 后序确定根，中序划分子树
- **有序数组** → 中间元素作根，递归构造
- **特殊规则** → 根据题目规则分治构造

**关键技巧**：
- 使用哈希表优化查找
- 合理管理索引避免越界
- 注意构造顺序（前序vs后序）
- 正确处理边界条件

掌握这些构造技巧，任何二叉树构造问题都能迎刃而解！
