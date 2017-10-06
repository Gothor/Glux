class Box {

  constructor(zone, x, y) {
    this.zone = zone;
    this.x = x;
    this.y = y;
    this.tokens = [];
    this.highlighting = false;
  }

  display() {
    if (this.zone > 0) {
      fill(areaBoxColor)
    } else {
      fill(boxColor);
    }
    push();
    translate(this.x * boxSize, this.y * boxSize);
    rect(1, 1, boxSize - 2, boxSize - 2);
    if (this.highlighting) {
      const r = red(currentPlayer().color);
      const g = green(currentPlayer().color);
      const b = blue(currentPlayer().color);
      fill(r, g, b, 100);
      rect(1, 1, boxSize - 2, boxSize - 2);
    }
    if (this.tokens.length > 0) {
      this.tokens[0].display(boxSize / 2, boxSize / 2, boxSize - 4, this.tokens.length === 1);
    }
    if (this.tokens.length > 1) {
      this.tokens[1].display(boxSize / 2, boxSize / 2, boxSize - 10);
    }
    pop();
  }

  add(token) {
    if (this.tokens.length < 2) {
      this.tokens.push(token);
    } else {
      throw new Error('No more room on this box');
    }
  }

  highlight(toggle) {
    if (toggle === undefined) toggle = true;

    this.highlighting = toggle;
  }

  hasTokens() {
    return this.tokens.length > 0;
  }

  lastToken() {
    return this.hasTokens() ? this.tokens[this.tokens.length - 1] : null;
  }

}
