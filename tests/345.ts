function reverseVowels(s: string): string {
  // 左右指针从两头遍历，遇到元音交换位置
  const chars = s.split('')
  const vowels = new Set('aeiouAEIOU')
  let left = 0, right = s.length - 1
  while (left < right) {
      // 遍历找到左边的元音
      while (left < right && !vowels.has(chars[left])) {
          left++
      }
      // 遍历找到右边的元音
      while (left < right && !vowels.has(chars[right])) {
          right--
      }
      // 交换两个元音
      [chars[left], chars[right]] = [chars[right], chars[left]]
      left++
      right--
  }
  return chars.join('')
};

console.log(reverseVowels("IceCreAm"))