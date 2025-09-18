import { bubbleSort } from './bubble-sort.js';
import { selectSort } from './select-sort.js';
import { insertSort } from './insert-sort.js';
import { shellSort } from './shell-sort.js';
import { quickSort } from './quick-sort.js';
import { mergeSort } from './merge-sort.js';
import { countSort } from './count-sort.js';
import { bucketSort } from './bucket-sort.js';
import { radixSort } from './radix-sort.js';
import { heapSort } from './heap-sort.js';


let arr = [5, 12, 7, 3, 1, 9, 11, 2, 8, 3, 4];
// console.log('bubbleSort', bubbleSort(arr));
// console.log('selectSort', selectSort(arr));
// console.log('insertSort', insertSort(arr));
// console.log('shellSort', shellSort(arr));
// console.log('quickSort', quickSort(arr));
// console.log('mergeSort', mergeSort(arr));
// console.log('countSort', countSort(arr));
// console.log('bucketSort', bucketSort(arr));
// console.log('radixSort', radixSort(arr));
console.log('heapSort', heapSort(arr));