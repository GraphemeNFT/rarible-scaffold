
import React, { useState, useEffect, useRef } from "react";
import { Button, Input } from "antd";
import "../App.css";
import GridCanvas from "./GridCanvas";

import { useStore } from '../helpers/Store'

const grapheme = require("./Letters/grapheme").default;

// EXAMPLE STARTING JSON:
const STARTING_JSON = {
  description: "A Grapheme NFT Word",
  external_url: "https://graphemenft.github.io/", // <-- this can link to a page for the specific file too
  image: "https://graphemenft.github.io/logo-image.png",
  name: "Grapheme",
  attributes: [
  ],
};

function makeMetadata (letters, imageCid, name, tokenIds, rows, cols) {
  let metadata = Object.assign({}, STARTING_JSON);
  metadata.name = name;
  metadata.image = imageCid;
  metadata.graphemeSrc = { tokenIds, rows, cols };
  // metadata.isPrimitive = false;
  metadata.attributes = [{
    trait_type: "Type",
    value: "Word",
  },
  {
    trait_type: "Total Letters",
    value: tokenIds.length.toString(),
  }];

  for (let i = 0; i < tokenIds.length; i++) {
    let letterName = letters?.find(l => l?.id === tokenIds[i])?.metadata?.name;
    if (letterName) {
      metadata.attributes.push({ trait_type: "Letter " + i, value: letterName });
    }
    // metadata.attributes.push({ trait_type: "tokenId_" + i, value: tokenIds[i] });
    // metadata.attributes.push({ trait_type: "row_" + i, value: rows[i] });
    // metadata.attributes.push({ trait_type: "col_" + i, value: cols[i] });
  }
  return metadata;
}

async function metadataToIpfs (metadata, ipfs) {
  const result = await ipfs.add(JSON.stringify(metadata));
  return result;
}

function LetterControl (props) {
  return (
    <div className='info-group'>

      <Button
        onClick={e => {
          props.delIdx(props.idx);
        }}
      >X (del)
      </Button>
      <Input className='info-label' value={props.tokenId} disabled />
      <Input className='info-label' value={props.col} disabled />
      <Input className='info-label' value={props.row} disabled />

      {/* {props.tokenDNA} */}
      <Button
        onClick={e => {
          props.setCol(props.col - 1);
        }}
      >LEFT</Button>

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
    </div>
  )
}


// const fakeDNAs = [
//   [4, 1, 0, 6, 6, 7, 2, 5], // n
//   [7, 2, 0, 6, 2, 7, 0, 4], // P
//   [3, 5, 3, 6, 0, 5, 0, 0], // B
//   [2, 3, 1, 6, 0, 7, 3, 5], // ~A
//   [7, 5, 7, 4, 7, 4, 4, 0], // _M
//   [7, 2, 0, 1, 7, 1, 2, 1], // _X~
//   [4, 2, 1, 7, 6, 4, 4, 0], // 4
// ];


export default function DrawWordTool (props) {
  // const yourTokens = props.yourTokens ? props.yourTokens : [];

  const wallet = useStore(state => state.wallet);
  const letters = useStore(state => state.letters);
  // const claimedLetters = useStore(state => state.claimedLetters);
  const claimedLetters = letters.filter(l => l.info.isPrimitive && l.info.isClaimed)

  const [wordName, setWordName] = useState('');
  const [sending, setSending] = useState();
  const [rows, setRows] = useState([]); //useState([1, 4, 2]);
  const [cols, setCols] = useState([]); //useState([10, 20, 80]);
  const setColIdx = (idx, num) => { let cpy = [...cols]; cpy[idx] = num; setCols(cpy); };
  const setRowIdx = (idx, num) => { let cpy = [...rows]; cpy[idx] = num; setRows(cpy); };
  const [tokenIds, setTokenIds] = useState([]); //[0, 1, 2];
  const [tokenDNAs, setTokenDNAs] = useState([]);

  // const realDNAs = claimedLetters ? claimedLetters.map(l => l.info.dna) : [];
  const realDNAs = letters ? letters.map(l => l.info.dna) : [];

  const add = (tokenId, index) => {
    console.log('adding', tokenId, index);
    setRows([...rows].concat([1]));
    setCols([...cols].concat([1]));
    setTokenDNAs([...tokenDNAs].concat([realDNAs[index].join(',')]));
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
    // let canvas = document.getElementById('drawword-canvas');
    let canvas = document.querySelector('canvas')
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
    let tokenURI
    try {
      let ipfsGateway = 'https://ipfs.io/ipfs/';
      tokenURI = await metadataToIpfs(makeMetadata(letters, ipfsGateway + ipfsCanvasResult.path, wordName, tokenIds, rows, cols), props.ipfs);
    } catch (e) {
      console.log('ipfs.add of metadata.json failed: ', e);
      return;
    }
    console.log('castWord ipfsResult: ', tokenURI);

    // TODO take cid and pass to contract to mint Word
    // function mintWord (
    //   address payable to,
    //   string memory tokenURI,
    //   uint256[] memory tokenIds,
    //   uint256[] memory rows,
    //   uint256[] memory cols

    await props.writeContracts.YourCollectible.mintWord(wallet, tokenURI.path, tokenIds, rows, cols);
  };

  const letterTray = () => {

    const trayItems = claimedLetters.map(item => {
      return (
        <Button key={'add-' + item.index} onClick={e => add(item.id, item.index)} >
          {item.id} {item.metadata?.name}
        </Button>
      )
    })

    return (
      <div>
        < span > Add Letters: </span>
        {trayItems}
      </div>
    )

  }

  return (
    <div style={wrapStyle}>
      <h1>WordTool</h1>

      <div className='info-group'>
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
      </div>

      <div className='info-group'>
        {claimedLetters && letterTray()}
      </div>

      {tokenIds.map((id, idx) => (
        <LetterControl key={'lc-' + idx} idx={idx} delIdx={delIdx} tokenId={tokenIds[idx]} tokenDNA={tokenDNAs[idx]}
          setRow={
            (num) => setRowIdx(idx, num)} setCol={(num) => setColIdx(idx, num)} row={rows[idx]} col={cols[idx]}
        />
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
  // console.log('DrawWord: ', tokenDNAs, tokenIds);
  const [viewText, setViewText] = useState(false);

  const bgCh = ' ';
  const newRow = () => [...Array(250)].map(und => bgCh);
  let grid = [...Array(80)].map(_ => newRow());
  const color1 = tokenIds.length ? (rows[0] * cols[0] * tokenDNAs[0].split(',')[0]) % 64 : 0;
  const color2 = tokenIds.length ? rows.slice(-1) * cols.slice(-1) % 16 : 0;
  if (tokenIds.length == 0) {
    return '';
  }

  // tokenIds - list of tokenId (uint256)
  // tokenDNAs - list of string of numbers - subject to change to just a bitstring
  // rows
  // cols
  tokenDNAs.forEach((dna, idx) => {
    let letterGrid = grapheme.newGrid();
    grapheme.renderLetter(letterGrid, grapheme.makeRng(dna.split(',').map(s => parseInt(s))));
    writeLetterToGrid(grid, letterGrid, rows[idx], cols[idx]);
  });

  grapheme.crop(grid);
  // console.log('grid', grid);

  return (
    <div>
      <span className='preload-font-hack' style={{ font: '10px/10px P0T-NOoDLE' }}> </span>
      <div>
        {
          viewText
            ? grid.map((row, idx) => (<pre key={'grow-' + idx} className='pre-amiga'>{row.join('')}</pre>))
            : (<Button onClick={() => setViewText(true)} >View as text</Button>)
        }
      </div>
      <div>
        <GridCanvas grid={grid} canid='drawword-canvas' color1={color1} color2={color2} />
      </div>
    </div>
  );

}

