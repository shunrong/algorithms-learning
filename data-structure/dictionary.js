class ValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class Dictionary {
  constructor() {
    this.table = {};
  }
  toStrFn(item) {
    if (item === null) {
      return "NULL";
    } else if (item === undefined) {
      return "UNDEFINED";
    } else if (typeof item === "string" || item instanceof String) {
      return `${item}`;
    }
    return JSON.stringify(item);
  }
  hasKey(key) {
    return this.table[this.toStrFn(key)] != null;
  }
  set(key, value) {
    if (key != null && value != null) {
      const tableKey = this.toStrFn(key);
      this.table[tableKey] = new ValuePair(key, value);
      return true;
    }
    return false;
  }

  remove(key) {
    if (this.hasKey(key)) {
      delete this.table[this.toStrFn(key)];
      return true;
    }
    return false;
  }

  get(key) {
    const valuePair = this.table[this.toStrFn(key)];
    return valuePair == null ? undefined : valuePair.value;
  }
  //它会以数组形式返回字典中的所有 valuePair 对象。
  keyValues() {
    return Object.values(this.table);
  }

  keys() {
    return this.keyValues().map((valuePair) => valuePair.key);
  }

  values() {
    return this.keyValues().map((valuePair) => valuePair.value);
  }

  size() {
    return Object.keys(this.table).length;
  }
  isEmpty() {
    return this.size() === 0;
  }

  clear() {
    this.table = {};
  }

  forEach(callbackFn) {
    const valuePairs = this.keyValues();
    for (let i = 0; i < valuePairs.length; i++) {
      callbackFn(valuePairs[i].key, valuePairs[i].value);
    }
  }
}

let myMap = new Dictionary();
