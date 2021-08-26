
import React, { useState } from "react";
import { Button, Input } from "antd";

import { newGrid, makeRng, renderLetter, crop } from "../helpers/grapheme";


function LetterControl(props) {
  return (
    <div>
      <Button
        onClick={e => {
          props.delIdx(props.idx);
        }}
      >X (del)
      </Button>
      <span>Control for tokenId:{props.tokenId} - DNA:{props.tokenDNA} - position:({props.row}, {props.col})</span>
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
  const yourTokens = props.yourTokens ? props.yourTokens : [];
  const [rows, setRows] = useState([]); //useState([1, 4, 2]);
  const [cols, setCols] = useState([]); //useState([10, 20, 80]);
  const setColIdx = (idx, num) => { let cpy = [...cols]; cpy[idx] = num; setCols(cpy); };
  const setRowIdx = (idx, num) => { let cpy = [...rows]; cpy[idx] = num; setRows(cpy); };
  const [tokenIds, setTokenIds] = useState([]); //[0, 1, 2];
  const fakeDNAs = [
    [4,1,0,6,6,7,2,5], // n
    [7,2,0,6,2,7,0,4], // P
    [3,5,3,6,0,5,0,0], // B
    [2,3,1,6,0,7,3,5], // ~A
    [7,5,7,4,7,4,4,0], // _M
    [7,2,0,1,7,1,2,1], // _X~
    [4,2,1,7,6,4,4,0], // 4
  ];
  const [tokenDNAs, setTokenDNAs] = useState([]);
  const add = (tokenId) => {
    setRows([...rows].concat([1]));
    setCols([...cols].concat([1]));
    setTokenDNAs([...tokenDNAs].concat([fakeDNAs[tokenId].join(',')]));
    setTokenIds([...tokenIds].concat([tokenId]));
  };
  const delIdx = (idx) => {
    setRows(rows.filter((_, i) => i != idx));
    setCols(cols.filter((_, i) => i != idx));
    setTokenDNAs(tokenDNAs.filter((_, i) => i != idx));
    setTokenIds(tokenIds.filter((_, i) => i != idx));
  };

  return (
    <div>
      <span>Add one of your Letters: </span>
      {yourTokens ? yourTokens.map(item => (<Button key={'add-' + item.id.toString()} onClick={e => add(item.id.toNumber())} >Add #{item.id.toString()}</Button>)) : '...'}
      <DrawWord tokenIds={tokenIds} tokenDNAs={tokenDNAs} rows={rows} cols={cols} />
      { tokenIds.map((id, idx) => (<span key={'foo-'+idx}>{id}, {idx}</span>)) }
      { tokenIds.map((id, idx) => (
        <LetterControl key={'lc-' + idx} idx={idx} delIdx={delIdx} tokenId={tokenIds[idx]} tokenDNA={tokenDNAs[idx]} setRow={(num) => setRowIdx(idx, num)} setCol={(num) => setColIdx(idx, num)} row={rows[idx]} col={cols[idx]} />
      )) }
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
  if (tokenIds.length == 0) {
    return '...';
  }
  // tokenIds - list of tokenId (uint256)
  // tokenDNAs - list of string of numbers - subject to change to just a bitstring
  // rows
  // cols
  const bgCh = ' ';
  const newRow = () => [...Array(250)].map(und => bgCh);
  let grid = [...Array(80)].map(_ => newRow());
  let letterGrids = tokenDNAs.map((dna, idx) => {
    let letterGrid = newGrid();
    renderLetter(letterGrid, makeRng(dna.split(',').map(s => parseInt(s))));
    writeLetterToGrid(grid, letterGrid, rows[idx], cols[idx]);
    grid[rows[idx]][cols[idx]] = idx;
    return letterGrid;
  });
  crop(grid);
  const letterStyle = {fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', lineHeight: '16px', letterSpacing: '-2px', marginBottom: 0};

  return (
      <div>
        { grid.map((row, idx) => (<pre key={'grow-' + idx} style={letterStyle}>{row.join('')}</pre>)) }
      </div>
  );
}

