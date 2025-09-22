# 数组双指针技巧

> 用两个指针遍历数组，是最常用也是最基础的算法技巧之一

## 🎯 核心思想

双指针技巧通过使用两个指针在数组中移动，可以将 O(n²) 的暴力解法优化到 O(n)。关键在于**减少不必要的重复计算**。

## 📋 技巧分类

### 1. 对撞指针（Two Pointers）

**适用场景**：有序数组，寻找两个数的关系

**模板**：
```javascript
function twoSum(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;  // 需要更大的数
        } else {
            right--; // 需要更小的数
        }
    }
    return [-1, -1];
}
```

**经典题目**：
- **两数之和 II**：有序数组中找两数和等于target
- **三数之和**：找所有和为0的三元组
- **验证回文串**：判断字符串是否为回文

### 2. 快慢指针（Fast-Slow Pointers）

**适用场景**：数组去重、寻找特定位置

**模板**：
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

**经典题目**：
- **删除排序数组中的重复项**
- **移除元素**
- **移动零**：将所有0移动到数组末尾

### 3. 滑动窗口（Sliding Window）

**适用场景**：子数组/子串问题，连续元素的最优解

**固定窗口模板**：
```javascript
function maxSumSubarray(nums, k) {
    let windowSum = 0;
    
    // 初始化窗口
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    let maxSum = windowSum;
    
    // 滑动窗口
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```

**可变窗口模板**：
```javascript
function minSubarrayLength(target, nums) {
    let left = 0, right = 0;
    let sum = 0;
    let minLen = Infinity;
    
    while (right < nums.length) {
        // 扩大窗口
        sum += nums[right];
        
        // 收缩窗口
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
        
        right++;
    }
    
    return minLen === Infinity ? 0 : minLen;
}
```

**经典题目**：
- **长度最小的子数组**：和≥target的最短连续子数组
- **无重复字符的最长子串**
- **找到字符串中所有字母异位词**

## 🧠 解题思路

### 识别双指针问题
1. **有序数组** + 查找两个元素的关系 → 对撞指针
2. **原地修改** + 不同速度遍历 → 快慢指针  
3. **连续子数组/子串** + 满足某个条件 → 滑动窗口

### 常见变式
1. **三指针**：三数之和类问题
2. **多窗口**：多个滑动窗口同时维护
3. **反向双指针**：从两端向中间，处理回文等问题

## 💡 实战技巧

### 1. 边界处理
```javascript
// 避免越界
while (left < right) {  // 不是 left <= right
    // ...
}

// 处理空数组
if (!nums || nums.length === 0) return result;
```

### 2. 指针移动策略
```javascript
// 对撞指针：根据条件决定移动哪个指针
if (condition) {
    left++;
} else {
    right--;
}

// 滑动窗口：先扩大，再收缩
while (right < n) {
    // 扩大窗口
    windowState += nums[right];
    
    while (shouldShrink) {
        // 收缩窗口
        windowState -= nums[left];
        left++;
    }
    right++;
}
```

### 3. 状态维护
```javascript
// 滑动窗口中维护额外信息
const map = new Map();  // 字符计数
let validCount = 0;     // 满足条件的字符数

// 每次窗口变化时更新状态
map.set(char, (map.get(char) || 0) + 1);
if (map.get(char) === need) validCount++;
```

## 🎯 练习题目

### 基础练习
- [1. 两数之和](https://leetcode.cn/problems/two-sum/)
- [167. 两数之和 II](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)
- [26. 删除排序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

### 进阶练习  
- [15. 三数之和](https://leetcode.cn/problems/3sum/)
- [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)
- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

### 困难练习
- [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)
- [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)
- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

## 🔄 总结

双指针技巧的本质是**通过指针的有序移动，避免暴力枚举的重复计算**。

**记住三个关键点**：
1. **什么时候移动左指针**
2. **什么时候移动右指针**  
3. **如何维护窗口/区间的状态**

掌握了这三点，遇到双指针问题就能快速分析和解决！
