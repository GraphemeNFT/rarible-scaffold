
<div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
    <List
        bordered
        dataSource={yourCollectibles}
        renderItem={item => {
            const id = item.id.toNumber();
            // const key = id + "_" + item.tokenURI + "_" + item.owner
            // FIXME - these vars are not defined
            const key = `item-${id}-${counter()}`;
            // console.log('key:', key)
            return (
                <List.Item key={key}>
                    <Card
                        title={
                            <div key={'d1' + id}>
                                <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                            </div>
                        }
                    >
                        <div key={'d2' + id}>
                            <img src={item.image} style={{ maxWidth: 150 }} />
                        </div>
                        <div key={'d3' + id}>{item.description}</div>
                        <div key={'d4' + id}>
                            {makeLetter(fakeDNAs[id]).map((row, idx) => (<pre key={key + idx} style={letterStyle}>{row.join('')}</pre>))}
                        </div>
                    </Card>

                    <div>
                        owner:{" "}
                        <Address
                            address={item.owner}
                            ensProvider={mainnetProvider}
                            blockExplorer={blockExplorer}
                            fontSize={16}
                        />
                        <AddressInput
                            ensProvider={mainnetProvider}
                            placeholder="transfer to address"
                            value={transferToAddresses[id]}
                            onChange={newValue => {
                                const update = {};
                                update[id] = newValue;
                                setTransferToAddresses({ ...transferToAddresses, ...update });
                            }}
                        />
                        <Button
                            onClick={() => {
                                console.log("writeContracts", writeContracts);
                                tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
                            }}
                        >
                            Transfer
                        </Button>
                        <AddressInput
                            ensProvider={mainnetProvider}
                            placeholder="approve address"
                            value={approveAddresses[id]}
                            onChange={newValue => {
                                const update = {};
                                update[id] = newValue;
                                setApproveAddresses({ ...approveAddresses, ...update });
                            }}
                        />
                        <Button
                            onClick={() => {
                                console.log("writeContracts", writeContracts);
                                tx(writeContracts.YourCollectible.approve(approveAddresses[id], id));
                            }}
                        >
                            Approve
                        </Button>
                        <Sell
                            provider={userProvider}
                            accountAddress={address}
                            ERC721Address={writeContracts.YourCollectible.address}
                            tokenId={id}
                        />
                        {fakeClaimed.indexOf(id) != -1 ? 'Claimed Already!' : (
                            <Claim
                                provider={userProvider}
                                accountAddress={address}
                                // ERC721Address={writeContracts.YourCollectible.address}
                                writeContracts={writeContracts}
                                ipfs={ipfs}
                                tokenId={id}
                                tokenDNA={'TODO'}
                                onClaimed={() => { setFakeClaimed(fakeClaimed.concat([id])); console.log('YOU CLAIMED token ', id); }}
                            />
                        )}
                    </div>
                </List.Item>
            );
        }}
    />
</div>