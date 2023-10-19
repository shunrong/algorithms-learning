
class BinaryTreeNode {
  key: any;
  left: null;
  right: null;
  constructor(key: any) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

enum Compare {
  LESS_THAN = -1,
  MORE_THAN = 1,
  EQUAL = 0,
}

export default class BinarySearchTree {
  root: any;
  constructor(compareFn) {
    this.root = null;
    this.compareFn = compareFn;
  }

  private compareFn(a, b) {
    if (a < b) {
      return Compare.LESS_THAN;
    } else if (a > b) {
      return Compare.MORE_THAN;
    } else {
      return Compare.EQUAL;
    }
  }

  // 插入
  insert(key) {
    if (this.root == null) {
      this.root = new BinaryTreeNode(key);
    } else {
      this.insertNode(this.root, key)
    }
  }

  private insertNode(node, key) {
    if (this.compareFn(node.key, key) === Compare.MORE_THAN) {
      if (node.left == null) {
        node.left = new BinaryTreeNode(key);
      } else {
        this.insertNode(node.left, key)
      }
    } else {
      if (node.right == null) {
        node.right = new BinaryTreeNode(key);
      } else {
        this.insertNode(node.right, key)
      }
    }
  }

  // 中序遍历
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback);
  }

  private inOrderTraverseNode(node, callback) {
    if (node == null) return;
    this.inOrderTraverseNode(node.left, callback);
    callback(node.key);
    this.inOrderTraverseNode(node.right, callback);
  }

  // 先序遍历
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }

  private preOrderTraverseNode(node, callback) {
    if (node == null) return;
    callback(node.key);
    this.preOrderTraverseNode(node.left, callback);
    this.preOrderTraverseNode(node.right, callback);
  }

  // 后序遍历
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback);
  }

  private postOrderTraverseNode(node, callback) {
    if (node == null) return;
    this.postOrderTraverseNode(node.left, callback);
    this.postOrderTraverseNode(node.right, callback);
    callback(node.key);
  }

  // 搜索最小值，最下层的最左侧节点
  min() {
    return this.minNode(this.root);
  }

  minNode(node) {
    if (node.left == null) {
      return node;
    } else {
      return this.minNode(node.left)
    }
  }

  // 搜索最大值，最下层的最右侧节点
  max() {
    return this.maxNode(this.root);
  }

  maxNode(node) {
    if (node.right == null) {
      return node;
    } else {
      return this.maxNode(node.right)
    }
  }

  //  搜索特定值
  search(key) {
    return this.searchNode(this.root, key);
  }

  searchNode(node, key) {
    if (node == null) return false;
    if (this.compareFn(node.key, key) === Compare.MORE_THAN) {
      return this.searchNode(node.left, key)
    } else if (node.key < key) {
      return this.searchNode(node.right, key);
    } else {
      return true
    }
  }

  // 移除一个节点
  remove(key) {
    this.root = this.removeNode(this.root, key);
  }

  private removeNode(node, key) {
    if (node == null) return null;
    if (this.compareFn(node.key, key) === Compare.MORE_THAN) {
      node.left = this.removeNode(node.left, key);
      return node;
    } else if (this.compareFn(node.key, key) === Compare.LESS_THAN) {
      node.right = this.removeNode(node.right, key);
      return node;
    } else {
      // 找到要删除的节点
      if (node.left == null && node.right == null) {
        node = null;
        return node;
      }

      if (node.left == null) {
        node = node.right;
        return node;
      } else if (node.right == null) {
        node = node.left;
        return node;
      }

      const aux = this.minNode(node.right);
      node.key = aux.key;
      node.right = this.removeNode(node.right, aux.key);
      return node;
    }
  }
 
}