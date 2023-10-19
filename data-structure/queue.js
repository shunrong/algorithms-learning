class Queue {
  #items = {};
  #count = 0;
  #lowCount = 0;

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    let res = this.#items[this.#lowCount];
    delete this.#items[this.#lowCount];
    this.#lowCount++;
    return res;
  }

  enqueue(data) {
    this.#items[this.#count] = data;
    this.#count++;
  }

  front() {
    return this.#items[this.#lowCount];
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.#count - this.#lowCount;
  }

  clear() {
    this.#items = {};
    this.#count = 0;
    this.#lowCount = 0;
  }

  toString() {
    let str = "";
    for (let i = this.#lowCount; i < this.#count; i++) {
      str += `${this.#items[i]} `;
    }
    return str;
  }
}
