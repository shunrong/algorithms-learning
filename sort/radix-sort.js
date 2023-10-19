/**
 * 基数排序
 * @param {*} arr 
 */
export function radixSort(arr) {
  const { length } = arr;
  if (length < 2) return arr;
  const base = 10;
  let divider = 1;
  const max = Math.max(...arr);
  while (divider < max) {
    const buckets = [];
    for (let i = 0; i < base; i++){
      buckets[i] = [];
    }
    for (let i = 0; i < length; i++){
      const element = arr[i];
      const radixIndex = Math.floor(element / divider) % base;
      buckets[radixIndex].push(element);
    }
    divider *= base;
    arr = [].concat(...buckets);
  }
  return arr;
}