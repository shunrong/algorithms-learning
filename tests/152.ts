/**
 * 152. 乘积最大子数组
 * 动态规划方案
 * 
 * 核心思想：
 * - 需要同时记录最大值和最小值
 * - 因为负数会翻转大小关系
 * - minDP[i-1] * 负数 可能是最大值
 */

function maxProduct(nums: number[]): number {
    // 初始化
    let maxVal = nums[0];
    let minVal = nums[0];
    let result = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // 保存前一个状态（很关键！）
        const prevMax = maxVal;
        const prevMin = minVal;
        
        // 当前位置的最大乘积：
        // 1. nums[i] 本身开启新子数组
        // 2. nums[i] × prevMax（继续之前的最大值）
        // 3. nums[i] × prevMin（最小值×负数可能变最大）
        maxVal = Math.max(nums[i], nums[i] * prevMax, nums[i] * prevMin);
        
        // 当前位置的最小乘积（可能是负数）
        minVal = Math.min(nums[i], nums[i] * prevMax, nums[i] * prevMin);
        
        // 更新全局最大值
        result = Math.max(result, maxVal);
    }
    
    return result;
}

// ===== 测试用例 =====
console.log('===== LeetCode 152: 乘积最大子数组 =====\n');

// 测试用例1
let nums1 = [2, 3, -2, 4];
let expected1 = 6;
let actual1 = maxProduct(nums1);
console.log('测试用例1:');
console.log('输入:', nums1);
console.log('期望输出:', expected1);
console.log('实际输出:', actual1);
console.log('✓ 通过:', actual1 === expected1 ? '是' : '否');
console.log('说明: [2,3] 的乘积为 6\n');

// 测试用例2
let nums2 = [0, 2];
let expected2 = 2;
let actual2 = maxProduct(nums2);
console.log('测试用例2:');
console.log('输入:', nums2);
console.log('期望输出:', expected2);
console.log('实际输出:', actual2);
console.log('✓ 通过:', actual2 === expected2 ? '是' : '否');
console.log('说明: 单个元素 2\n');

// 测试用例3
let nums3 = [-2];
let expected3 = -2;
let actual3 = maxProduct(nums3);
console.log('测试用例3:');
console.log('输入:', nums3);
console.log('期望输出:', expected3);
console.log('实际输出:', actual3);
console.log('✓ 通过:', actual3 === expected3 ? '是' : '否');
console.log('说明: 单个负数\n');

// 测试用例4
let nums4 = [-2, 3, -4];
let expected4 = 24;
let actual4 = maxProduct(nums4);
console.log('测试用例4:');
console.log('输入:', nums4);
console.log('期望输出:', expected4);
console.log('实际输出:', actual4);
console.log('✓ 通过:', actual4 === expected4 ? '是' : '否');
console.log('说明: [-2, 3, -4] 的乘积为 24\n');

// 测试用例5
let nums5 = [0, -2, -1, -1];
let expected5 = 2;
let actual5 = maxProduct(nums5);
console.log('测试用例5:');
console.log('输入:', nums5);
console.log('期望输出:', expected5);
console.log('实际输出:', actual5);
console.log('✓ 通过:', actual5 === expected5 ? '是' : '否');
console.log('说明: [-2, -1, -1] 的乘积为 2\n');

export {};

