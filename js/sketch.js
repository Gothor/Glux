let grid = [];
const gridSize = 15;
const boxSize = 50;
const nameBoxSize = boxSize * 1.4;
const nbAreas = 11;
let colors;
const autoplay = false;

let gameOver = false;
let backgroundColor = null;
let boxColor = null;
let areaBoxColor = null;
let players = [];
let currentPlayerId;
let played = false;
let scores;
let availableBoxes;
let startingBoxes;

function setup() {
  backgroundColor = color(0, 0, 100);
  boxColor = color(100, 100, 225);
  areaBoxColor = color(150, 150, 255);
  colors = [
    color(255, 0, 0),
    color(0, 255, 0),
    color(255, 255, 0)
  ];
  const playerNames = ['red', 'green', 'yellow'];
  scores = [0, 0, 0];
  const zones = [
    1,1,0,0,0,0,2,2,2,0,0,0,0,3,3,
    1,1,0,0,0,0,2,2,2,0,0,0,0,3,3,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,4,4,4,0,0,0,0,0,5,5,5,0,0,
    0,0,4,4,4,0,0,0,0,0,5,5,5,0,0,
    0,0,0,4,0,0,0,0,0,0,0,5,0,0,0,
    0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,
    0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,
    0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,
    0,0,0,7,0,0,0,0,0,0,0,8,0,0,0,
    0,0,7,7,7,0,0,0,0,0,8,8,8,0,0,
    0,0,7,7,7,0,0,0,0,0,8,8,8,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    9,9,0,0,0,0,10,10,10,0,0,0,0,11,11,
    9,9,0,0,0,0,10,10,10,0,0,0,0,11,11
  ];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      grid.push(new Box(zones[getId(x, y)], x, y));
    }
  }
  for (let i = 0; i < playerNames.length; i++) {
    players.push(new Player(i, playerNames[i], colors[i]));
  }
  startingBoxes = [
    grid[getId(0, 14)],
    grid[getId(14, 14)],
    grid[getId(7, 0)]
  ]
  createCanvas(gridSize * boxSize + 2, gridSize * boxSize + 2 + nameBoxSize);

  currentPlayerId = 0;
  played = false;

  for (let i = 0; i < players.length; i++) {
    players[i].drawToken(6);
    players[i].playTokenOn(startingBoxes[i]);
  }

  players[0].drawToken();

  highlightAvailableBoxes();
}

function idle() {
  if (played) {
    clearHighlights();
    currentPlayerId = nextPlayerId();
    try {
      currentPlayer().drawToken();

      highlightAvailableBoxes();
    } catch(e) {
      computeScores();
      noLoop();
      gameOver = true;
    }

    played = false;
  }
}

function computeScores() {
  const areas = [];
  for (let i = 0; i < nbAreas; i++) {
    areas[i] = [];
    for (let j = 0; j < players.length; j++) {
      areas[i][j] = 0;
    }
  }

  for (const box of grid) {
    if (box.zone > 0 && box.hasTokens()) {
      areas[box.zone - 1][box.lastToken().player.id]++;
    }
  }
  //console.table(areas);

  for (const area of areas) {
    maxValue = Math.max.apply(null, area);
    let nbPlayersFirstPos = 0;
    if (maxValue > 0) {
      for (i = 0; i < players.length; i++) {
        if (area[i] === maxValue) {
          area[i] = 0;
          scores[i] += 4;
          nbPlayersFirstPos++;
        }
      }
    }

    if (nbPlayersFirstPos != 1) {
      continue;
    }

    maxValue = Math.max.apply(null, area);
    if (maxValue > 0) {
      for (i = 0; i < players.length; i++) {
        if (area[i] === maxValue) {
          scores[i] += 2;
          area[i] = 0;
        }
      }
    }
  }
}

function clearHighlights() {
  for (const box of grid) {
    box.highlight(false);
  }
}

function highlightAvailableBoxes() {
  availableBoxes = getAvailableBoxes();
  for (const box of availableBoxes) {
    box.highlight();
  }
}

function getAvailableBoxes() {
  const boxes = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const box = grid[getId(x, y)];
      if (box.hasTokens() && box.lastToken().player === currentPlayer()) {
        const token = box.lastToken();
        if (x >= token.first && highlightLineIfPossible(box, grid[getId(x - token.first, y)]))
          boxes.push(grid[getId(x - token.first, y)]);
        if (x + token.first < gridSize && highlightLineIfPossible(box, grid[getId(x + token.first, y)]))
          boxes.push(grid[getId(x + token.first, y)]);
        if (y >= token.first && highlightColumnIfPossible(box, grid[getId(x, y - token.first)]))
          boxes.push(grid[getId(x, y - token.first)]);
        if (y + token.first < gridSize && highlightColumnIfPossible(box, grid[getId(x, y + token.first)]))
          boxes.push(grid[getId(x, y + token.first)]);
      }
    }
  }
  if (boxes.length === 0) {
    if (startingBoxes[currentPlayerId].tokens.length < 2) {
      boxes.push(startingsBoxes[currentPlayerId]);
    }
  }
  if (boxes.length === 0) {
    played = true;
  }
  return boxes;
}

function highlightLineIfPossible(source, target) {
  const diff = target.x > source.x ? 1 : -1;

  if (target.tokens.length > 1) {
    return false;
  }

  for (let x = source.x + diff; Math.abs(x - target.x) >= 1; x += diff) {
    if (grid[getId(x, source.y)].hasTokens()) return false;
  }

  return true;
}

function highlightColumnIfPossible(source, target) {
  const diff = target.y > source.y ? 1 : -1;

  if (target.tokens.length > 1) {
    return false;
  }

  for (let y = source.y + diff; Math.abs(y - target.y) >= 1; y += diff) {
    if (grid[getId(source.x, y)].hasTokens()) return false;
  }

  return true;
}

function draw() {
  idle();

  background(backgroundColor);

  push();
  translate(1, 1);

  // Draw grid
  for (const box of grid) {
    box.display();
  }

  pop();

  // Draw current token
  displayCurrentToken();

  // Draw player's name
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(currentPlayer().name, width / 2, boxSize * gridSize + 2 + nameBoxSize / 2);
  
  if (gameOver) {
    const w = width - 20;
    const h = boxSize * gridSize - 20;
    
    noStroke();
    fill(0, 0, 0, 150);
    rect(10, 10, w, h);
    
    push();
    translate(10, 10);
    fill(255);
    for (let i = 0; i < players.length; i++) {
      textAlign(LEFT, CENTER);
      text(players[i].name, 20, (i * h / players.length) + h / (players.length * 2));
      textAlign(RIGHT, CENTER);
      text(scores[i], w - 20, (i * h / players.length) + h / (players.length * 2));
    }
    pop();
  }

  if (autoplay && !played) {
    if (availableBoxes.length > 0 && currentPlayer().currentToken)
      currentPlayer().playTokenOn(availableBoxes[Math.floor(random(availableBoxes.length))]);
    played = true;
  }
}

function displayCurrentToken() {
  if (currentPlayer().currentToken)
    currentPlayer().currentToken.display(5 + nameBoxSize / 2, boxSize * gridSize + 2 + nameBoxSize / 2, nameBoxSize - 10);
}

function mousePressed() {
  if (clickedOnABox()) {
    const x = Math.floor(mouseX / boxSize);
    const y = Math.floor(mouseY / boxSize);
    const box = grid[getId(x, y)];

    if (box.highlighting) {
      currentPlayer().playTokenOn(box);
      played = true;
    }
  } else if (clickedOnCurrentToken()) {
    currentPlayer().currentToken.flip();
  }
}

function clickedOnABox() {
  return mouseX >= 0
    &&   mouseX < gridSize * boxSize
    &&   mouseY >+ 0
    &&   mouseY < gridSize * boxSize;
}

function clickedOnCurrentToken() {
  return dist(mouseX, mouseY, 5 + nameBoxSize / 2, boxSize * gridSize + 2 + nameBoxSize / 2) < (nameBoxSize - 10) / 2;
}

function currentPlayer() {
  return players[currentPlayerId];
}

function nextPlayerId() {
  return (currentPlayerId + 1) % players.length;
}

function getId(x, y) {
  return y * gridSize + x;
}
