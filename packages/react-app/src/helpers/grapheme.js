
//

const rows = 40;
const cols = 80;
const bgCh = ' ';
const newRow = () => [...Array(cols)].map(und => bgCh);
const newGrid = () => [...Array(rows)].map(_ => newRow());
function rowIsEmpty(grid, row) {
  if (grid[row]) {
    return (grid[row].findIndex(ch => ch != bgCh) == -1);
  }
  return true;
}
function colIsEmpty(grid, col) {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].length < col) {
      throw('Exceed');
    }
  }
  return (grid.map(row => row[col]).findIndex(ch => ch != bgCh) == -1);
}
function print(grid) {
  for (let row = 0; row < grid.length; row++) {
    //if (!rowIsEmpty(grid, row)) {
    try {
      if ((grid[row])) {
        console.log(grid[row].join(''));
      } else {
        console.log('');
      }
    } catch(e) {
      console.log(`row: ${row}, grid.length: ${grid.length}`);
      console.log(grid);
      console.log(e);
    }
    //}
  }
}
function crop(grid) {
  while (rowIsEmpty(grid, 0)) {
    grid.shift();
  }
  while (rowIsEmpty(grid, grid.length-1)) {
    grid.pop();
  }
  try {
    while (colIsEmpty(grid, 0)) {
      grid.forEach(row => row.shift());
    }
  } catch(e) {}
  try {
    while (colIsEmpty(grid, grid[0].length-1)) {
      grid.forEach(row => row.pop());
    }
  } catch(e) {}
}
function write(grid, x, y, str) {
  if (!grid[y]) { // assumes incrementing rows but not skipping
    grid[y] = newRow();
  }
  // ensures initialization
  while (grid[y].length < x + str.length) {
    grid[y].push(bgCh);
  }
  for (let i = 0; i < str.length; i++) {
    grid[y][x + i] = str[i];
  }
}
function strepeat(str, count) {
  let retval = '';
  while (count--) {
    retval += str;
  }
  return retval;
}

function _rnd() {
  // simulates 3 bits of entropy, an octal
  return Math.floor(Math.random()*8);
}

// returns a function that will return randomness on each call. recycle for limitless fun.
function makeRng(entropy) {
  return () => { const x = entropy.shift(); entropy.push(x); return x; }
}

function renderLetter(grid, rng) {
  let x = Math.floor(0.75 * cols);
  let y = Math.floor(0.75 * rows);
  const startStroke = rng() % 4; // max 3
  const maxStrokes = startStroke + 2 + rng() % 6; // min 2
  const nextNum = rng();
  const skipStroke = nextNum > startStroke ? (nextNum < maxStrokes ? nextNum : nextNum-3) : nextNum % startStroke
  const _write = (s) => i == skipStroke ? false : write(grid, x, y, s);

  let i;
  // % 4 == 0 -> up, == 1 -> left,  down, right
  for (i = startStroke; i < maxStrokes; i++) {
    let len = 8 + rng(); // lens.shift();
    let lenCopy = len;
    let girth;
    switch (i % 4) {
      case 0:
        girth = 2 + rng();
        if (rng() % 3 == 0) { // diag
          _write('\\' + strepeat('_', girth) + '\\/');
          x--; y--;
          _write('\\' + strepeat(' ', girth) + '\\  /');
          while (len--) {
            x--; y--;
            _write('\\' + strepeat(' ', girth) + '\\   \\');
          }
          y--;
          _write('/' + strepeat('_', girth) + '/  \\');
          x++; y--;
          _write('/' + strepeat(' ', girth) + '/\\');
          x++; y--;
          _write(strepeat('_', girth+1));
        } else {
          _write('\\' + strepeat('_', girth) + '\\/');
          y--;
          _write('/' + strepeat('_', girth) + '/ /');
          while (len--) {
            x++; y--;
            _write('/' + strepeat(' ', girth) + '/ /');
          }
          x++; y--;
          _write('/' + strepeat(' ', girth) + '/\\');
          x++; y--;
          _write(strepeat('_', girth));
          y += 1; x += 2; // recenter
        }
        break;
      case 1:
        girth = 2; // hard-coded
        len *= 2;
        x -= len - 1;
        y--;
        _write(strepeat('_', len+1));
        x--; y++;
        _write('/' + strepeat(' ', len) + '/\\');
        while (girth--) {
          x--; y++;
          _write('/' + strepeat(' ', len) + '/ /');
        }
        x--; y++;
        _write('/' + strepeat('_', len) + '/ /');
        y++;
        _write('\\' + strepeat('_', len) + '\\/');
        break;
      case 2:
        girth = 2 + rng();
        if (rng() % 3 == 0) { // diag
          _write(strepeat('_', girth));
          x--; y++;
          _write('/' + strepeat(' ', girth) + '/\\');
          x--; y++;
          _write('/' + strepeat('_', girth) + '/  \\');
          while (len--) {
            x++; y++;
            _write('\\' + strepeat(' ', girth) + '\\   \\');
          }
          x++; y++;
          _write('\\' + strepeat(' ', girth) + '\\  /');
          x++; y++;
          _write('\\' + strepeat('_', girth) + '\\/');
        } else {
          x += 2; y -= 4;
          _write(strepeat('_', girth));
          x--; y++;
          _write('/' + strepeat(' ', girth) + '/\\');
          while (len--) {
            x--; y++;
            _write('/' + strepeat(' ', girth) + '/ /');
          }
          x--; y++;
          _write('/' + strepeat('_', girth) + '/ /');
          y++;
          _write('\\' + strepeat('_', girth) + '\\/');
          if (true || rng() % 2 == 0) {
            y -= Math.floor(lenCopy / 2);
            x += Math.floor(lenCopy /2);
          } else {
            y -= 1; x -= 2; // recenter
          }
        }
        break;
      case 3:
        len *= 2;
        _write(strepeat('_', len));
        x--; y++;
        _write('/' + strepeat(' ', len) + '/\\');
        x--; y++;
        _write('/' + strepeat(' ', len) + '/ /');
        x--; y++;
        _write('/' + strepeat('_', len) + '/ /');
        y++;
        _write('\\' + strepeat('_', len) + '\\/');
        x += len;
      default:
        break;
    }
  }

  crop(grid);
}

function main() {
  let grid = newGrid();
  let numbers = [...Array(8)].map(_ => _rnd());
  console.log(numbers.join(','));
  //let rng = makeRng([4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2]);
  let rng = makeRng(numbers);
  renderLetter(grid, rng);
  print(grid);
}
if (require.main === module) {
  main();
}

module.exports = {
  newGrid,
  makeRng,
  renderLetter,
  crop
}
