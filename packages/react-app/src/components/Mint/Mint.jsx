import React from "react";
import { Card, List, Button, Input, Tooltip } from "antd";
import { AddressInput } from "..";
import { getSelectedOperationName } from "graphiql";
// import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";

export default function Mint (props) {
  const [mintTo, setMintTo] = React.useState();
  const [ipfsHash, setIpfsHash] = React.useState();
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
          Mint
        </Button>

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
            const dna = await writeContracts.YourCollectible.getDNA(tokenId);
            console.log("getDNA:", tokenId, '=>', dna);
            setItemDna(dna);
            setSending(false);
          }}
        >
          getDNA
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
