/**
 * 希尔排序
 * 是插入排序的改进版本
 */
export function shellSort(arr) {
  const { length } = arr;
  if (length > 1) {
    for (let gap = Math.floor(length/2); gap > 0; gap = Math.floor(gap/2)) {
      for (let i = gap; i < length; i++) {
        let temp = arr[i];
        let j = i;
        while ((j - gap) >= 0 && arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = temp;
      }
    }
  }
  return arr;
}