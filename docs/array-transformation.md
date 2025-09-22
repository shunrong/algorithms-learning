# 数组变换技巧

> 数组变换是处理原地修改和重排问题的核心技巧，关键在于理解索引映射关系

## 🎯 核心思想

数组变换的本质是**在有限空间内重新组织数据**。核心技巧包括原地修改、索引映射、环形置换等，目标是用O(1)的额外空间完成数组重排。

## 📋 基础模式

### 1. 原地去重

**有序数组去重**：
```javascript
function removeDuplicates(nums) {
    if (nums.length <= 1) return nums.length;
    
    let slow = 0;  // 慢指针指向下一个不重复元素的位置
    
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1;
}
```

**允许重复最多k次**：
```javascript
function removeDuplicatesK(nums, k) {
    if (nums.length <= k) return nums.length;
    
    let slow = 0;
    
    for (let fast = 0; fast < nums.length; fast++) {
        if (slow < k || nums[fast] !== nums[slow - k]) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    
    return slow;
}
```

**移除指定元素**：
```javascript
function removeElement(nums, val) {
    let slow = 0;
    
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== val) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    
    return slow;
}
```

**经典题目**：
- **[26. 删除排序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)**
- **[27. 移除元素](https://leetcode.cn/problems/remove-element/)**
- **[80. 删除排序数组中的重复项 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/)**

### 2. 数组重排

**按奇偶重排**：
```javascript
function sortArrayByParity(nums) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        if (nums[left] % 2 === 0) {
            left++;
        } else if (nums[right] % 2 === 1) {
            right--;
        } else {
            // nums[left]是奇数，nums[right]是偶数，交换
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
            right--;
        }
    }
    
    return nums;
}
```

**颜色分类（荷兰国旗问题）**：
```javascript
function sortColors(nums) {
    let left = 0;      // [0, left) 都是0
    let right = nums.length - 1;  // (right, end] 都是2
    let i = 0;         // 当前处理的位置
    
    while (i <= right) {
        if (nums[i] === 0) {
            [nums[i], nums[left]] = [nums[left], nums[i]];
            left++;
            i++;
        } else if (nums[i] === 2) {
            [nums[i], nums[right]] = [nums[right], nums[i]];
            right--;
            // 注意：这里i不增加，因为交换过来的元素还没处理
        } else {
            i++;  // nums[i] === 1
        }
    }
}
```

**移动零到末尾**：
```javascript
function moveZeroes(nums) {
    let slow = 0;  // 下一个非零元素的位置
    
    // 第一遍：移动所有非零元素到前面
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    
    // 第二遍：剩余位置填零
    for (let i = slow; i < nums.length; i++) {
        nums[i] = 0;
    }
}

// 优化版本：最少交换次数
function moveZeroesOptimized(nums) {
    let left = 0;
    
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] !== 0) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
        }
    }
}
```

**经典题目**：
- **[75. 颜色分类](https://leetcode.cn/problems/sort-colors/)**
- **[283. 移动零](https://leetcode.cn/problems/move-zeroes/)**
- **[905. 按奇偶排序数组](https://leetcode.cn/problems/sort-array-by-parity/)**

### 3. 环形置换

**数组循环右移**：
```javascript
function rotate(nums, k) {
    const n = nums.length;
    k = k % n;  // 处理k大于数组长度的情况
    
    // 方法1：三次反转
    reverse(nums, 0, n - 1);        // 整体反转
    reverse(nums, 0, k - 1);        // 前k个反转
    reverse(nums, k, n - 1);        // 后n-k个反转
}

function reverse(nums, start, end) {
    while (start < end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start++;
        end--;
    }
}

// 方法2：环形置换
function rotateBySwap(nums, k) {
    const n = nums.length;
    k = k % n;
    let count = 0;  // 已处理的元素个数
    
    for (let start = 0; count < n; start++) {
        let current = start;
        let prev = nums[start];
        
        do {
            const next = (current + k) % n;
            [nums[next], prev] = [prev, nums[next]];
            current = next;
            count++;
        } while (start !== current);
    }
}
```

**下一个排列**：
```javascript
function nextPermutation(nums) {
    const n = nums.length;
    
    // 从右往左找第一个递减的位置
    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    
    if (i >= 0) {
        // 从右往左找第一个大于nums[i]的数
        let j = n - 1;
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }
        // 交换
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    
    // 反转i+1到末尾的部分
    reverse(nums, i + 1, n - 1);
}
```

**经典题目**：
- **[189. 轮转数组](https://leetcode.cn/problems/rotate-array/)**
- **[31. 下一个排列](https://leetcode.cn/problems/next-permutation/)**

### 4. 索引映射

**数组中数字的映射**：
```javascript
function findDisappearedNumbers(nums) {
    const n = nums.length;
    
    // 使用索引作为哈希表
    for (let i = 0; i < n; i++) {
        const index = Math.abs(nums[i]) - 1;
        if (nums[index] > 0) {
            nums[index] = -nums[index];  // 标记为负数
        }
    }
    
    const result = [];
    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) {
            result.push(i + 1);  // 未被标记的索引+1
        }
    }
    
    return result;
}
```

**找到重复数**：
```javascript
function findDuplicate(nums) {
    // 方法1：快慢指针（Floyd判圈算法）
    let slow = nums[0];
    let fast = nums[0];
    
    // 第一阶段：找到相遇点
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // 第二阶段：找到环的入口
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}

// 方法2：索引标记
function findDuplicateByMark(nums) {
    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(nums[i]);
        if (nums[index] < 0) {
            return index;
        }
        nums[index] = -nums[index];
    }
    return -1;
}
```

**经典题目**：
- **[287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)**
- **[448. 找到所有数组中消失的数字](https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array/)**
- **[442. 数组中重复的数据](https://leetcode.cn/problems/find-all-duplicates-in-an-array/)**

## 🧠 进阶技巧

### 1. 状态压缩

**游戏状态标记**：
```javascript
function gameOfLife(board) {
    const m = board.length, n = board[0].length;
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    // 使用额外的位来存储新状态
    // 00: 死→死, 01: 死→活, 10: 活→死, 11: 活→活
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let liveNeighbors = 0;
            
            for (let [di, dj] of directions) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                    liveNeighbors += board[ni][nj] & 1;  // 只看原始状态
                }
            }
            
            // 根据规则设置新状态
            if ((board[i][j] & 1) && (liveNeighbors === 2 || liveNeighbors === 3)) {
                board[i][j] |= 2;  // 活→活
            } else if (!(board[i][j] & 1) && liveNeighbors === 3) {
                board[i][j] |= 2;  // 死→活
            }
        }
    }
    
    // 更新到新状态
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            board[i][j] >>= 1;
        }
    }
}
```

### 2. 原地哈希

**第一个缺失的正数**：
```javascript
function firstMissingPositive(nums) {
    const n = nums.length;
    
    // 第一步：将数组作为哈希表，nums[i] = i+1
    for (let i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            // 将nums[i]放到正确位置
            [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
        }
    }
    
    // 第二步：找到第一个不在正确位置的数
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    return n + 1;
}
```

## 💡 实战技巧

### 1. 双指针技巧
```javascript
// 通用双指针模板
function twoPointerTransform(nums, condition) {
    let left = 0, right = 0;
    
    while (right < nums.length) {
        if (satisfies(nums[right], condition)) {
            nums[left] = process(nums[right]);
            left++;
        }
        right++;
    }
    
    return left;  // 新数组长度
}
```

### 2. 位操作技巧
```javascript
// 使用位操作标记状态
function markWithBit(nums) {
    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(nums[i]) - 1;
        if (index < nums.length) {
            nums[index] = -Math.abs(nums[index]);  // 标记为负数
        }
    }
}
```

### 3. 循环不变量
```javascript
// 维护循环不变量
function maintainInvariant(nums) {
    let i = 0;  // [0, i) 已处理
    let j = 0;  // [0, j) 满足条件
    
    while (i < nums.length) {
        if (condition(nums[i])) {
            nums[j] = nums[i];
            j++;
        }
        i++;
    }
    // 循环结束时：[0, j) 都满足条件
}
```

## 🎯 练习题目

### 基础练习
- **[26. 删除排序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)**
- **[27. 移除元素](https://leetcode.cn/problems/remove-element/)**
- **[283. 移动零](https://leetcode.cn/problems/move-zeroes/)**

### 进阶练习
- **[75. 颜色分类](https://leetcode.cn/problems/sort-colors/)**
- **[189. 轮转数组](https://leetcode.cn/problems/rotate-array/)**
- **[31. 下一个排列](https://leetcode.cn/problems/next-permutation/)**

### 困难练习
- **[41. 缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/)**
- **[287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)**
- **[289. 生命游戏](https://leetcode.cn/problems/game-of-life/)**

## 🔄 总结

数组变换的核心要点：

1. **原地修改**：用双指针技巧在O(1)空间内重排
2. **索引映射**：利用数组索引作为哈希表
3. **状态压缩**：用位操作存储多个状态
4. **环形置换**：处理循环移位问题

**解题思路**：
- **去重/移除** → 双指针
- **重排/分类** → 三指针或多次遍历
- **查找缺失/重复** → 索引映射
- **旋转/置换** → 反转或环形置换

掌握这些技巧，数组原地操作问题就能得心应手！
