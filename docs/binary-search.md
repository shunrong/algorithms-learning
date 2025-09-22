# 二分查找技巧

> 二分查找是最重要的算法之一，掌握二分思想能解决很多看似无关的问题

## 🎯 核心思想

二分查找的本质是**在有序空间中通过比较快速缩小搜索范围**。关键是理解什么情况下可以使用二分，以及如何正确处理边界条件。

## 📋 基础模板

### 1. 标准二分查找

**在有序数组中查找目标值**：
```javascript
function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;  // 未找到
}
```

**关键要点**：
- 循环条件：`left <= right`
- 中点计算：`Math.floor((left + right) / 2)`
- 区间更新：`left = mid + 1` 或 `right = mid - 1`

### 2. 左边界查找

**查找第一个大于等于target的位置**：
```javascript
function leftBound(nums, target) {
    let left = 0, right = nums.length;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;  // 不是mid-1，保留mid位置
        }
    }
    
    return left;
}
```

**应用场景**：
- 找到插入位置
- 统计小于target的元素个数
- 找到第一个满足条件的元素

### 3. 右边界查找

**查找最后一个小于等于target的位置**：
```javascript
function rightBound(nums, target) {
    let left = 0, right = nums.length;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] <= target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left - 1;
}
```

### 4. 通用二分模板

```javascript
function binarySearchTemplate(left, right, check) {
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (check(mid)) {
            right = mid;  // 答案在[left, mid]
        } else {
            left = mid + 1;  // 答案在[mid+1, right]
        }
    }
    
    return left;
}
```

**经典题目**：
- **[704. 二分查找](https://leetcode.cn/problems/binary-search/)**
- **[35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)**
- **[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)**

## 🧠 高级应用

### 1. 旋转数组中的查找

**搜索旋转排序数组**：
```javascript
function search(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // 判断哪一半是有序的
        if (nums[left] <= nums[mid]) {
            // 左半部分有序
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // 右半部分有序
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

**寻找旋转点**：
```javascript
function findMin(nums) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] > nums[right]) {
            // 最小值在右半部分
            left = mid + 1;
        } else {
            // 最小值在左半部分（包括mid）
            right = mid;
        }
    }
    
    return nums[left];
}
```

**经典题目**：
- **[33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)**
- **[153. 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)**

### 2. 答案的二分搜索

**爱吃香蕉的珂珂**：
```javascript
function minEatingSpeed(piles, h) {
    // 二分搜索吃香蕉的速度
    let left = 1;
    let right = Math.max(...piles);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canFinish(piles, mid, h)) {
            right = mid;  // 可以完成，尝试更小的速度
        } else {
            left = mid + 1;  // 不能完成，需要更大的速度
        }
    }
    
    return left;
}

function canFinish(piles, speed, h) {
    let hours = 0;
    for (let pile of piles) {
        hours += Math.ceil(pile / speed);
    }
    return hours <= h;
}
```

**分割数组的最大值**：
```javascript
function splitArray(nums, m) {
    let left = Math.max(...nums);  // 最小可能的最大值
    let right = nums.reduce((sum, num) => sum + num, 0);  // 最大可能的最大值
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canSplit(nums, m, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}

function canSplit(nums, m, maxSum) {
    let groups = 1;
    let currentSum = 0;
    
    for (let num of nums) {
        if (currentSum + num > maxSum) {
            groups++;
            currentSum = num;
        } else {
            currentSum += num;
        }
    }
    
    return groups <= m;
}
```

**经典题目**：
- **[875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/)**
- **[410. 分割数组的最大值](https://leetcode.cn/problems/split-array-largest-sum/)**
- **[1011. 在 D 天内送达包裹的能力](https://leetcode.cn/problems/capacity-to-ship-packages-within-d-days/)**

### 3. 二维矩阵中的二分

**搜索二维矩阵**：
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

**搜索二维矩阵II**（每行每列都递增）：
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

### 4. 浮点数二分

**x的平方根**：
```javascript
function mySqrt(x) {
    if (x === 0) return 0;
    
    let left = 1, right = x;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const square = mid * mid;
        
        if (square === x) {
            return mid;
        } else if (square < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return right;  // 返回最大的满足条件的整数
}

// 精确版本（浮点数）
function sqrtPrecise(x) {
    if (x === 0) return 0;
    
    let left = 0, right = x;
    const epsilon = 1e-6;  // 精度
    
    while (right - left > epsilon) {
        const mid = (left + right) / 2;
        
        if (mid * mid < x) {
            left = mid;
        } else {
            right = mid;
        }
    }
    
    return left;
}
```

## 💡 实战技巧

### 1. 二分条件的抽象

```javascript
// 将复杂条件抽象为check函数
function binarySearchAbstract(left, right, target) {
    function check(mid) {
        // 根据具体问题实现检查逻辑
        // 返回true表示答案在[left, mid]
        // 返回false表示答案在[mid+1, right]
        return someCondition(mid, target);
    }
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (check(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}
```

### 2. 避免整数溢出

```javascript
// 防止溢出的中点计算
function safeMid(left, right) {
    return left + Math.floor((right - left) / 2);
}

// 或者使用位运算
function fastMid(left, right) {
    return (left + right) >> 1;
}
```

### 3. 边界处理技巧

```javascript
// 统一的边界处理
function binarySearchUnified(nums, target) {
    let left = 0, right = nums.length;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    // 检查结果的有效性
    if (left < nums.length && nums[left] === target) {
        return left;
    }
    
    return -1;
}
```

## 🎯 二分思想的扩展

### 1. 三分查找

**寻找单峰函数的最大值**：
```javascript
function ternarySearch(left, right, func) {
    const epsilon = 1e-6;
    
    while (right - left > epsilon) {
        const mid1 = left + (right - left) / 3;
        const mid2 = right - (right - left) / 3;
        
        if (func(mid1) < func(mid2)) {
            left = mid1;
        } else {
            right = mid2;
        }
    }
    
    return (left + right) / 2;
}
```

### 2. 指数搜索

**在无界数组中搜索**：
```javascript
function exponentialSearch(nums, target) {
    // 找到搜索范围
    let bound = 1;
    while (bound < nums.length && nums[bound] < target) {
        bound *= 2;
    }
    
    // 在范围内进行二分搜索
    return binarySearch(nums, target, bound / 2, Math.min(bound, nums.length - 1));
}
```

## 🎯 练习题目

### 基础练习
- **[704. 二分查找](https://leetcode.cn/problems/binary-search/)**
- **[35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)**
- **[69. x 的平方根](https://leetcode.cn/problems/sqrtx/)**

### 进阶练习
- **[33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)**
- **[74. 搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/)**
- **[875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/)**

### 困难练习
- **[4. 寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/)**
- **[410. 分割数组的最大值](https://leetcode.cn/problems/split-array-largest-sum/)**
- **[1231. 分享巧克力](https://leetcode.cn/problems/divide-chocolate/)**

## 🔄 总结

二分查找的核心要点：

1. **有序性**：搜索空间必须有某种有序性或单调性
2. **边界处理**：正确处理left、right的更新
3. **循环不变量**：保持搜索空间的性质不变
4. **抽象思维**：将问题抽象为在某个范围内搜索答案

**适用场景**：
- **有序数组查找** → 标准二分
- **答案具有单调性** → 答案的二分搜索  
- **最值问题** → 二分答案
- **范围查询** → 左右边界查找

**模板选择**：
- 查找确切值 → `left <= right`
- 查找边界 → `left < right`
- 答案的二分 → `left < right` + check函数

掌握二分思想，搜索问题就能高效解决！
