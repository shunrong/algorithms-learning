class HitCounter {
  constructor() {
      this.quene = [];
  }

  hit(timestamp) {
      if(this.quene.length === 0) {
          this.quene.push([timestamp, 1])
      } else {
          const last = this.quene.pop();
          let newLast = [timestamp, 1];
          if(last[0] === timestamp) {
              newLast = [timestamp, ++last[1]]
          }
          this.quene.push(newLast);
      }
  }

  getHits(timestamp) {
      if(this.quene.length < 1) return 0;
      while(this.quene[0][0] < (timestamp - 300)){
          this.quene.shift();
      }
      if(this.quene.length < 1) return 0;
      return this.quene.reduce((prev, next) => {
          return prev + next[1];
      }, 0);
  }
}
