
import React, { useEffect, useState } from "react";
import { Button, Input, Tooltip } from "antd";

import { newGrid, makeRng, renderLetter, crop } from "../helpers/grapheme";


function LetterControl(props) {
  return (
    <div>
      <span>Control for tokenId:{props.tokenId} - DNA:{props.tokenDNA.toString()} - position:({props.row}, {props.col})</span>
      {/*<Input
        value={props.row}
        onChange={e => {
          props.setRow(parseInt(e.target.value));
        }}
      />
      */}
      <Button
        onClick={e => {
          props.setRow(props.row-1);
        }}
      >UP
      </Button>
      <Button
        onClick={e => {
          props.setRow(props.row+1);
        }}
      >DOWN
      </Button>
      <Button
        onClick={e => {
          props.setCol(props.col+1);
        }}
      >RIGHT
      </Button>
      <Button
        onClick={e => {
          props.setCol(props.col-1);
        }}
      >LEFT
      </Button>
    </div>
  )
}
export default function DrawWordTool(props) {
  const [rows, setRows] = useState([1, 4, 2]);
  const [cols, setCols] = useState([10, 20, 80]);
  const setColIdx = (idx, num) => { let cpy = [...cols]; cpy[idx] = num; setCols(cpy); };
  const setRowIdx = (idx, num) => { let cpy = [...rows]; cpy[idx] = num; setRows(cpy); };
  const tokenIds = [0, 1, 2];
  const fakeDNAs = [
    [4,1,0,6,6,7,2,5], // n
    [7,2,0,6,2,7,0,4], // P
    [3,5,3,6,0,5,0,0], // B
    [2,3,1,6,0,7,3,5], // ~A
    [7,5,7,4,7,4,4,0], // _M
    [7,2,0,1,7,1,2,1], // _X~
    [4,2,1,7,6,4,4,0], // 4
  ];
  const tokenDNAs = fakeDNAs.slice(0, 3);

  return (
    <div>
      <DrawWord tokenIds={tokenIds} tokenDNAs={tokenDNAs} rows={rows} cols={cols} />
      <LetterControl tokenId={tokenIds[0]} tokenDNA={fakeDNAs[0]} setRow={(num) => setRowIdx(0, num)} setCol={(num) => setColIdx(0, num)} row={rows[0]} col={cols[0]} />
      <LetterControl tokenId={tokenIds[1]} tokenDNA={fakeDNAs[1]} setRow={(num) => setRowIdx(1, num)} setCol={(num) => setColIdx(1, num)} row={rows[1]} col={cols[1]} />
      <LetterControl tokenId={tokenIds[2]} tokenDNA={fakeDNAs[2]} setRow={(num) => setRowIdx(2, num)} setCol={(num) => setColIdx(2, num)} row={rows[2]} col={cols[2]} />
      </div>
  );
}
function writeLetterToGrid(grid, letterGrid, row, col) {
  // XXX setState should block bad/negative values
  row = row < 0 ? 0 : row;
  col = col < 0 ? 0 : col;
  for (let i = 0; i < letterGrid.length; i++) {
    for (let j = 0; j < letterGrid[i].length; j++) {
      let ch = letterGrid[i][j];
      if (ch == ' ' || ch == '.') {
        // skip
      } else {
        try{
        grid[row + i][col + j] = ch;
        } catch (e) {
          debugger;
        }
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

