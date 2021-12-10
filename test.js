class StringIdGenerator {
    constructor(chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      this._chars = chars;
      this._nextId = [0];
    }
  
    next() {
      const r = [];
      for (const char of this._nextId) {
        r.unshift(this._chars[char]);
      }
      this._increment();
      return r.join('');
    }
  
    _increment() {
      for (let i = 0; i < this._nextId.length; i++) {
        const val = ++this._nextId[i];
        if (val >= this._chars.length) {
          this._nextId[i] = 0;
        } else {
          return;
        }
      }
      this._nextId.push(0);
    }
  
    *[Symbol.iterator]() {
      while (true) {
        yield this.next();
      }
    }
  }
const ids = new StringIdGenerator();

const rowAmount = 4;
const columnAmount = 11;
for(let j = 0; j<rowAmount ;j++){
    let increment = 0
    let alphabet = ids.next();
    console.log(typeof alphabet)
    for(let i=0;i<columnAmount;i++){
        increment += 1;
        let alphabet1 = alphabet
        console.log(alphabet1)
        console.log(increment)
    }
                    
    
}



