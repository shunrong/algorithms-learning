import { MinHeap } from "./min-heap.js";

class MaxHeap extends MinHeap {
  constructor() {
    super();
  }

  compareFn(a, b) {
    if (a === b) {
      return Compare.equ;
    }
    return a > b ? Compare.less : Compare.bigger;
  }
}
