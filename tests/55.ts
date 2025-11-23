/**
 * LeetCode 55: 跳跃游戏 (Jump Game)
 * 
 * 思路：贪心算法
 * 核心思想：维护能到达的最远位置
 * - 从前向后遍历，每个位置都检查是否能到达
 * - 维护当前能到达的最远索引 maxReach
 * - 如果当前位置超过了最远距离，说明无法到达这个位置
 * - 如果最远距离 >= 数组长度-1，说明能到达终点
 */

function canJump(nums: number[]): boolean {
  // 贪心法：维护能到达的最远位置
  let maxReach = 0;  // 目前能到达的最远索引
  
  for (let i = 0; i < nums.length; i++) {
    // 如果当前位置超过了能到达的最远位置，说明无法到达这里
    if (i > maxReach) return false;
    
    // 更新能到达的最远位置
    maxReach = Math.max(maxReach, i + nums[i]);
    
    // 如果能到达最后一个位置，直接返回true
    if (maxReach >= nums.length - 1) return true;
  }
  
  return false;
}

/**
 * 方案2：反向贪心
 * 从后向前思考，找最后一个能到达终点的位置
 */
function canJump_v2(nums: number[]): boolean {
  let lastGoodIndex = nums.length - 1;  // 最后一个"好"位置
  
  // 从倒数第二个位置开始向前遍历
  for (let i = nums.length - 2; i >= 0; i--) {
    // 如果从位置i能跳到lastGoodIndex，则i成为新的"好"位置
    if (i + nums[i] >= lastGoodIndex) {
      lastGoodIndex = i;
    }
  }
  
  // 如果最后一个"好"位置是0，说明从起点能到达终点
  return lastGoodIndex === 0;
}

// ============ 测试用例 ============

function printTest(testNum: number, arr: number[], expected: boolean) {
  const result1 = canJump(arr);
  const result2 = canJump_v2(arr);
  
  const passed1 = result1 === expected;
  const passed2 = result2 === expected;
  
  console.log(
    `测试 ${testNum}: ${passed1 && passed2 ? '✅ 通过' : '❌ 失败'}\n` +
    `  输入: [${arr.join(',')}]\n` +
    `  期望: ${expected}\n` +
    `  贪心法: ${result1} ${passed1 ? '✅' : '❌'}\n` +
    `  反向贪心: ${result2} ${passed2 ? '✅' : '❌'}\n`
  );
}

console.log('===== 跳跃游戏测试 =====\n');

// 测试用例1：基本情况 - 能到达
printTest(1, [2, 3, 1, 1, 4], true);

// 测试用例2：基本情况 - 无法到达
printTest(2, [3, 2, 1, 0, 4], false);

// 测试用例3：单个元素
printTest(3, [0], true);

// 测试用例4：两个元素，可以到达
printTest(4, [2, 0, 0], true);

// 测试用例5：两个元素，无法到达
printTest(5, [0, 1], false);

// 测试用例6：所有0
printTest(6, [0, 0, 0], false);

// 测试用例7：最后一个是0
printTest(7, [1, 1, 1, 0], true);

// 测试用例8：需要跳多次
printTest(8, [1, 0, 1, 0], false);

// 测试用例9：大的跳跃
printTest(9, [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], true);

// 测试用例10：多个选择
printTest(10, [2, 3, 1, 1, 4, 1, 1, 1], true);

console.log('✅ 所有测试完成！');

