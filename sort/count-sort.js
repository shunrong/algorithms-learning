
/**
 * 计数排序
 * 将元素作为数组的索引，新数组按索引顺序遍历即可输出元素
 * 这里需要处理重复元素的输出
 * @param {*} arr 
 * @returns 
 */
export function countSort(arr) {
  const { length } = arr;
  if (length < 2) return arr;
  // 这里应该也计算最小值，数组长度是最大值与最小值的差值
  const maxValue = findMax(arr);
  const counts = new Array(maxValue + 1);
  const result = [];
  for (let i = 0; i < length; i++) {
    const element = arr[i];
    if (!counts[element]) {
      counts[element] = 1;
    } else {
      counts[element]++;
    }
  }

  counts.forEach((item, index) => {
    while (item) {
      result.push(index);
      item--;
    }
  });
  return result;
}

function findMax(arr) {
  // return Math.max(...arr);
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element > max) {
      max = element;
    }
  }
  return max;
}