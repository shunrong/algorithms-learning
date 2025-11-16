function intersect(nums1: number[], nums2: number[]): number[] {
  // 先将数组转换成哈希表
  const trans2Map = (nums: number[]) => {
      const map = new Map<number, number>()
    for (const num of nums) {
      map.set(num, (map.get(num) || 0) + 1)
      }
      return map
  }
  const map1 = trans2Map(nums1)
  const map2 = trans2Map(nums2)

  const result: number[] = []
  for (const [num, count] of map1.entries()) {
    if (map2.has(num)) {
      const count2 = map2.get(num)
      const minCount = Math.min(count, count2 || 0)
      const arr = new Array(minCount).fill(num)
      result.push(...arr)
    }
  }
  return result
}

console.log(intersect([1, 2, 2, 1], [2, 2]))
console.log(intersect([4, 9, 5], [9, 4, 9, 8, 4]))