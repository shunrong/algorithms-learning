const Compare = {
  less: -1,
  bigger: 1,
  equ: 0,
};

export class MinHeap {
  heap = [];

  getLeftIndex(index) {
    return 2 * index + 1;
  }

  getRightIndex(index) {
    return 2 * index + 2;
  }

  getParentIndex(index) {
    if (index === 0) {
      return undefined;
    }
    return Math.floor((index - 1) / 2);
  }

  insert(value) {
    if (value != null) {
      this.heap.push(value); // {1}
      this.siftUp(this.heap.length - 1); // {2}
      return true;
    }
    return false;
  }

  compareFn(a, b) {
    if (a === b) {
      return Compare.equ;
    }
    return a < b ? Compare.less : Compare.bigger;
  }

  siftUp(index) {
    let parent = this.getParentIndex(index);
    while (
      index > 0 &&
      this.compareFn(this.heap[parent], this.heap[index]) === Compare.bigger
    ) {
      swap(this.heap, parent, index);
      index = parent;
      parent = this.getParentIndex(index);
    }
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
  findMinimum() {
    return this.heap[0];
  }

  extract() {
    if (this.isEmpty()) {
      return undefined;
    }
    if (this.size() === 1) {
      return this.heap.shift();
    }
    const removedValue = this.heap[0];
    this.heap[0] = this.heap.pop(); //不破坏结构
    this.siftDown(0);
    return removedValue;
  }

  siftDown(index) {
    let element = index;
    const left = this.getLeftIndex(index);
    const right = this.getRightIndex(index);
    const size = this.size();
    if (
      left < size &&
      this.compareFn(this.heap[element], this.heap[left]) === Compare.bigger
    ) {
      element = left;
      //如果大， element 改变了
    }
    if (
      //上面最新的element 与 右边进行对比
      right < size &&
      this.compareFn(this.heap[element], this.heap[right]) === Compare.bigger
    ) {
      element = right;
    }
    if (index !== element) {
      swap(this.heap, index, element);
      this.siftDown(element);
    }
  }
}

function swap(array, a, b) {
  const temp = array[a];
  array[a] = array[b];
  array[b] = temp;
}

var heap = new MinHeap();
