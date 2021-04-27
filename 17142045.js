let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  
  let w; 
  let h; 
  let imgCat;
  let imgMouse;
  
  let ai = 'O';
  let human = 'X';
  let currentPlayer = human;
  
  function preload() {
    imgCat = loadImage('https://image.flaticon.com/icons/png/512/59/59636.png');
    imgMouse = loadImage('https://image.flaticon.com/icons/png/512/58/58428.png');
}

function setup() {
  var canv = createCanvas(450, 450);
  canv.parent('CanvasHTML');
  w = width / 3;
  h = height / 3;
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

function mousePressed() {
  if (currentPlayer == human) {

    let i = floor(mouseX / w);
    let j = floor(mouseY / h);

    if (board[i][j] == '') {
      board[i][j] = human;
      currentPlayer = ai;
      bestMove();
    }
  }
}

function draw() {
  
  strokeWeight(4);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + 15;
      let y = h * j + 10;
      let spot = board[i][j];
      let r = w / 4;
      if (spot == human) {
        noFill();
        image(imgCat, x, y, 130, 130)
      } else if (spot == ai) {
        image(imgMouse, x, y, 130, 130)
      }
    }
  }

  let result = checkWinner();
  if (result != null) {
    noLoop();
    let resultP = createP('');
    resultP.parent('phtml')
    resultP.style('font-size', '28pt');
    if (result == 'tie') {
      resultP.html('Empate!!!');
    } else {
      if(result == 'O'){
        resultP.html(`Ratón gana!!!!`);
      }
      else{
        resultP.html(`Gato gana!!!!`);
      }
      
    }
  }
}

//Funcionamiento del juego :3

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
  currentPlayer = human;
}

let scores = {
  X: -10,
  O: 10,
  tie: 0
};

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}