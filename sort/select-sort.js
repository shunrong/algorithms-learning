/**
 * 选择排序
 * 假设第一个是最小的，用后面的元素与最小的依次比较，如果更小则交换位置
 * 每次遍历选出最小值，与第一个元素交换位置，这样保证前面的元素依序排列
 */
export function selectSort(arr) {
  const { length } = arr;
  if (length > 1) {
    for (let i = 0; i < length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        };
      }
      swap(arr, i, minIndex);
    }
  }
  return arr;
}

function swap(arr, a, b) {
  if (a === b) return;
  [arr[a], arr[b]] = [arr[b], arr[a]];
}