/**
 * 插入排序
 * 模拟打牌的时候整理手牌的过程
 * 当从牌堆里摸到一张新牌时，总是逐个从后往前与手里的牌比较
 * 如果有比手里牌更大的，则插入到它的前面
 * @param {*} arr 
 */
export function insertSort(arr) {
  const { length } = arr;
  if (length > 1) {
    for (let i = 1; i < length; i++) {
      let temp = arr[i];
      let j = i;
      while (j > 0 && arr[j - 1] > temp) {
        arr[j] = arr[j - 1];
        j--;
      }
      arr[j] = temp;
    }
  };
  return arr;
}