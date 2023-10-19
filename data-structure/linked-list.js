export class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.count = 0;
  }

  push(element) {
    const node = new Node(element);
    let current;
    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;

      while (current.next !== null) {
        current = current.next;
      }

      current.next = node;
    }
    this.count++;
  }

  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next;
      } else {
        let previous;
        for (let i = 0; i < index; i++) {
          previous = current;
          current = current.next;
        }

        previous.next = current.next;
      }

      this.count--;
      return current.element;
    }

    return;
  }

  getNodeAt(index) {
    if (index >= 0 && index < this.count) {
      let node = this.head;

      for (let i = 0; i < index; i++) {
        node = node.next;
      }
      return node;
    }
    return;
  }

  removeAt2(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next;
      } else {
        const previous = this.getNodeAt(index - 1);

        current = previous.next;

        previous.next = current.next;
      }

      this.count--;
      return current.element;
    }

    return;
  }

  equalFn(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  indexOf(element) {
    let current = this.head;

    for (let i = 0; i < this.count; i++) {
      if (this.equalFn(element, current.element)) {
        return i;
      }
      current = current.next;
    }

    return -1;
  }

  remove(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);

      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const previous = this.getNodeAt(index - 1);
        const current = previous.next;

        node.next = current;

        previous.next = node;
      }

      this.count++;
      return true;
    }
    return false;
  }

  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return this.count;
  }

  getHead() {
    return this.head;
  }
}
