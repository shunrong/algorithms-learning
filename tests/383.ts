function canConstruct(ransomNote: string, magazine: string): boolean {
  // 也就是 ransomNote 中的每个字符都可以在 magazine 中找到，对于重复的字符，也需要有足够数量
  const trans2Map = (s: string) => {
      const map = new Map<string, number>()
      for(const char of s) {
          map.set(char, (map.get(char) || 0) + 1)
      }
      return  map
  }

  const targetMap = trans2Map(ransomNote)
  const sourceMap = trans2Map(magazine)

  for (const [char, count] of targetMap.entries()) {
    if (sourceMap.has(char)) {
      const count2 = sourceMap.get(char) ?? 0
      if (count2 < count) {
        return false
      } 
    } else {
      return false
    }
  }
  return true
}

console.log(canConstruct("a", "b"))
console.log(canConstruct("aa", "ab"))
console.log(canConstruct("aa", "aab"))