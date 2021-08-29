import React, { useEffect } from "react";
import { Card, List, Button, Input, Tooltip } from "antd";
import { AddressInput } from "..";
import { getSelectedOperationName } from "graphiql";
// import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";

import useStore from "../../helpers/Store";

export default function Mint (props) {
  const wallet = useStore(state => state.wallet);

  const [mintTo, setMintTo] = React.useState(wallet);
  const [ipfsHash, setIpfsHash] = React.useState('Qmc9hvaC9EUK7efbCfJc2QESB9NxW84jbPiTvz1p6Lh91d');
  const [tokenId, setTokenId] = React.useState(1);
  const [itemDna, setItemDna] = React.useState('-');
  const [sending, setSending] = React.useState();

  // console.log({ writeContracts: props.writeContracts });
  const writeContracts = props.writeContracts;

  useEffect(() => {
    setMintTo(wallet)
  }, [wallet])

  return (
    <div>
      <Card>

        <AddressInput
          ensProvider={props.ensProvider}
          placeholder="Recipient Wallet Address"
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

      </Card>

    </div>
  );
}
