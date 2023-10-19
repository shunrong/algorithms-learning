import { Node, LinkedList } from './linked-list.js';

class CircularLinkedList extends LinkedList {
  constructor() {
    super();
  }

  push(element) {
    const node = new Node(element);
    let current;
    if (this.head == null) {
      this.head = node;
    } else {
      current = this.getNodeAt(this.size() - 1);
      current.next = node;
    }
    node.next = this.head;
    this.count++;
  }

  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);
      let current = this.head;
      if (index === 0) {
        if (this.head == null) {
          // if no node  in list
          this.head = node;
          node.next = this.head;
        } else {
          node.next = current;
          current = this.getNodeAt(this.size() - 1);
          // update last element
          this.head = node;
          current.next = this.head;
        }
      } else {
        const previous = this.getNodeAt(index - 1);
        node.next = previous.next;
        previous.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }

  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        if (this.size() === 1) {
          this.head = undefined;
        } else {
          let last = this.getNodeAt(this.size() - 1);
          this.head = this.head.next;
          last.next = this.head;
        }
      } else {
        const previous = this.getNodeAt(index - 1);
        current = previous.next;
        previous.next = current.next; // 如果删的是最后一个也不怕，current.next 是head
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
}
