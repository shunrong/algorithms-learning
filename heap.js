

const Compare = {
  Bigger: 1,
  Less: -1,
  Equal: 0,
}

class MinHeap {
  constructor() {
    this.heap = [];
  }

  compare(a, b) {
    if (a - b > 0) {
      return Compare.Bigger;
    } else if (a - b < 0) {
      return Compare.Less;
    } else {
      return Compare.Equal
    }
  }

  getLeftIndex(index) {
    return 2 * index + 1;
  }

  getRightIndex(index) {
    return 2 * index + 2;
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  insert(value) {
    if (value == null) return false;
    this.heap.push(value);
    if (this.size() > 1) {
      this.shiftUp(this.size() - 1);
    }
    return true;
  }

  shiftUp(index) {
    let parentIndex = this.getParentIndex(index);
    while (index > 0
      && this.compare(this.heap[index], this.heap[parentIndex]) === Compare.Less) {
      this.swap(this.heap, index, parentIndex);
      index = parentIndex;
      parentIndex = this.getParentIndex(index);
    }
  }

  swap(arr, a, b) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

  extract() {
    if (this.isEmpty()) {
      return;
    }
    if (this.size() === 1) {
      return this.heap.pop();
    }
    const removedValue = this.findMin();
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
    return removedValue;
  }

  shiftDown(index) {
    let temp = index;
    let leftIndex = this.getLeftIndex(index);
    let rightIndex = this.getRightIndex(index);
    if (leftIndex < this.size()
      && this.compare(this.heap[leftIndex], this.heap[temp]) === Compare.Less) {
      temp = leftIndex;
    }

    if (rightIndex < this.size()
      && this.compare(this.heap[rightIndex], this.heap[temp]) === Compare.Less) {
      temp === rightIndex;
    }

    if (index !== temp) {
      this.swap(this.heap, index, temp);
      this.shiftDown(temp);
    }
  }

  findMin() {
    return this.heap[0]
  }
}

const minHeap = new MinHeap();