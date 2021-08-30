/*
  this isn't used any more
**/

import React, { useState } from "react";
import { Button, Input, Tooltip } from "antd";
import { AddressInput } from ".";

const grapheme = require("./Letters/grapheme");


export default function Mint (props) {
  const [mintTo, setMintTo] = useState();
  //const [ipfsHash, setIpfsHash] = React.useState();
  const [sending, setSending] = useState();
  const [rolledTokenIds, setRolledTokenIds] = useState([]);
  const [rolledTokenDNAs, setRolledTokenDNAs] = useState([]);

  console.log({ writeContracts: props.writeContracts });
  const writeContracts = props.writeContracts;

  const fakeDNAs = [
    [4, 1, 0, 6, 6, 7, 2, 5], // n
    [7, 2, 0, 6, 2, 7, 0, 4], // P
    [3, 5, 3, 6, 0, 5, 0, 0], // B
    [2, 3, 1, 6, 0, 7, 3, 5], // ~A
    [7, 5, 7, 4, 7, 4, 4, 0], // _M
    [7, 2, 0, 1, 7, 1, 2, 1], // _X~
    [4, 2, 1, 7, 6, 4, 4, 0], // 4
  ];

  const fakeGetDNA = async (tokenId) => {
    console.log('fake fetching DNA by tokenId ', tokenId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return fakeDNAs[tokenId];
  };
  const fakeRoll = async () => {
    console.log('fakeRoll some letters');
    console.log('wait for fake Roll event to be emitted...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    let fakeRolledTokenIds = [1, 2, 3];
    setRolledTokenIds(fakeRolledTokenIds);
    let fakeRolledTokenDNAs = await Promise.all(fakeRolledTokenIds.map(async (tokenId) => {
      return dnaStr(await fakeGetDNA(tokenId));
    }));
    console.log(fakeRolledTokenDNAs);
    setRolledTokenDNAs(fakeRolledTokenDNAs);
    return fakeRolledTokenDNAs;
  };

  const dnaStr = (dna) => dna.join(',');
  const dnaAry = (str) => str.split(',').map(s => parseInt(s));
  const makeLetter = (dna) => {
    console.log('----------------------', dna);
    let grid = grapheme.newGrid();
    grapheme.renderLetter(grid, grapheme.makeRng(dna));
    return grid;//.map(row => row.join('') ).join('<br />');
  };
  const letterStyle = { fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold', fontSize: '16px', lineHeight: '16px', letterSpacing: '-2px', marginBottom: 0 };



  console.log(rolledTokenDNAs);

  return (
    <div>
      <div><span>{rolledTokenIds.length == 0 ? '' : 'You rolled these tokenIds: ' + rolledTokenIds.join(', ')}</span></div>
      <div><span>{rolledTokenDNAs.length == 0 ? '' : 'You rolled these tokenDNAs: [' + rolledTokenDNAs.join('], [') + ']'}</span></div>
      <div>{rolledTokenDNAs.map((dna, idx) => (
        <div key={'rolled-' + idx}>
          {makeLetter(dnaAry(dna)).map(row => (<pre style={letterStyle}>{row.join('')}</pre>))}
        </div>
      ))}</div>


      <AddressInput
        ensProvider={props.ensProvider}
        placeholder="Recipient Address"
        value={mintTo}
        onChange={newValue => {
          setMintTo(newValue);
        }}
      />
      {/*
      <Input
        value={ipfsHash}
        placeholder="IPFS Hash"
        onChange={e => {
          setIpfsHash(e.target.value);
        }}
      />
      */}
      <Button
        style={{ margin: 8 }}
        loading={sending}
        size="large"
        shape="round"
        type="primary"
        onClick={async () => {
          setSending(true);
          console.log("minting to mintTo", mintTo);
          let tokenDNAs = await fakeRoll();
          //await writeContracts.YourCollectible.mintItem(mintTo, ipfsHash);
          setSending(false);
        }}
      >
        Roll Some Letters
      </Button>
    </div>
  );
}
