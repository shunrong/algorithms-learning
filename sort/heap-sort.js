/**
 * 堆排序
 * 利用最大堆/最小堆的特性：堆顶元素一定是最大值或者最小值
 * 每次取出堆顶元素后，继续构造最大堆
 */
export function heapSort(arr) {
  let { length } = arr;
  if (length < 2) return arr;
  buildMaxHeap(arr);
  while (length > 1) {
    swap(arr, 0, --length);
    heapify(arr, 0, length);
  }
  return arr;
}

function buildMaxHeap(arr) {
  const { length } = arr;
  for (let i = Math.floor(length / 2); i >= 0; i -= 1){
    heapify(arr, i, length);
  }
  return arr;
}

function heapify(arr, index, size) {
  let temp = index;
  let leftIndex = getLeftIndex(index);
  let rightIndex = getRightIndex(index);
  if (leftIndex < size && arr[leftIndex] > arr[temp]) {
    temp = leftIndex;
  }

  if (rightIndex < size && arr[rightIndex] > arr[temp]) {
    temp = rightIndex;
  }

  if (index !== temp) {
    swap(arr, index, temp);
    heapify(arr, temp, size);
  }
}

function getLeftIndex(index) {
  return 2 * index + 1;
}

function getRightIndex(index) {
  return 2 * index + 2;
}

function swap(arr, a, b) {
  const temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}