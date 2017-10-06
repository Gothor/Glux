class Token {

  constructor(first, second, player) {
    this.first = first;
    this.second = second;
    this.player = player;
  }

  hasValue(value) {
    return this.first === value || this.second === value;
  }

  flip() {
    const tmp = this.first;
    this.first = this.second;
    this.second = tmp;
  }

  display(x, y, width, displayText) {
    fill(this.player.color);
    ellipse(x, y, width, width);

    if (displayText === undefined || displayText) {
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(width - 6);
      text(this.first, x, y);
    }
  }

}
