class DeQueue {
  #items = {};
  #lowCount = 0;
  #count = 0;
  removeFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    let res = this.#items[this.#lowCount];
    delete this.#items[this.#lowCount];
    this.#lowCount++;
    return res;
  }

  addBack(data) {
    this.#items[this.#count] = data;
    this.#count++;
  }

  addFront(data) {
    if (this.isEmpty()) {
      this.addBack(data);
    } else if (this.#lowCount > 0) {
      this.#lowCount--;
      this.#items[this.#lowCount] = data;
    } else {
      for (let i = this.#count; i > 0; i--) {
        this.#items[i] = this.#items[i - 1];
      }
      this.#count++;
      this.#lowCount = 0;
      this.#items[0] = data;
    }
  }

  removeBack() {
    if (this.isEmpty()) {
      return undefined;
    }

    this.#count--;
    const result = this.#items[this.#count];
    delete this.#items[this.#count];

    return result;
  }

  peekFront() {
    return this.#items[this.#lowCount];
  }
  peekBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.#items[this.#count - 1];
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
