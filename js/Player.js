class Player {

  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.bag = [];
    for (let j = 1; j <= 3; j++) {
      for (let i = 0; i < 8; i++) {
        this.bag.push(new Token(j, 7 - j, this));
      }
    }
    this.currentToken = null;
  }

  drawToken(value) {
    if (!value
        || typeof value !== 'number'
        || value < 1
        || value > 6) {
      value = undefined;
    }

    if (!value) {
      if (this.bag.length > 0) {
        this.shuffleBag();
        this.currentToken = this.bag.pop();
      } else {
        throw new Error('No more tokens in the bag');
      }
    } else {
      const index = this.bag.findIndex(e => e.hasValue(value));
      if (index < 0) {
        throw new Error('No more token of this value');
      }
      this.currentToken = this.bag.splice(index, 1)[0];
      if (this.currentToken.first != value) {
        this.currentToken.flip();
      }
    }
  }

  shuffleBag() {
    for (let i = 0; i < this.bag.length; i++) {
      const rd = Math.floor(random(this.bag.length));
      const tmp = this.bag[i];
      this.bag[i] = this.bag[rd];
      this.bag[rd] = tmp;
    }
  }

  playTokenOn(box, y) {
    if (!(box instanceof Box)) {
      const x = box;
      box = grid[getId(x, y)];
    }

    try {
      box.add(this.currentToken);
      this.currentToken = null;
    } catch(e) {
      alert(e);
    }
  }

}
