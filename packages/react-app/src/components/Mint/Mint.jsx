import React from "react";
import { Card, List, Button, Input, Tooltip } from "antd";
import { AddressInput } from "..";
import { getSelectedOperationName } from "graphiql";
// import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";

export default function Mint (props) {
  const [mintTo, setMintTo] = React.useState();
  const [ipfsHash, setIpfsHash] = React.useState('Qmc9hvaC9EUK7efbCfJc2QESB9NxW84jbPiTvz1p6Lh91d');
  const [tokenId, setTokenId] = React.useState(1);
  const [itemDna, setItemDna] = React.useState('-');
  const [sending, setSending] = React.useState();

  console.log({ writeContracts: props.writeContracts });
  const writeContracts = props.writeContracts;

  return (
    <div>
      <Card>

        <AddressInput
          ensProvider={props.ensProvider}
          placeholder="Recipient Address"
          value={mintTo}
          onChange={newValue => {
            setMintTo(newValue);
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
            console.log("rollToMint to:", mintTo);
            await writeContracts.YourCollectible.rollToMint(mintTo);
            setSending(false);
          }}
        >
          rollToMint
        </Button>

        {/* <Button
          style={{ margin: 8 }}
          loading={sending}
          size="large"
          shape="round"
          type="primary"
          onClick={async () => {
            setSending(true);
            const id = await writeContracts.YourCollectible.mintLetter(mintTo);
            console.log("mintLetter to:", mintTo, ' id =>', id);
            setSending(false);
          }}
        >
          mintLetter
        </Button> */}

        <hr />

        <Input
          value={ipfsHash}
          placeholder="IPFS Hash"
          onChange={e => {
            setIpfsHash(e.target.value);
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
            console.log("minting to mintTo", mintTo);
            await writeContracts.YourCollectible.mintItem(mintTo, ipfsHash);
            setSending(false);
          }}
        >
          Mint with IPFS Hash
        </Button>

      </Card>

      <Card>

        <Input
          value={tokenId}
          placeholder="token id"
          onChange={e => {
            setTokenId(e.target.value);
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
            const dna = await writeContracts.YourCollectible.getDna(tokenId);
            console.log("getDna:", tokenId, '=>', dna);
            setItemDna(dna);
            setSending(false);
          }}
        >
          getDna
        </Button>
        <div className='debug-field'>
          <pre>
            itemDna: {JSON.stringify(itemDna, null, 2)}
          </pre>
        </div>

      </Card>

    </div>
  );
}
