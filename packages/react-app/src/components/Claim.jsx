import React from "react";
import { Button /*, Input, Tooltip*/ } from "antd";
import { AddressInput } from ".";

// props: { writeContracts, tokenId, onClaimed } // as well as provider, accountAddress
export default function Claim (props) {
  const [sending, setSending] = React.useState();

  console.log({ writeContracts: props.writeContracts });
  const writeContracts = props.writeContracts;

  const fakePause = async () => await new Promise(resolve => setTimeout(resolve, 2000));
  const claimTokenId = async () => {
    await fakePause();
    // await writeContracts.YourCollectible.mintItem(mintTo, ipfsHash);
    console.log('fake claim of ', props.tokenId);
    props.onClaimed();
  };


  return (
    <div>
      <Button
        style={{ margin: 8 }}
        loading={sending}
        size="large"
        shape="round"
        type="primary"
        onClick={async () => {
          setSending(true);
          await claimTokenId();
          // console.log("minting to mintTo", mintTo);
          // await writeContracts.YourCollectible.mintItem(mintTo, ipfsHash);
          setSending(false);
        }}
      >
        Claim
      </Button>
    </div>
  );
}
