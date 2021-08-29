import React from "react";
import { Button, Input, Tooltip } from "antd";
// import { AddressInput } from "..";
import './letters.css'

// EXAMPLE STARTING JSON:
const STARTING_JSON = {
  description: "A Grapheme NFT Letter",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  name: "Letter",
  attributes: [
    {
      trait_type: "DNA",
      value: "",
    },
  ],
};


// props: { writeContracts, tokenId, tokenDNA, ipfs, onClaimed } // as well as provider, accountAddress
export default function Claim (props) {
  const [name, setName] = React.useState();
  const [sending, setSending] = React.useState();
  const tokenId = props.tokenId;

  const writeContracts = props.writeContracts;

  // const fakePause = async () => await new Promise(resolve => setTimeout(resolve, 2000));

  const claimTokenId = async () => {
    await props.claimTokenFunc(name);
    console.log('claimed', props.tokenId);
    onClaimed({ tokenId });
  };

  const onClaimed = async (opts) => {
    console.log('onClaimed', opts)
    // const uri = await writeContracts.YourCollectible.getTokenURI(opts.tokenId);
  }

  return (
    <div className='claim-bar'>
      <Input
        value={name}
        className='claim-input'
        placeholder="name your letter"
        onChange={e => {
          setName(e.target.value);
        }}
      />

      <Button
        style={{ margin: 8 }}
        loading={sending}
        // size="large"
        // shape="round"
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
