
import React, { useState, useEffect, useRef } from "react";
import { Button, Input } from "antd";
import "../App.css";
import { newGrid, makeRng, renderLetter, crop } from "./Letters/grapheme";

// EXAMPLE STARTING JSON:
const STARTING_JSON = {
  description: "A Grapheme NFT Word",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  name: "Buffalo",
  attributes: [
    {
      trait_type: "tokenId_0",
      value: "",
    },
    {
      trait_type: "row_0",
      value: "",
    },
    {
      trait_type: "col_0",
      value: "",
    },
  ],
};

function makeMetadata (imageCid, name, tokenIds, rows, cols) {
  let metadata = Object.assign({}, STARTING_JSON);
  metadata.name = name;
  metadata.image = imageCid;
  metadata.attributes = [];
  for (let i = 0; i < tokenIds.length; i++) {
    metadata.attributes.push({ trait_type: "tokenId_" + i, value: tokenIds[i] });
    metadata.attributes.push({ trait_type: "row_" + i, value: rows[i] });
    metadata.attributes.push({ trait_type: "col_" + i, value: cols[i] });
  }
  return metadata;
}

async function metadataToIpfs (metadata, ipfs) {
  const result = await ipfs.add(JSON.stringify(metadata));
  return result;
}

function LetterControl (props) {
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
          props.setRow(props.row - 1);
        }}
      >UP
      </Button>
      <Button
        onClick={e => {
          props.setRow(props.row + 1);
        }}
      >DOWN
      </Button>
      <Button
        onClick={e => {
          props.setRow(props.row + 10);
        }}
      >DOWN 10
      </Button>
      <Button
        onClick={e => {
          props.setCol(props.col + 1);
        }}
      >RIGHT
      </Button>
      <Button
        onClick={e => {
          props.setCol(props.col + 10);
        }}
      >RIGHT 10
      </Button>
      <Button
        onClick={e => {
          props.setCol(props.col - 1);
        }}
      >LEFT
      </Button>
    </div>
  )
}

export default function DrawWordTool (props) {
  const yourTokens = props.yourTokens ? props.yourTokens : [];
  const [wordName, setWordName] = useState('');
  const [sending, setSending] = useState();
  const [rows, setRows] = useState([]); //useState([1, 4, 2]);
  const [cols, setCols] = useState([]); //useState([10, 20, 80]);
  const setColIdx = (idx, num) => { let cpy = [...cols]; cpy[idx] = num; setCols(cpy); };
  const setRowIdx = (idx, num) => { let cpy = [...rows]; cpy[idx] = num; setRows(cpy); };
  const [tokenIds, setTokenIds] = useState([]); //[0, 1, 2];
  const fakeDNAs = [
    [4, 1, 0, 6, 6, 7, 2, 5], // n
    [7, 2, 0, 6, 2, 7, 0, 4], // P
    [3, 5, 3, 6, 0, 5, 0, 0], // B
    [2, 3, 1, 6, 0, 7, 3, 5], // ~A
    [7, 5, 7, 4, 7, 4, 4, 0], // _M
    [7, 2, 0, 1, 7, 1, 2, 1], // _X~
    [4, 2, 1, 7, 6, 4, 4, 0], // 4
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

  const wrapStyle = { padding: 10, border: '5px solid gold', minHeight: 100 };

  const castWord = async () => {
    let canvas = document.getElementById('drawword-canvas');
    const canBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => resolve(blob));
    });
    let ipfsCanvasResult;
    try {
      ipfsCanvasResult = await props.ipfs.add(canBlob);
    } catch (e) {
      console.log('ipfs.add of blob failed: ', e);
      return;
    }
    console.log('canBlob ipfs cid: ', ipfsCanvasResult);
    let ipfsResult;
    try {
      ipfsResult = await metadataToIpfs(makeMetadata('ipfs://' + ipfsCanvasResult.path, wordName, tokenIds, rows, cols), props.ipfs);
    } catch (e) {
      console.log('ipfs.add of metadata.json failed: ', e);
      return;
    }
    console.log('castWord ipfsResult: ', ipfsResult);
    // TODO take cid and pass to contract to mint Word
    // await writeContracts.YourCollectible.castWord(mintTo, ipfsHash, );
  };

  return (
    <div style={wrapStyle}>
      <h1>WordTool</h1>
      <Input
        value={wordName}
        placeholder="Give your Word a name"
        onChange={e => {
          setWordName(e.target.value);
        }}
      />
      <Button
        style={{ margin: 8 }}
        loading={sending}
        size="large"
        shape="round"
        type="primary"
        onClick={async () => {
          setSending(true);
          await castWord();
          // console.log("minting to mintTo", mintTo);
          // await writeContracts.YourCollectible.mintItem(mintTo, ipfsHash);
          setSending(false);
        }}
      >
        Cast Word
      </Button>

      <span>Add one of your Letters: </span>
      {yourTokens ? yourTokens.map(item => (<Button key={'add-' + item.id.toString()} onClick={e => add(item.id.toNumber())} >Add #{item.id.toString()}</Button>)) : '...'}
      {tokenIds.map((id, idx) => (
        <LetterControl key={'lc-' + idx} idx={idx} delIdx={delIdx} tokenId={tokenIds[idx]} tokenDNA={tokenDNAs[idx]} setRow={(num) => setRowIdx(idx, num)} setCol={(num) => setColIdx(idx, num)} row={rows[idx]} col={cols[idx]} />
      ))}
      <DrawWord tokenIds={tokenIds} tokenDNAs={tokenDNAs} rows={rows} cols={cols} />
    </div>
  );
}

function writeLetterToGrid (grid, letterGrid, row, col) {
  // XXX setState should block bad/negative values
  row = row < 0 ? 0 : row;
  col = col < 0 ? 0 : col;
  for (let i = 0; i < letterGrid.length; i++) {
    for (let j = 0; j < letterGrid[i].length; j++) {
      let ch = letterGrid[i][j];
      if (ch == ' ' || ch == '.') {
        // skip
      } else {
        try {
          grid[row + i][col + j] = ch;
        } catch (e) {
          debugger;
        }
      }
    }
  }
}

function DrawWord ({ tokenIds, tokenDNAs, rows, cols }) {
  console.log('DrawWord: ', tokenDNAs);
  console.log(tokenIds);
  const [viewText, setViewText] = useState(false);
  const [hack1, setHack1] = useState(false);

  //const canvas = document.getElementById('drawword-canvas');
  const canvasRef = useRef(null);
  const bgCh = ' ';
  const newRow = () => [...Array(250)].map(und => bgCh);
  let grid = [...Array(80)].map(_ => newRow());

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const split2bits = (bits) => [16 * 5 * (bits & 0b110000) >> 4, 16 * 5 * (bits & 0b1100) >> 2, 16 * 5 * (bits & 0b11)];
    const ary2rgba = (ary) => 'rgba(' + ary.join(',') + ', 1)';
    const fontSize = 10;

    let ctx = canvasRef.current.getContext('2d');
    //let ctx = canvasRef.current.getContext('2d' /* weird alias effect: , { alpha: false } */);
    console.log('-------------------------');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //ctx.scale(0.5, 0.5);
    let gradient1 = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    console.log(ctx.font);
    ctx.font = `${fontSize}px/${fontSize}px P0T-NOoDLE`;
    console.log(ctx.font);
    if (!hack1) {
      setHack1(true);
      return;
    }
    if (rows.length > 1) {
      const color1 = (rows[0] * cols[0] * tokenDNAs[0].split(',')[0]) % 64;
      const color2 = rows.slice(-1) * cols.slice(-1) % 16;
      gradient1.addColorStop(0, ary2rgba(split2bits(color1)));
      gradient1.addColorStop(1, ary2rgba(split2bits(color2)));
      ctx.strokeStyle = gradient1;
    }
    console.log(grid);
    grid.forEach((row, idx) => {
      ctx.strokeText(row.join(''), 0, fontSize + idx * fontSize)
    });
  }, [hack1, grid, tokenIds, tokenDNAs, rows, cols]);

  console.log(canvasRef);
  const canvasWidth = 1000;
  const canvasHeight = 500;
  if (tokenIds.length == 0) {
    return ''; // (<canvas id='drawword-canvas' width={canvasWidth} height={canvasHeight} ></canvas>);
  }

  // tokenIds - list of tokenId (uint256)
  // tokenDNAs - list of string of numbers - subject to change to just a bitstring
  // rows
  // cols
  tokenDNAs.forEach((dna, idx) => {
    let letterGrid = newGrid();
    renderLetter(letterGrid, makeRng(dna.split(',').map(s => parseInt(s))));
    writeLetterToGrid(grid, letterGrid, rows[idx], cols[idx]);
  });

  crop(grid);
  console.log(grid);

  return (
    <div>
      <div>
        {
          viewText
            ? grid.map((row, idx) => (<pre key={'grow-' + idx} className='pre-amiga'>{row.join('')}</pre>))
            : (<Button onClick={() => setViewText(true)} >View as text</Button>)
        }
      </div>
      <div>
        <canvas ref={canvasRef} id='drawword-canvas' width={canvasWidth} height={canvasHeight} style={{ border: '4px dotted black' }} ></canvas>
      </div>
    </div>
  );

}

