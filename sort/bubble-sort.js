/**
 * 冒泡排序
 * 比较前后元素大小，如果前面的比后面的大，则交换位置
 * 每遍历一遍，最大的元素会去到最后面
 */
export function bubbleSort(arr) {
  const { length } = arr;
  if (length > 1) {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          swap(arr, j, j+1);
        }
      }
    }
  }
  return arr;
}

function swap(arr, a, b) {
  [arr[a], arr[b]] = [arr[b], arr[a]];
}