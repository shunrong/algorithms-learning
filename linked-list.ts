
class Node {
  key: any;
  next: null;
  prev: null;
  constructor(key) {
    this.key = key;
    this.next = null;
    this.prev = null;
  }
}

export default class LinkedList {
  head: any;
  tail: any;
  constructor() {
    this.head = null;
    this.tail = null;
  }

  insert(key) {
    const node = new Node(key);
    if (this.head == null) {
      this.head = node;
      return true;
    } else {
      
    }
  }
}