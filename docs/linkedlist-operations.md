# 链表操作技巧

> 链表是最基础的动态数据结构，掌握链表操作技巧是算法基本功

## 🎯 核心思想

链表操作的关键是**正确处理指针的指向关系**。由于链表的动态性，指针操作稍有不慎就会导致内存泄漏或段错误。

## 📋 技巧分类

### 1. 链表反转（Reverse）

**核心思想**：改变指针方向，将后继变为前驱

**迭代版本**：
```javascript
function reverseList(head) {
    let prev = null;
    let curr = head;
    
    while (curr !== null) {
        let next = curr.next;  // 保存下一个节点
        curr.next = prev;      // 反转指针
        prev = curr;           // 移动prev
        curr = next;           // 移动curr
    }
    
    return prev;  // prev成为新的头节点
}
```

**递归版本**：
```javascript
function reverseListRecursive(head) {
    // 基础情况
    if (!head || !head.next) return head;
    
    // 递归反转子链表
    let newHead = reverseListRecursive(head.next);
    
    // 反转当前节点
    head.next.next = head;
    head.next = null;
    
    return newHead;
}
```

**部分反转**（反转区间[left, right]）：
```javascript
function reverseBetween(head, left, right) {
    if (left === right) return head;
    
    let dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;
    
    // 移动到反转区间前一个节点
    for (let i = 0; i < left - 1; i++) {
        prev = prev.next;
    }
    
    let curr = prev.next;
    // 使用头插法反转区间内的节点
    for (let i = 0; i < right - left; i++) {
        let next = curr.next;
        curr.next = next.next;
        next.next = prev.next;
        prev.next = next;
    }
    
    return dummy.next;
}
```

### 2. 链表合并（Merge）

**两个有序链表合并**：
```javascript
function mergeTwoLists(l1, l2) {
    let dummy = new ListNode(0);
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
    
    // 连接剩余节点
    curr.next = l1 || l2;
    
    return dummy.next;
}
```

**K个有序链表合并**：
```javascript
function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;
    
    // 分治合并
    while (lists.length > 1) {
        let mergedLists = [];
        
        for (let i = 0; i < lists.length; i += 2) {
            let l1 = lists[i];
            let l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        
        lists = mergedLists;
    }
    
    return lists[0];
}
```

### 3. 链表删除（Remove）

**删除指定值的节点**：
```javascript
function removeElements(head, val) {
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy;
    
    while (curr.next) {
        if (curr.next.val === val) {
            curr.next = curr.next.next;  // 跳过要删除的节点
        } else {
            curr = curr.next;
        }
    }
    
    return dummy.next;
}
```

**删除倒数第N个节点**：
```javascript
function removeNthFromEnd(head, n) {
    let dummy = new ListNode(0);
    dummy.next = head;
    let fast = dummy, slow = dummy;
    
    // fast先走n+1步
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // fast和slow一起走
    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }
    
    // 删除slow的下一个节点
    slow.next = slow.next.next;
    
    return dummy.next;
}
```

### 4. 快慢指针技巧

**检测环**：
```javascript
function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head, fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) return true;
    }
    
    return false;
}
```

**找环的起始位置**：
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
    
    // 第二阶段：找环的起始位置
    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}
```

**找链表中点**：
```javascript
function findMiddle(head) {
    let slow = head, fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;  // 偶数个节点时返回第二个中点
}
```

## 🧠 解题思路

### 关键技巧

1. **哨兵节点（Dummy Node）**：简化边界处理
```javascript
let dummy = new ListNode(0);
dummy.next = head;
// 统一处理头节点的删除/插入
```

2. **保存关键指针**：避免丢失节点
```javascript
let next = curr.next;  // 操作前先保存
curr.next = prev;      // 再修改指针
```

3. **双指针配合**：处理位置关系
```javascript
// 维护两个指针的相对位置
let prev = dummy, curr = head;
while (curr) {
    // prev始终是curr的前一个节点
}
```

### 常见模式

1. **头插法**：将节点插入到链表头部
2. **尾插法**：将节点插入到链表尾部  
3. **就地反转**：在原链表上直接修改指针
4. **分治处理**：将大问题分解为小问题

## 💡 实战技巧

### 1. 边界条件处理
```javascript
function safeOperation(head) {
    // 空链表
    if (!head) return null;
    
    // 单节点
    if (!head.next) return head;
    
    // 正常处理
    // ...
}
```

### 2. 指针操作顺序
```javascript
// 错误的顺序（会丢失节点）
curr.next = prev;
let next = curr.next;  // next变成了prev！

// 正确的顺序
let next = curr.next;  // 先保存
curr.next = prev;      // 再修改
```

### 3. 递归终止条件
```javascript
function recursiveOperation(head) {
    // 边界条件要完备
    if (!head || !head.next) {
        return head;  // 或其他适当的返回值
    }
    
    // 递归处理
    let result = recursiveOperation(head.next);
    
    // 处理当前节点
    // ...
    
    return result;
}
```

## 🎯 练习题目

### 基础练习
- [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)
- [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)
- [83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)

### 进阶练习
- [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)
- [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)
- [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)

### 困难练习
- [25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)
- [23. 合并K个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)
- [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

## 🔄 总结

链表操作的核心要点：

1. **指针安全**：操作前先保存，避免丢失节点
2. **边界处理**：空链表、单节点的特殊情况
3. **哨兵技巧**：用dummy节点简化头节点操作
4. **双指针**：快慢指针解决位置关系问题

**记住**：链表题目看起来简单，但指针操作容易出错。**画图分析 + 仔细验证边界条件**是成功的关键！
