
import React, { useEffect, useState } from "react";
import { Button, Input, Tooltip } from "antd";

import { newGrid, makeRng, renderLetter, crop } from "../helpers/grapheme";


export default function DrawWordTool(props) {
  const [col1, setCol1] = useState(20);
  const [row1, setRow1] = useState(2);
  const tokenIds = [0, 1, 2];
  const tokenDNAs = [[4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2],
      [4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2],
      [4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2]];
  const rows = [1, row1, 10];
  const cols = [1, col1, 80];

  return (
    <div>
      <DrawWord tokenIds={tokenIds} tokenDNAs={tokenDNAs} rows={rows} cols={cols} />
      <span>Middle Letter column offset:</span>
      <Input
        value={col1}
        onChange={e => {
          setCol1(parseInt(e.target.value));
        }}
      />
      <span>Middle Letter row offset:</span>
      <Input
        value={row1}
        onChange={e => {
          setRow1(parseInt(e.target.value));
        }}
      />

      </div>
  );
}
function writeLetterToGrid(grid, letterGrid, row, col) {
  for (let i = 0; i < letterGrid.length; i++) {
    for (let j = 0; j < letterGrid[i].length; j++) {
      let ch = letterGrid[i][j];
      if (ch == ' ' || ch == '.') {
        // skip
      } else {
        grid[row + i][col + j] = ch;
      }
    }
  }
}
function DrawWord({ tokenIds, tokenDNAs, rows, cols }) {
  // tokenIds - list of tokenId (uint256)
  // tokenDNAs - list of arrays of numbers - subject to change to just a bitstring
  // rows
  // cols
  const bgCh = ' ';
  const newRow = () => [...Array(250)].map(und => bgCh);
  let grid = [...Array(80)].map(_ => newRow());
  let letterGrids = tokenDNAs.map((dna, idx) => {
    let letterGrid = newGrid();
    renderLetter(letterGrid, makeRng(dna));
    writeLetterToGrid(grid, letterGrid, rows[idx], cols[idx]);
    return letterGrid;
  });
  crop(grid);
  const letterStyle = {fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', lineHeight: '16px', letterSpacing: '-2px', marginBottom: 0};

  return (
      <div>
        { grid.map(row => (<pre style={letterStyle}>{row.join('')}</pre>)) }
      </div>
  );
}

