/**
 * LeetCode 56: 合并区间 (Merge Intervals)
 * 
 * 思路：
 * 1. 按起始位置排序
 * 2. 遍历每个区间，检查是否与前一个合并的区间重叠
 * 3. 如果重叠，合并（取最大的末尾）
 * 4. 如果不重叠，将当前区间作为新的独立区间
 * 
 * 时间复杂度：O(n log n)  (排序)
 * 空间复杂度：O(n) 或 O(1) (不计输出空间)
 */

function merge(intervals: number[][]): number[][] {
  // 空输入处理
  if (!intervals || intervals.length === 0) return [];
  
  // 第1步：按起始位置排序
  intervals.sort((a, b) => a[0] - b[0]);
  
  // 第2步：遍历并合并
  const result: number[][] = [intervals[0]];  // 将第一个区间加入结果
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];  // 最后一个合并的区间
    
    // 检查是否重叠：前一个末尾 >= 当前起始
    if (last[1] >= current[0]) {
      // 合并：更新末尾为两者中的最大值
      last[1] = Math.max(last[1], current[1]);
    } else {
      // 不重叠：将当前区间作为新的独立区间
      result.push(current);
    }
  }
  
  return result;
}

// ============ 测试用例 ============

function arraysEqual(arr1: number[][], arr2: number[][]): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i][0] !== arr2[i][0] || arr1[i][1] !== arr2[i][1]) {
      return false;
    }
  }
  return true;
}

function printTest(testNum: number, intervals: number[][], expected: number[][]) {
  const result = merge(intervals);
  const passed = arraysEqual(result, expected);
  
  const formatArr = (arr: number[][]): string => 
    '[' + arr.map(interval => `[${interval.join(',')}]`).join(',') + ']';
  
  console.log(
    `测试 ${testNum}: ${passed ? '✅ 通过' : '❌ 失败'}\n` +
    `  输入: ${formatArr(intervals)}\n` +
    `  期望: ${formatArr(expected)}\n` +
    `  实际: ${formatArr(result)}\n`
  );
}

console.log('===== 合并区间测试 =====\n');

// 测试用例1：基本情况 - 有重叠
printTest(1, [[1,3],[2,6],[8,10],[15,18]], [[1,6],[8,10],[15,18]]);

// 测试用例2：相邻区间
printTest(2, [[1,4],[4,5]], [[1,5]]);

// 测试用例3：包含关系
printTest(3, [[1,4],[2,3]], [[1,4]]);

// 测试用例4：无重叠
printTest(4, [[1,2],[3,4],[5,6]], [[1,2],[3,4],[5,6]]);

// 测试用例5：单个区间
printTest(5, [[1,2]], [[1,2]]);

// 测试用例6：完全重叠
printTest(6, [[1,5],[1,5]], [[1,5]]);

// 测试用例7：乱序输入
printTest(7, [[8,10],[1,3],[2,6],[15,18]], [[1,6],[8,10],[15,18]]);

// 测试用例8：多个区间连接
printTest(8, [[1,2],[2,3],[3,4],[4,5]], [[1,5]]);

// 测试用例9：部分重叠
printTest(9, [[1,3],[2,4],[3,5]], [[1,5]]);

// 测试用例10：间隙很小
printTest(10, [[1,10],[2,3],[4,5],[6,7]], [[1,10]]);

console.log('✅ 所有测试完成！');

