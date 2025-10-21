# 🚀 TypeScript + Node.js 调试环境完整配置指南

## 📚 目录
- [原理解析](#原理解析)
- [配置步骤](#配置步骤)
- [如何使用](#如何使用)
- [常见问题](#常见问题)

---

## 原理解析

### 🤔 为什么需要这些配置？

#### 问题背景
```
Node.js 原生只能执行 JavaScript (.js)
你写的是 TypeScript (.ts)
→ 需要转换才能运行和调试
```

#### 解决方案链条
```
.ts 文件 → TypeScript编译器 → .js 文件 → Node.js执行
         ↑                    ↑
      tsconfig.json        ts-node
```

---

## 核心配置文件详解

### 1️⃣ tsconfig.json - TypeScript 编译配置

#### 作用
告诉 TypeScript 编译器如何处理 `.ts` 文件。

#### 为什么需要它？
```typescript
// 你写的 TypeScript 代码
function add(a: number, b: number): number {
    return a + b;
}

// TypeScript 编译器需要知道：
// 1. 编译成什么版本的 JavaScript？(ES5/ES2020/ESNext)
// 2. 使用什么模块系统？(commonjs/es6)
// 3. 输出到哪里？(dist目录)
// 4. 是否生成 source map？(用于调试)
```

#### 关键配置项解释

```json
{
  "compilerOptions": {
    // 1. 编译目标 - 决定生成什么版本的 JS
    "target": "ES2020",  
    // 为什么选 ES2020？
    // - Node.js 14+ 原生支持
    // - 包含现代 JS 特性（async/await, Promise, 等）
    
    // 2. 模块系统 - 决定如何处理 import/export
    "module": "commonjs",
    // 为什么选 commonjs？
    // - Node.js 默认的模块系统
    // - 使用 require() 和 module.exports
    
    // 3. Source Map - 调试的关键！
    "sourceMap": true,
    // 为什么需要？
    // - 建立 .ts 和 .js 的映射关系
    // - 让调试器能显示原始 TypeScript 代码
    // - 断点能正确对应到 TS 源码
    
    // 4. 输出目录
    "outDir": "./dist",
    // 编译后的 .js 文件放在这里
    
    // 5. 其他重要配置
    "strict": true,              // 启用严格类型检查
    "esModuleInterop": true,     // 更好的模块互操作性
    "moduleResolution": "node"   // 使用 Node.js 的模块解析策略
  }
}
```

#### Source Map 原理图解
```
调试时的映射关系：

你看到的：                实际执行的：
tests/647.ts            dist/tests/647.js
第10行：let count = 0;  第8行：var count = 0;
         ↑                       ↑
         └───── source map ──────┘
              (647.js.map)

调试器通过 .js.map 文件找到对应的 .ts 源码位置
```

---

### 2️⃣ 三个必要依赖

#### 依赖清单
```json
{
  "dependencies": {
    "typescript": "^5.9.3"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.2"
  }
}
```

#### 详细解析

##### 📦 `typescript` - TypeScript 编译器

**作用：**
```
将 .ts 代码转换为 .js 代码
```

**为什么需要？**
```typescript
// 你写的 TypeScript
let name: string = "Alice";
let age: number = 25;

// 编译器转换为 JavaScript
var name = "Alice";
var age = 25;
```

**如果不安装会怎样？**
```bash
# 运行 .ts 文件会报错
node tests/647.ts
# Error: Cannot use import statement outside a module
```

---

##### 📦 `ts-node` - TypeScript 执行器

**作用：**
```
在运行时即时编译并执行 TypeScript
= 编译 + 执行 的组合工具
```

**工作原理：**
```
传统方式（两步）：
1. tsc tests/647.ts  → 生成 tests/647.js
2. node tests/647.js → 执行

ts-node 方式（一步）：
ts-node tests/647.ts → 内存中编译 + 立即执行
```

**为什么调试需要它？**
```
调试器启动时需要执行：
node -r ts-node/register tests/647.ts

-r ts-node/register 的作用：
1. 注册 TypeScript 编译钩子
2. 拦截 .ts 文件的加载
3. 即时编译成 JS
4. 交给 Node.js 执行
```

**如果不安装会怎样？**
```bash
# 调试器无法启动
# 报错：Cannot find module 'ts-node/register'
```

---

##### 📦 `@types/node` - Node.js 类型定义

**作用：**
```
提供 Node.js API 的 TypeScript 类型声明
```

**为什么需要？**
```typescript
// 没有 @types/node 时
console.log('hello');  // TS 报错：找不到 console
process.env.NODE_ENV;  // TS 报错：找不到 process

// 安装 @types/node 后
console.log('hello');  // ✓ 正常，有类型提示
process.env.NODE_ENV;  // ✓ 正常，有类型提示和自动补全
```

**类型定义示例：**
```typescript
// @types/node 提供的类型
declare const console: {
  log(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  // ...
};

declare const process: {
  env: NodeJS.ProcessEnv;
  exit(code?: number): never;
  // ...
};
```

**如果不安装会怎样？**
```typescript
// 代码能运行，但编辑器会报类型错误
// 没有智能提示和类型检查
console.log('test');  // 红色波浪线警告
```

---

### 3️⃣ .vscode/launch.json - 调试配置

**作用：**
告诉 VSCode 如何启动调试器。

**核心配置解析：**
```json
{
  "type": "node",           // 调试器类型：Node.js
  "request": "launch",      // 启动模式：直接启动程序
  "name": "调试当前 TS 文件",
  
  // 关键：使用 ts-node 运行
  "runtimeArgs": [
    "-r",                   // --require 的缩写
    "ts-node/register"      // 注册 TypeScript 编译器
  ],
  
  // 要调试的文件
  "args": [
    "${file}"               // ${file} = 当前打开的文件路径
  ],
  
  "cwd": "${workspaceFolder}",     // 工作目录
  "console": "integratedTerminal",  // 输出到集成终端
  
  // 跳过 Node.js 内部代码
  "skipFiles": [
    "<node_internals>/**"
  ]
}
```

**等价的命令行：**
```bash
# 按 F5 时，实际执行的命令：
node -r ts-node/register /path/to/your/file.ts
```

---

## 配置步骤

### 步骤 1：安装依赖

```bash
# 在项目根目录执行
npm install typescript --save
npm install ts-node @types/node --save-dev
```

**为什么分开安装？**
- `typescript` 是运行时依赖（可能在生产环境使用）
- `ts-node` 和 `@types/node` 是开发依赖（只在开发时使用）

---

### 步骤 2：创建 tsconfig.json

在项目根目录创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "moduleResolution": "node"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**验证配置：**
```bash
# 测试编译
npx tsc --noEmit

# 如果没有错误输出，说明配置正确
```

---

### 步骤 3：创建调试配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "调试当前 TS 文件",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${file}"],
      "cwd": "${workspaceFolder}",
      "protocol": "inspector",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

### 步骤 4：创建测试文件

在 `tests/` 目录创建测试文件：

```typescript
// tests/example.ts

function add(a: number, b: number): number {
    return a + b;
}

// 测试
console.log('测试 add 函数:');
console.log('2 + 3 =', add(2, 3));
console.log('10 + 20 =', add(10, 20));
```

---

### 步骤 5：验证配置

```bash
# 1. 测试 ts-node 是否工作
npx ts-node tests/example.ts

# 2. 应该看到输出：
# 测试 add 函数:
# 2 + 3 = 5
# 10 + 20 = 30

# 如果成功，说明配置正确！
```

---

## 如何使用

### 🎯 基础调试流程

#### 1. 设置断点
```
方法1：点击行号左侧，出现红点
方法2：按 F9 切换断点
方法3：右键菜单 → 切换断点
```

#### 2. 启动调试
```
方法1：按 F5
方法2：点击左侧调试图标 → 点击播放按钮
方法3：菜单 → 运行 → 启动调试
```

#### 3. 控制执行
```
F5  - 继续执行到下一个断点
F10 - 单步跳过（执行当前行）
F11 - 单步进入（进入函数内部）
Shift+F11 - 单步跳出（跳出当前函数）
Shift+F5  - 停止调试
```

#### 4. 查看变量
```
- 鼠标悬停在变量上
- 查看左侧"变量"面板
- 在"监视"面板添加表达式
```

---

### 📝 实战示例

#### 示例代码
```typescript
// tests/debug-demo.ts

function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 在这里设置断点 ↓
console.log('斐波那契数列:');
for (let i = 0; i <= 5; i++) {
    const result = fibonacci(i);  // 在这里设置断点 ↓
    console.log(`f(${i}) = ${result}`);
}
```

#### 调试步骤
```
1. 在 fibonacci 函数第一行设置断点
2. 在 console.log 那行设置断点
3. 按 F5 启动调试
4. 观察调用堆栈中的递归过程
5. 使用 F10 单步执行，观察 result 的值
```

---

### 🎨 高级技巧

#### 1. 条件断点
```
场景：只想在特定条件下暂停

操作：
1. 右键点击断点
2. 选择"编辑断点"
3. 输入条件：i === 3

效果：只有当 i 等于 3 时才会暂停
```

#### 2. 日志断点
```
场景：不想暂停，只想输出日志

操作：
1. 右键点击断点位置
2. 选择"添加日志点"
3. 输入：当前i={i}, result={result}

效果：不会暂停，只在调试控制台输出日志
```

#### 3. 监视表达式
```
场景：实时监控复杂表达式

操作：
1. 在"监视"面板点击 +
2. 输入：nums.filter(x => x > 0).length

效果：实时显示数组中正数的个数
```

---

## 常见问题

### ❌ 问题1：调试器无法启动

**现象：**
```
Cannot find module 'ts-node/register'
```

**原因：**
没有安装 ts-node

**解决：**
```bash
npm install ts-node --save-dev
```

---

### ❌ 问题2：断点不生效

**现象：**
断点显示灰色，无法暂停

**可能原因：**
1. 文件未保存 → 按 `Ctrl+S` 保存
2. 断点在空行或注释上 → 移到代码行
3. Source Map 未生成 → 检查 tsconfig.json 中 `"sourceMap": true`

**解决：**
```bash
# 1. 删除旧的编译输出
rm -rf dist/

# 2. 重新编译
npx tsc

# 3. 检查是否生成了 .js.map 文件
ls dist/**/*.js.map

# 4. 重启 VSCode
```

---

### ❌ 问题3：看不到变量值

**现象：**
变量面板为空或显示"not available"

**原因：**
程序未在断点处暂停

**解决：**
1. 确保设置了断点
2. 确保程序执行到了断点
3. 检查断点是否有条件限制

---

### ❌ 问题4：类型错误但能运行

**现象：**
```typescript
console.log('test');  // 编辑器报红线
```

**原因：**
缺少 `@types/node`

**解决：**
```bash
npm install @types/node --save-dev

# 如果还不行，重启 VSCode
```

---

## 工作原理总结

### 完整流程图

```
你按下 F5
    ↓
VSCode 读取 .vscode/launch.json
    ↓
执行: node -r ts-node/register your-file.ts
    ↓
ts-node 拦截 .ts 文件加载
    ↓
根据 tsconfig.json 配置编译 TypeScript
    ↓
生成 .js 代码 + .js.map 映射文件
    ↓
Node.js 执行 .js 代码
    ↓
调试器通过 .js.map 定位到原始 .ts 代码
    ↓
你在 VSCode 中看到 .ts 源码，可以设置断点调试
```

### 文件关系图

```
项目结构：
├── tsconfig.json          ← TypeScript 如何编译
├── .vscode/
│   └── launch.json        ← VSCode 如何调试
├── package.json           ← 项目依赖声明
├── node_modules/          ← 依赖实际代码
│   ├── typescript/        ← TS 编译器
│   ├── ts-node/           ← TS 执行器
│   └── @types/node/       ← Node.js 类型
└── tests/
    └── example.ts         ← 你的代码
```

---

## 快速参考

### 必备文件检查清单

- [ ] `package.json` 包含三个依赖
- [ ] `tsconfig.json` 存在且 `sourceMap: true`
- [ ] `.vscode/launch.json` 存在
- [ ] 依赖已安装 (`node_modules/` 目录存在)

### 常用命令

```bash
# 安装依赖
npm install

# 运行 TypeScript 文件
npx ts-node tests/your-file.ts

# 编译 TypeScript (不执行)
npx tsc

# 编译并监听文件变化
npx tsc --watch
```

### 快捷键速查

| 功能 | 快捷键 | 说明 |
|------|--------|------|
| 启动调试 | F5 | 开始或继续 |
| 停止调试 | Shift+F5 | 终止调试 |
| 设置断点 | F9 | 切换断点 |
| 单步跳过 | F10 | 执行当前行 |
| 单步进入 | F11 | 进入函数 |
| 单步跳出 | Shift+F11 | 跳出函数 |
| 重启调试 | Ctrl+Shift+F5 | 重新启动 |

---

## 🎉 恭喜！

现在你已经完全理解了 TypeScript 调试环境的配置原理：

✅ 知道为什么需要 `tsconfig.json`  
✅ 明白三个依赖的具体作用  
✅ 理解 Source Map 的工作原理  
✅ 掌握完整的配置流程  
✅ 能够独立搭建调试环境  

开始你的调试之旅吧！🚀

