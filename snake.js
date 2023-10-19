/**
 * 思路分析：
 * 蛇移动后有 2 种结果：1. 撞墙或者撞身体，导致游戏结束 2. 吃到食物或者未吃到食物，游戏未结束
 */

class SnakeGame {
  constructor(width, height, food) {
      this.snake = [[0, 0]];
      this.food = food;
      this.count = food.length;
      this.width = width;
      this.height = height;
  }

  move(direction) {
      const [x, y] = this.snake[0];
      let newHead = [];
      switch(direction) {
          case 'U':
              newHead = [x, y - 1];
              break;
          case 'D':
              newHead = [x, y + 1];
              break;
          case 'L':
              newHead = [x - 1, y];
              break;
          case 'R':
              newHead = [x + 1, y];
              break;
      }
      this.snake.unshift(newHead);
      if(this.isTouchSlide() || this.isTouchBody()) return -1;
      if(this.isTouchFood()) {
          this.food.shift();
      } else {
          this.snake.pop();
      }
      return this.count - this.food.length;
  }

  isTouchSlide() {
      const [x, y] = this.snake[0];
      return x < 0 || x > this.width || y < 0 || y > this.height;
  }

  isTouchBody() {
      const [x, y] = this.snake[0];
      for(let i = 1; i < this.snake.length; i++) {
          const [ix, iy] = this.snake[i];
          if(x === ix && y === iy) {
              return true;
          }
      }
      return false;
  }

  isTouchFood() {
      const [x, y] = this.snake[0];
      const [fx, fy] = this.food[0];
      return x === fx && y === fy;
  }
}