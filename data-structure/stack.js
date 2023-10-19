class Stack {
  #items = [];

  push(data) {
    this.#items.push(data);
  }

  pop() {
    return this.#items.pop();
  }

  peek() {
    // return this.items[this.items.length - 1];
    return this.#items.at(-1);
  }
  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }

  clear() {
    this.#items = [];
  }

  toString() {
    return this.#items.join("");
  }
}
