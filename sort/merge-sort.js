
/**
 * 归并排序
 */
export function mergeSort(arr) {
  const { length } = arr;
  if (length > 1) {
    // 从中间来分割数组，尽可能均匀，注意 slice 方法的参数索引（左闭右开区间）
    const midIndex = Math.floor((length - 1) / 2);
    const left = mergeSort(arr.slice(0, midIndex + 1));
    const right = mergeSort(arr.slice(midIndex + 1));
    arr = merge2(left, right)
  }
  return arr;
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  // 任何一个小数组遍历完，会跳出 while 循环，此时把剩下的未遍历的有序小数组部分拼接起来就是2个小数组归并之后的结果
  if (i < left.length) {
    result = result.concat(left.slice(i));
  } else {
    result = result.concat(right.slice(j));
  }
  return result;
}

// merge 的另一种实现
function merge2(left, right) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  if (left.length) {
    result = result.concat(left)
  } else {
    result = result.concat(right)
  }
  return result;
}