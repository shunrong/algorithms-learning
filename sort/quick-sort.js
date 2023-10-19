/**
 * 快速排序
 * 递归思想的应用
 * 将第一个元素作为主元（中间元素），遍历比较后续元素，小的放左边，大的放右边
 * @param {*} arr 
 * @returns 
 */
export function quickSort(arr) {
  const { length } = arr;
  if (length < 2) return arr;
  // 将第一个元素作为主元（中间元素），遍历比较后续元素，小的放左边，大的放右边
  const mid = arr[0];
  const left = [];
  const right = [];
  for (let i = 1; i < length; i++){
    if (arr[i] < mid) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), mid, ...quickSort(right)];
}