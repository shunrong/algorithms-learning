function maxSubArray(nums) {
    // dp[i][j] 记录数组位置i-j 的最大子数组的和， i <= j
    const len = nums.length
    const dp = new Array(len).fill(0).map(() => new Array(len).fill(0))

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (i === j) {
                dp[i][j] = nums[i]
            } else if (i < j) {
                if (i > 0 ) {
                    dp[i][j] = Math.max(
                        dp[i - 1][j - 1],
                        dp[i - 1][j] + nums[i],
                        dp[i][j - 1] + nums[j],
                        dp[i - 1][j - 1] + nums[i] + nums[j]
                    )
                } else {
                       dp[i][j] = Math.max(
                        dp[0][j - 1],
                        dp[0][j - 1] + nums[j],
                    )
                }

            }

        }
    }

    return dp[0][len - 1]
};

maxSubArray([-2,1,-3,4,-1,2,1,-5,4])