# 单调栈技巧

> 单调栈是解决"下一个更大元素"类问题的神器，时间复杂度通常能优化到O(n)

## 🎯 核心思想

单调栈维护一个**单调递增或递减的栈**，当新元素破坏单调性时，弹出栈顶元素并处理。核心是利用栈的性质，**在O(1)时间内找到元素之间的大小关系**。

## 📋 基础模式

### 1. 下一个更大元素

**问题描述**：对数组中每个元素，找到它右边第一个比它大的元素

**单调递减栈解法**：
```javascript
function nextGreaterElements(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];  // 存储下标
    
    for (let i = 0; i < n; i++) {
        // 当前元素比栈顶元素大，找到了栈顶元素的下一个更大元素
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = nums[i];
        }
        
        stack.push(i);
    }
    
    return result;
}
```

**循环数组版本**：
```javascript
function nextGreaterElementsCircular(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];
    
    // 遍历两遍，模拟循环数组
    for (let i = 0; i < 2 * n; i++) {
        const currentIndex = i % n;
        
        while (stack.length > 0 && nums[currentIndex] > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = nums[currentIndex];
        }
        
        // 第二遍遍历时不再入栈
        if (i < n) {
            stack.push(currentIndex);
        }
    }
    
    return result;
}
```

### 2. 每日温度

**问题描述**：给定每日温度，返回要等多少天温度才会升高

```javascript
function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack = [];  // 单调递减栈，存储下标
    
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            result[prevIndex] = i - prevIndex;  // 计算天数差
        }
        
        stack.push(i);
    }
    
    return result;
}
```

### 3. 柱状图中最大矩形

**问题描述**：给定柱状图的高度，求能构成的最大矩形面积

```javascript
function largestRectangleArea(heights) {
    const stack = [];  // 单调递增栈，存储下标
    let maxArea = 0;
    
    for (let i = 0; i <= heights.length; i++) {
        const currentHeight = i === heights.length ? 0 : heights[i];
        
        while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        
        stack.push(i);
    }
    
    return maxArea;
}
```

**关键理解**：
- 当遇到更小的高度时，之前的高度就不能再延续了
- 对于每个高度，计算以它为最小高度的最大矩形面积
- 宽度 = 右边界 - 左边界 - 1

### 4. 接雨水

**问题描述**：给定高度数组，计算能接多少雨水

```javascript
function trap(height) {
    const stack = [];  // 存储下标
    let water = 0;
    
    for (let i = 0; i < height.length; i++) {
        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
            const bottom = stack.pop();  // 凹槽底部
            
            if (stack.length === 0) break;
            
            const left = stack[stack.length - 1];  // 左边界
            const right = i;  // 右边界
            
            const h = Math.min(height[left], height[right]) - height[bottom];
            const w = right - left - 1;
            water += h * w;
        }
        
        stack.push(i);
    }
    
    return water;
}
```

## 🧠 解题模式

### 通用模板

```javascript
function monotonicStack(nums) {
    const stack = [];
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // 维护单调性：递增栈用 <，递减栈用 >
        while (stack.length > 0 && condition(nums[i], nums[stack[stack.length - 1]])) {
            const index = stack.pop();
            // 处理弹出的元素
            processElement(index, i, stack);
        }
        
        stack.push(i);
    }
    
    // 处理栈中剩余元素
    while (stack.length > 0) {
        const index = stack.pop();
        // 处理剩余元素
    }
    
    return result;
}
```

### 选择单调性的原则

1. **单调递增栈**：
   - 用于找"下一个更小元素"
   - 栈顶到栈底：递增
   - 新元素 < 栈顶时触发处理

2. **单调递减栈**：
   - 用于找"下一个更大元素"
   - 栈顶到栈底：递减
   - 新元素 > 栈顶时触发处理

## 💡 实战技巧

### 1. 哨兵技巧
```javascript
function largestRectangleArea(heights) {
    // 在数组两端添加哨兵，简化边界处理
    const newHeights = [0, ...heights, 0];
    const stack = [];
    let maxArea = 0;
    
    for (let i = 0; i < newHeights.length; i++) {
        while (stack.length > 0 && newHeights[i] < newHeights[stack[stack.length - 1]]) {
            const height = newHeights[stack.pop()];
            const width = i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    
    return maxArea;
}
```

### 2. 存储额外信息
```javascript
function maxSlidingWindow(nums, k) {
    const deque = [];  // 双端队列模拟单调栈
    const result = [];
    
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

### 3. 处理相等元素
```javascript
function nextGreaterElementsWithEqual(nums) {
    const result = new Array(nums.length).fill(-1);
    const stack = [];
    
    for (let i = 0; i < nums.length; i++) {
        // 注意：这里使用 >= 还是 > 会影响相等元素的处理
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = nums[i];
        }
        stack.push(i);
    }
    
    return result;
}
```

## 🎯 变式应用

### 1. 矩形系列问题
```javascript
// 最大矩形（二维版本）
function maximalRectangle(matrix) {
    if (!matrix || matrix.length === 0) return 0;
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    const heights = new Array(cols).fill(0);
    let maxArea = 0;
    
    for (let i = 0; i < rows; i++) {
        // 更新每列的高度
        for (let j = 0; j < cols; j++) {
            heights[j] = matrix[i][j] === '1' ? heights[j] + 1 : 0;
        }
        
        // 计算当前行的最大矩形面积
        maxArea = Math.max(maxArea, largestRectangleArea(heights));
    }
    
    return maxArea;
}
```

### 2. 子数组系列问题
```javascript
// 子数组最小值之和
function sumSubarrayMins(arr) {
    const MOD = 1e9 + 7;
    const n = arr.length;
    const stack = [];
    let result = 0;
    
    for (let i = 0; i <= n; i++) {
        const current = i === n ? 0 : arr[i];
        
        while (stack.length > 0 && current < arr[stack[stack.length - 1]]) {
            const mid = stack.pop();
            const left = stack.length === 0 ? -1 : stack[stack.length - 1];
            const right = i;
            
            // arr[mid] 作为最小值的子数组个数
            const count = (mid - left) * (right - mid);
            result = (result + arr[mid] * count) % MOD;
        }
        
        stack.push(i);
    }
    
    return result;
}
```

## 🎯 练习题目

### 基础练习
- [496. 下一个更大元素 I](https://leetcode.cn/problems/next-greater-element-i/)
- [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)
- [503. 下一个更大元素 II](https://leetcode.cn/problems/next-greater-element-ii/)

### 进阶练习
- [84. 柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/)
- [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)
- [85. 最大矩形](https://leetcode.cn/problems/maximal-rectangle/)

### 困难练习
- [907. 子数组的最小值之和](https://leetcode.cn/problems/sum-of-subarray-minimums/)
- [901. 股票价格跨度](https://leetcode.cn/problems/online-stock-span/)
- [1944. 队列中可以看到的人数](https://leetcode.cn/problems/number-of-visible-people-in-a-queue/)

## 🔄 总结

单调栈的核心要点：

1. **识别问题**：寻找"下一个更大/更小"元素的问题
2. **选择单调性**：递增栈找更小，递减栈找更大
3. **处理时机**：单调性被破坏时处理弹出的元素
4. **边界处理**：使用哨兵或特殊处理最后的元素

**解题思路**：
1. 确定需要维护什么样的单调性
2. 决定栈中存储元素值还是下标
3. 在合适的时机处理弹出的元素
4. 注意处理剩余在栈中的元素

掌握单调栈，很多看似复杂的问题都能在O(n)时间内解决！
