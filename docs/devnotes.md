## DevNotes

start 3 shells:
```
yarn chain # start local chain
yarn start # start local dev server for front-end
```

# Initial setup

fund deployer wallet address

 `make fund-deployer`

## client wallet address

generate IPFS hash eg Qmc9hvaC9EUK7efbCfJc2QESB9NxW84jbPiTvz1p6Lh91d

- wallet address to mint to with `yarn mint`

add your metamask (on localhost) wallet address to
need to add this to a script as it cannot access metamask
[here](../packages/hardhat/scripts/AppConfig.js)


# update contract

## edit contract and deploy

[edit contract SOL](../packages/hardhat/contracts/YourCollectible.sol)

```
yarn deploy
```
then get contract address eg:
0xfBeab5c1de66515877A51e6aAB22f8F33861e65F
0xc5a5C42992dECbae36851359345FE25997F5C42d
0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E

server side minting will pick up the Contract address from 
[./artifacts/YourCollectible.address](../packages/hardhat/artifacts/YourCollectible.address)

but this is different from the *deployed* contract address

## update client side contract address

- ERC721 YourCollectible contract address for react client

[edit](../packages/react-app/src/contracts/YourCollectible.address.js)

publish contract metadata/ABI for the front-end

`make publish`



## server side minting

`yarn mint`



# later for OpenSea

- tell opensea about the contract
https://testnets.opensea.io/get-listed/step-two


// 0x4903Ddf96851ee0757b84B790cd04618112E00D1
https://ropsten.rarible.com/token/0x66f806bf40bfa98f2dac85a85d437895043f2be5:1?tab=owners


## Questions

- updating contract changes its address each time?

- have to update ABI when modifying contract?
- IPFS address needed to mint?
- how to get IPFS hash?



## Changelist

- moved config to scripts/AppConfig.js



## other contracts



## Typical problems

- nonce too high
reset your wallet
https://dev.to/nmassi/comment/1dafo

