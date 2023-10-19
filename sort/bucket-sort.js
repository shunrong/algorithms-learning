/**
 * 桶排序
 * 1. 分桶策略：分几个桶，每个桶放几个元素；遍历数组元素，确定将元素分到哪个桶中
 * 2. 
 * @param {*} arr 
 */

export function bucketSort(arr) {
  if (arr.length < 2) return arr;
  const buckets = createBuckets(arr);
  return sortedBuckets(buckets);
}

function createBuckets(arr, bucketSize = 5) {
  const buckets = [];
  const { max, min } = findMaxMin(arr);
  // 计算桶的个数，思考下这里为什么要加 1 ？
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;

  for (let i = 0; i < bucketCount; i++) {
    buckets[i] = [];
  }

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    // 当前元素分到第几个桶，取值范围是[0, bucketCount - 1]
    // min 一定在第 0 桶，max 一定在第 bucketCount - 1 桶
    // 中间值的元素则根据与最小值的差值与每个桶个数的倍数来决定
    const bucketsIndex = Math.floor((element - min) / bucketSize);
    buckets[bucketsIndex].push(element);
  }
  return buckets;
}

function sortedBuckets(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    const sortedBucket = insertSort(arr[i]);
    result = result.concat(sortedBucket);
  }
  return result;
}

function findMaxMin(arr) {
  // const max = Math.max(...arr);
  // const min = Math.min(...arr);
  let max = arr[0];
  let min = arr[0];
  for (let i = 1; i < arr.length; i++){
    const element = arr[i];
    if (element > max) {
      max = element;
    }
    if (element < min) {
      min = element;
    }
  }
  return { max, min }
}

function insertSort(arr) {
  if (arr.length < 2) return arr;
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let j = i;
    while (j > 0 && arr[j - 1] > temp) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
  return arr;
}