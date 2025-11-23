/**
 * LeetCode 61: 旋转链表 (Rotate List)
 *
 * 思路：
 * 1. 计算链表长度并找到最后一个节点
 * 2. 计算实际旋转次数 (k % len)
 * 3. 如果旋转次数为0，直接返回
 * 4. 找到断开位置（第 len-count 个节点）
 * 5. 执行：新头=旧链的第(len-count+1)个，最后接到原头
 */

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function rotateRight(head: ListNode | null, k: number): ListNode | null {
  // 特殊情况：空链表或单节点链表
  if (!head || !head.next) return head;

  // 第1步：计算长度 + 找最后一个节点
  let len = 1;
  let tail = head;

  while (tail.next) {
    len++;
    tail = tail.next;
  }

  // 第2步：计算实际旋转次数
  const count = k % len;

  // 如果旋转次数为0，无需处理
  if (count === 0) return head;

  // 第3步：找到断开位置
  // 需要找到第 (len - count - 1) 个节点
  let current = head;
  for (let i = 0; i < len - count - 1; i++) {
    current = current.next!;
  }

  // 第4步：断开并重新连接
  const newHead = current.next; // 新的头节点
  current.next = null; // 断开连接
  tail.next = head; // 形成环：最后接到原头

  return newHead;
}

// ============ 测试用例 ============

function createLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}

function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

function printTest(
  testNum: number,
  arr: number[],
  k: number,
  expected: number[]
) {
  const head = createLinkedList(arr);
  const result = rotateRight(head, k);
  const actual = linkedListToArray(result);

  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(
    `测试 ${testNum}: ${passed ? "✅ 通过" : "❌ 失败"}\n` +
      `  输入: [${arr.join(",")}], k=${k}\n` +
      `  期望: [${expected.join(",")}]\n` +
      `  实际: [${actual.join(",")}]\n`
  );
}

console.log("===== 旋转链表测试 =====\n");

// 测试用例1：基本情况
printTest(1, [1, 2, 3, 4, 5], 2, [4, 5, 1, 2, 3]);

// 测试用例2：k大于链表长度
printTest(2, [0, 1, 2], 4, [2, 0, 1]);

// 测试用例3：k=0或k是len的倍数
printTest(3, [1, 2, 3, 4, 5], 5, [1, 2, 3, 4, 5]);

// 测试用例4：k=1
printTest(4, [1, 2, 3, 4, 5], 1, [5, 1, 2, 3, 4]);

// 测试用例5：单个节点
printTest(5, [1], 1, [1]);

// 测试用例6：两个节点
printTest(6, [1, 2], 1, [2, 1]);

// 测试用例7：两个节点，k=2
printTest(7, [1, 2], 2, [1, 2]);

// 测试用例8：大k值
printTest(8, [1, 2, 3, 4, 5], 102, [4, 5, 1, 2, 3]);

console.log("✅ 所有测试完成！");
