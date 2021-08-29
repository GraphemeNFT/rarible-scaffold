// some mint code that's not user
<Button
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
        </Button>

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

      </Card >

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