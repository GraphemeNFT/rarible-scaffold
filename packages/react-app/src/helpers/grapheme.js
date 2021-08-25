
//

const rows = 40;
const cols = 80;
const bgCh = '.';
const newRow = () => [...Array(cols)].map(und => bgCh);
const newGrid = () => [...Array(rows)].map(_ => newRow());
function rowIsEmpty(grid, row) {
  return (grid[row].findIndex(ch => ch != bgCh) == -1);
}
function colIsEmpty(grid, col) {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].length < col) {
      throw('Exceed');
    }
  }
  return (grid.map(row => row[col]).findIndex(ch => ch != bgCh) == -1);
}
function print(grid, usedRnds) {
  //console.log('rnd (bits: ' + 3*usedRnds.length + '): ' + usedRnds.join(', '));
  for (let row = 0; row < grid.length; row++) {
    if (!rowIsEmpty(grid, row)) {
      console.log(grid[row].join(''));
    }
  }
}
function crop(grid) {
  while (rowIsEmpty(grid, 0)) {
    grid.shift();
  }
  try {
    while (colIsEmpty(grid, 0)) {
      grid.forEach(row => row.shift());
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

// let usedRnds = [];
function _rnd() {
  // simulates 3 bits of entropy, an octal
  let rv = Math.floor(Math.random()*8);
  // usedRnds.push(rv);
  return rv;
}

// returns a function that will return randomness on each call
function makeRng(entropy) {
  return () => entropy.shift();
}

function renderLetter(grid, rng) {
  let x = Math.floor(0.75 * cols);
  let y = Math.floor(0.75 * rows);
  const startStroke = rng() % 4; // max 3
  const maxStrokes = startStroke + 2 + rng() % 6; // min 2
  const _write = (s) => write(grid, x, y, s);

  let width = 3; // XXX
  // % 4 == 0 -> up, == 1 -> left,  down, right
  for (let i = startStroke; i < maxStrokes; i++) {
    let len = 8 + rng(); // lens.shift();
    let girth;
    switch (i % 4) {
      case 0:
        girth = 2 + rng();
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
        break;
      case 1:
        girth = 2; // hard-coded
        len *= 2;
        x -= len - 1;
        y--;
        _write(strepeat('_', len));
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
        y -= 1; x -= 2; // recenter
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
  let rng = makeRng([4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2]);
  renderLetter(grid, rng);
  print(grid);
}
//main();


export {
  newGrid,
  makeRng,
  renderLetter
}
