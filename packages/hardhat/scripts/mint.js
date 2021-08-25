/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const delayMS = 1000 //sometimes xDAI needs a 6000ms break lol 😅

const AppConfig = require("./AppConfig.js");
const { createDeflate } = require("zlib");

const main = async () => {

  const toAddress = AppConfig.toAddress;
  const createdAt = new Date();
  const randomInt = Math.floor(Math.random() * 1000000);

  console.log("\n\n 🎫 Minting to " + toAddress + "  \n");

  const contractAddress = fs.readFileSync("./artifacts/YourCollectible.address").toString()
  // const contractAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82"

  const yourCollectible = await ethers.getContractAt(
    'YourCollectible',
    contractAddress
  )
  console.log('contractAddress', chalk.greenBright(contractAddress))
  console.log('contract', yourCollectible)

  const buffalo = {
    "description": "Bison 3.0",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/buffalo.jpg",
    "name": "Bison",
    "attributes": [
      {
        "trait_type": "BackgroundColor",
        "value": "green"
      },
      {
        "trait_type": "createdAt",
        "value": createdAt
      },
      {
        "trait_type": "Eyes",
        "value": "googly"
      },
      {
        "trait_type": "Stamina",
        "value": 42
      },
      {
        "trait_type": "randomInt",
        "value": randomInt
      }
    ]
  }

  console.log("Uploading item")
  const ipfsHash = await ipfs.add(JSON.stringify(buffalo))
  console.log('Minting item with IPFS hash', ipfsHash)
  console.log(`Minting toAddress`, chalk.greenBright(toAddress))

  // await yourCollectible.mintItem(toAddress, uploaded.path, { gasLimit: 400000 })
  // await yourCollectible.rollToMint(toAddress)

  const result = await yourCollectible.mintItem(toAddress, ipfsHash.path);
  console.log('mintResult', result)
  await sleep(delayMS)

  /*
  console.log("Minting zebra...")
  await yourCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","zebra.jpg")
  */

  //const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])



  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */


  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */


  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

};

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
