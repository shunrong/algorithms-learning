function binaryTreePaths(root) {
  // function recur(node: TreeNode, route: string, resArr: string[]): void {
  //     route += String(node.val);
  //     if (node.left === null && node.right === null) {
  //         resArr.push(route);
  //         return;
  //     }
  //     if (node.left !== null) recur(node.left, route + '->', resArr);
  //     if (node.right !== null) recur(node.right, route + '->', resArr);
  // }
  // const resArr: string[] = [];
  // if (root === null) return resArr;
  // recur(root, '', resArr);
  // return resArr;

  function traverse(node, path = [], result = []){
      path.push(node.val);
      // 遍历到了叶子节点
      if(node.left == null && node.right == null){
          result.push(path);
          return;
      }

      if(node.left !== null) {
          traverse(node.left, path, result);
      }

      if(node.right !== null) {
          traverse(node.right, path, result);
      }
  }

  const result = [];
  if (root == null) return result;
  traverse(root, [], result);
  return result.map(path => path.join('->'));
};

function halveArray(nums) {
  // 数组和减少一半
  const halfSum = nums.reduce((prev, curr) => prev + curr, 0) / 2;

  // 若要使得操作数最少，那么应该尽可能先把较大的数减半
  let count = 0;
  let result = 0;
  const sortedNums = nums.sort((a, b) => a - b);
  while(result < halfSum) {
      result += sortedNums.pop()/2;
      ++count;
  }
  return count;
};

function nextGreaterElement(nums1, nums2){
  const result = [];
  // 遍历 nums1 中的元素，拿这个元素在 nums2 中去遍历找相同的元素
  for(let i = 0; i < nums1.length; i++) {
      const targetNum = nums1[i];
      let hasFound = false;
      for(let j = 0; j < nums2.length; j++) {
          const currNum = nums2[j];
          if(currNum === targetNum) {
              hasFound = true;
          }
          if(hasFound && currNum > targetNum) {
              result.push(currNum);
              hasFound = false;
          }
      }
      result.push(-1);
  }
  return result;
};

function integerBreak(n) {
    // 动态规划
    const dp = [];
    dp[2] = 1;
    dp[3] = 2;
    for (let i = 4; i <= n; i++){
        dp[i] = 0;
        for (let j = 1; j <= Math.floor(i/2); j++){
            console.log(`dp[${i}]`, dp[i]);
            dp[i] = Math.max(dp[i], Math.max((i-j) * j, dp[i-j] * j));
        }
        console.log('dp', dp);
    }
    return dp[n];
};