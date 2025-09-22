# 链表重构技巧

> 链表重构是对链表进行重新组织和排列的高级技巧，包括排序、分割、去重等操作

## 🎯 核心思想

链表重构的本质是**在保持或改变节点连接关系的同时，重新组织链表结构**。关键是正确处理指针操作，避免丢失节点或形成环路。

## 📋 基础操作

### 1. 链表排序

**归并排序（推荐）**：
```javascript
function sortList(head) {
    if (!head || !head.next) return head;
    
    // 分割链表
    const mid = getMid(head);
    const left = head;
    const right = mid.next;
    mid.next = null;  // 断开连接
    
    // 递归排序
    const sortedLeft = sortList(left);
    const sortedRight = sortList(right);
    
    // 合并有序链表
    return merge(sortedLeft, sortedRight);
}

function getMid(head) {
    let slow = head, fast = head.next;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}

function merge(l1, l2) {
    const dummy = new ListNode(0);
    let curr = dummy;
    
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    
    curr.next = l1 || l2;
    return dummy.next;
}
```

**快速排序**：
```javascript
function quickSortList(head) {
    if (!head || !head.next) return head;
    
    // 选择头节点作为基准
    const pivot = head;
    let curr = head.next;
    
    // 创建三个链表：小于、等于、大于基准值
    const smallHead = new ListNode(0);
    const equalHead = new ListNode(0);
    const largeHead = new ListNode(0);
    
    let small = smallHead, equal = equalHead, large = largeHead;
    equal.next = pivot;
    equal = equal.next;
    
    while (curr) {
        const next = curr.next;
        curr.next = null;
        
        if (curr.val < pivot.val) {
            small.next = curr;
            small = small.next;
        } else if (curr.val === pivot.val) {
            equal.next = curr;
            equal = equal.next;
        } else {
            large.next = curr;
            large = large.next;
        }
        
        curr = next;
    }
    
    // 递归排序小于和大于部分
    const sortedSmall = quickSortList(smallHead.next);
    const sortedLarge = quickSortList(largeHead.next);
    
    // 连接三部分
    return concatenate(sortedSmall, equalHead.next, sortedLarge);
}

function concatenate(list1, list2, list3) {
    const dummy = new ListNode(0);
    let curr = dummy;
    
    [list1, list2, list3].forEach(list => {
        while (list) {
            curr.next = list;
            curr = curr.next;
            list = list.next;
        }
    });
    
    return dummy.next;
}
```

**经典题目**：
- **[148. 排序链表](https://leetcode.cn/problems/sort-list/)**
- **[147. 对链表进行插入排序](https://leetcode.cn/problems/insertion-sort-list/)**

### 2. 链表分割

**按值分割**：
```javascript
function partition(head, x) {
    const beforeHead = new ListNode(0);
    const afterHead = new ListNode(0);
    
    let before = beforeHead;
    let after = afterHead;
    
    while (head) {
        if (head.val < x) {
            before.next = head;
            before = before.next;
        } else {
            after.next = head;
            after = after.next;
        }
        head = head.next;
    }
    
    after.next = null;  // 避免环路
    before.next = afterHead.next;
    
    return beforeHead.next;
}
```

**奇偶分割**：
```javascript
function oddEvenList(head) {
    if (!head || !head.next) return head;
    
    let odd = head;
    let even = head.next;
    let evenHead = even;
    
    while (even && even.next) {
        odd.next = even.next;
        odd = odd.next;
        even.next = odd.next;
        even = even.next;
    }
    
    odd.next = evenHead;
    return head;
}
```

**按长度分割**：
```javascript
function splitListToParts(head, k) {
    // 计算链表长度
    let length = 0;
    let curr = head;
    while (curr) {
        length++;
        curr = curr.next;
    }
    
    const partSize = Math.floor(length / k);
    const extraNodes = length % k;
    
    const result = [];
    curr = head;
    
    for (let i = 0; i < k; i++) {
        const partHead = curr;
        const currentPartSize = partSize + (i < extraNodes ? 1 : 0);
        
        // 移动到当前部分的末尾
        for (let j = 0; j < currentPartSize - 1 && curr; j++) {
            curr = curr.next;
        }
        
        if (curr) {
            const next = curr.next;
            curr.next = null;
            curr = next;
        }
        
        result.push(partHead);
    }
    
    return result;
}
```

**经典题目**：
- **[86. 分隔链表](https://leetcode.cn/problems/partition-list/)**
- **[328. 奇偶链表](https://leetcode.cn/problems/odd-even-linked-list/)**
- **[725. 分隔链表](https://leetcode.cn/problems/split-linked-list-in-parts/)**

### 3. 链表去重

**删除排序链表中的重复元素**：
```javascript
function deleteDuplicates(head) {
    let curr = head;
    
    while (curr && curr.next) {
        if (curr.val === curr.next.val) {
            curr.next = curr.next.next;
        } else {
            curr = curr.next;
        }
    }
    
    return head;
}
```

**删除排序链表中的重复元素II**（完全删除）：
```javascript
function deleteDuplicates2(head) {
    const dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;
    
    while (head) {
        if (head.next && head.val === head.next.val) {
            // 跳过所有重复的节点
            while (head.next && head.val === head.next.val) {
                head = head.next;
            }
            prev.next = head.next;
        } else {
            prev = prev.next;
        }
        head = head.next;
    }
    
    return dummy.next;
}
```

**无序链表去重**：
```javascript
function removeDuplicatesUnsorted(head) {
    const seen = new Set();
    const dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;
    
    while (head) {
        if (seen.has(head.val)) {
            prev.next = head.next;
        } else {
            seen.add(head.val);
            prev = prev.next;
        }
        head = head.next;
    }
    
    return dummy.next;
}
```

**经典题目**：
- **[83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)**
- **[82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)**

## 🧠 高级重构

### 1. 环形链表处理

**检测环并找到环的起始位置**：
```javascript
function detectCycle(head) {
    if (!head || !head.next) return null;
    
    let slow = head, fast = head;
    
    // 第一阶段：检测是否有环
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) break;
    }
    
    if (!fast || !fast.next) return null;
    
    // 第二阶段：找到环的起始位置
    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}
```

**删除环形链表中的环**：
```javascript
function removeLoop(head) {
    const cycleStart = detectCycle(head);
    if (!cycleStart) return head;
    
    // 找到环的尾节点
    let curr = cycleStart;
    while (curr.next !== cycleStart) {
        curr = curr.next;
    }
    
    // 断开环
    curr.next = null;
    return head;
}
```

### 2. 复杂链表复制

**复制带随机指针的链表**：
```javascript
function copyRandomList(head) {
    if (!head) return null;
    
    const map = new Map();
    
    // 第一遍：复制所有节点
    let curr = head;
    while (curr) {
        map.set(curr, new Node(curr.val));
        curr = curr.next;
    }
    
    // 第二遍：设置指针关系
    curr = head;
    while (curr) {
        const newNode = map.get(curr);
        newNode.next = curr.next ? map.get(curr.next) : null;
        newNode.random = curr.random ? map.get(curr.random) : null;
        curr = curr.next;
    }
    
    return map.get(head);
}

// 优化版本：O(1)空间
function copyRandomListOptimized(head) {
    if (!head) return null;
    
    // 第一步：在每个节点后插入复制节点
    let curr = head;
    while (curr) {
        const copy = new Node(curr.val);
        copy.next = curr.next;
        curr.next = copy;
        curr = copy.next;
    }
    
    // 第二步：设置random指针
    curr = head;
    while (curr) {
        if (curr.random) {
            curr.next.random = curr.random.next;
        }
        curr = curr.next.next;
    }
    
    // 第三步：分离两个链表
    const dummy = new Node(0);
    let copyCurr = dummy;
    curr = head;
    
    while (curr) {
        copyCurr.next = curr.next;
        curr.next = curr.next.next;
        copyCurr = copyCurr.next;
        curr = curr.next;
    }
    
    return dummy.next;
}
```

### 3. 链表重排

**重排链表**（L0→Ln→L1→Ln-1→...）：
```javascript
function reorderList(head) {
    if (!head || !head.next) return;
    
    // 找到中点
    let slow = head, fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 反转后半部分
    let second = reverseList(slow.next);
    slow.next = null;
    
    // 合并两部分
    let first = head;
    while (second) {
        const temp1 = first.next;
        const temp2 = second.next;
        
        first.next = second;
        second.next = temp1;
        
        first = temp1;
        second = temp2;
    }
}

function reverseList(head) {
    let prev = null, curr = head;
    
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}
```

**按组反转链表**：
```javascript
function reverseKGroup(head, k) {
    if (!head || k === 1) return head;
    
    // 检查是否有k个节点
    let curr = head;
    for (let i = 0; i < k; i++) {
        if (!curr) return head;
        curr = curr.next;
    }
    
    // 反转前k个节点
    curr = reverseKNodes(head, k);
    
    // 递归处理剩余部分
    head.next = reverseKGroup(curr, k);
    
    return curr;
}

function reverseKNodes(head, k) {
    let prev = null, curr = head;
    
    for (let i = 0; i < k; i++) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}
```

## 💡 实战技巧

### 1. 哨兵节点技巧
```javascript
function useDeymmy(head) {
    const dummy = new ListNode(0);
    dummy.next = head;
    
    // 统一处理头节点的操作
    let prev = dummy;
    let curr = head;
    
    while (curr) {
        if (shouldRemove(curr)) {
            prev.next = curr.next;
        } else {
            prev = curr;
        }
        curr = curr.next;
    }
    
    return dummy.next;
}
```

### 2. 多指针协作
```javascript
function multiplePointers(head) {
    let prev = null;
    let curr = head;
    let next = head ? head.next : null;
    
    while (curr) {
        // 处理当前节点
        processNode(prev, curr, next);
        
        // 移动指针
        prev = curr;
        curr = next;
        next = next ? next.next : null;
    }
}
```

### 3. 递归与迭代结合
```javascript
function hybridApproach(head) {
    // 迭代找到分割点
    const mid = findMid(head);
    
    // 递归处理子问题
    const left = processRecursively(head, mid);
    const right = processRecursively(mid.next, null);
    
    // 迭代合并结果
    return mergeIteratively(left, right);
}
```

## 🎯 练习题目

### 基础练习
- **[83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)**
- **[86. 分隔链表](https://leetcode.cn/problems/partition-list/)**
- **[328. 奇偶链表](https://leetcode.cn/problems/odd-even-linked-list/)**

### 进阶练习
- **[148. 排序链表](https://leetcode.cn/problems/sort-list/)**
- **[143. 重排链表](https://leetcode.cn/problems/reorder-list/)**
- **[138. 复制带随机指针的链表](https://leetcode.cn/problems/copy-list-with-random-pointer/)**

### 困难练习
- **[25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)**
- **[82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)**
- **[725. 分隔链表](https://leetcode.cn/problems/split-linked-list-in-parts/)**

## 🔄 总结

链表重构的核心要点：

1. **指针安全**：操作前保存关键指针，避免丢失节点
2. **哨兵技巧**：使用dummy节点简化边界处理
3. **分治思想**：将复杂问题分解为简单的子问题
4. **多指针协作**：合理使用多个指针维护状态

**解题策略**：
- **排序问题** → 归并排序（稳定、O(nlogn)）
- **分割问题** → 多指针分组处理
- **去重问题** → 哈希表或双指针
- **重排问题** → 分割+反转+合并

**常用模式**：
- 找中点 → 快慢指针
- 反转链表 → 三指针法
- 合并链表 → 双指针法
- 检测环 → Floyd算法

掌握这些重构技巧，复杂的链表操作就能轻松处理！
