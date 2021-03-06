import React, { useCallback, useEffect, useState } from "react";
import ReactJson from "react-json-view";

import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";

import { useStore } from "./helpers/Store";

// main components
import {
  Account,
  Address,
  AddressInput,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  // Sell,
  // Mint,

  RollMint,
  // LazyMint,
  // RaribleItemIndexer,
  DrawWordTool,
} from "./components";

import Letters from "./components/Letters/Letters";
import ClientConfig from "./helpers/ClientConfig";
import Mint from './components/Mint/Mint'
import LetterGrid from './components/Letters/LetterGrid'
// import Claim from './components/Letters/Claim'

import { DAI_ABI, DAI_ADDRESS, INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useExternalContractLoader,
  useGasPrice,
  useOnBlock,
  useUserProvider,
} from "./hooks";
// import { matchSellOrder, prepareMatchingOrder } from "./rarible/createOrders";

import "./App.css";
import LetterUtils from "./components/Letters/LetterUtils";

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require("ipfs-http-client");

const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
//  select your target frontend network (localhost, rinkeby, xdai, mainnet)
// const targetNetwork = NETWORKS.localhost;
const targetNetwork = NETWORKS.ropsten;

// 😬 Sorry for all the console logging
const DEBUG = (ClientConfig.logLevel > 2) ? true : false;

let ipfsGateway = 'https://ipfs.io/ipfs/';
// EXAMPLE STARTING JSON:
const STARTING_JSON = {
  description: "Grapheme NFT Letter",
  external_url: "https://graphemenft.github.io/", // <-- this can link to a page for the specific file too
  image: ipfsGateway + 'QmSygLmdfeStPU7TTCTbazvrUCggtGh5aNEK6cLarWZVsX',
  name: "Grapheme",
  attributes: [
    {
      trait_type: "Claim Status",
      value: "Unclaimed",
    },
    {
      trait_type: "Tags",
      value: "No Tag Yet. Claim and add",
    },
  ],
};

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path);
    if (!file.content) continue;
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }
    console.log(content);
    return content;
  }
};

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = null; // new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function App (props) {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;


  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  // const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);

  // If you want to call a function on a new block
  // useOnBlock(mainnetProvider, () => {
  // });

  // Then read your DAI balance like:
  // const myMainnetDAIBalance = useContractReader({ DAI: mainnetDAIContract }, "DAI", "balanceOf", [
  //  "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  // ]);

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "YourCollectible", "balanceOf", [address]);
  // 📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "YourCollectible", "Transfer", localProvider, 1);
  if (DEBUG) {
    console.groupCollapsed(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
    console.log("🤗 balance:", balance);
    console.log("📟 Transfer events:", transferEvents);
    console.groupEnd()
  }

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const yourBalance = balance && balance.toNumber && balance.toNumber();
  // const [yourCollectibles, setYourCollectibles] = useState();

  // zustand Store stuff
  const setWallet = useStore(state => state.setWallet);
  const setBalance = useStore(state => state.setBalance);
  const setLetters = useStore(state => state.setLetters);
  const letters = useStore(state => state.letters);
  const setContractAddress = useStore(state => state.setContractAddress);
  const contractAddress = useStore(state => state.contractAddress);
  const raribleHome = useStore(state => state.raribleHome);
  const setRaribleHome = useStore(state => state.setRaribleHome);
  const setRaribleTokenAddress = useStore(state => state.setRaribleTokenAddress);

  // get minimal info on token on update
  // more details are pulled on letters page as needed
  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        const graphemeContract = readContracts.YourCollectible  // inside or it will run b4 we have contract
        console.group('updateYourCollectibles: ', tokenIndex)
        try {
          // console.log("toeknIndex:", tokenIndex);
          await graphemeContract.tokenOfOwnerByIndex(address, tokenIndex).then(ownerToken => {
            // console.log("ownerToken:", ownerToken);
            const tokenId = ownerToken.toNumber();
            // const metadata = await LetterUtils.getMetadata(tokenId, graphemeContract);
            // const tokenURI = await graphemeContract.tokenURI(tokenId)
            // const info = await LetterUtils.getInfo(tokenId, graphemeContract);

            var metadata = LetterUtils.getMetadata(tokenId, graphemeContract);
            var tokenURI = graphemeContract.tokenURI(tokenId)
            var info = LetterUtils.getInfo(tokenId, graphemeContract);

            Promise.all([metadata, tokenURI, info]).then(values => {
              [metadata, tokenURI, info] = values;
              const letter = {
                index: tokenIndex,
                id: tokenId,
                owner: address,
                tokenId,
                // ownerToken,
                metadata,
                tokenURI,
                info
              };
              // console.log('letter', letter)
              collectibleUpdate.push(letter)
              // FIXME
              // update ALL on each refresh - causes a backlog of redrawing all
              // need a way to just selectively add each letter as a skeleton then render insides when 'done'
              // setLetters(collectibleUpdate);
            });
          });

        } catch (e) {
          console.log('updateCollectibles error', e);
        }

        console.groupEnd()
      }
      // this should not be needed since we do it above
      setLetters(collectibleUpdate);
    };
    updateYourCollectibles();
  }, [address, yourBalance]);

  // make users wallet available to store
  useEffect(() => {
    const localWallet = address.replace(/^0x/, '');
    setWallet(localWallet)
    setBalance(balance)
  }, [address, balance]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts // &&
      // mainnetDAIContract
    ) {
      console.groupCollapsed("____ 🏗 scaffold-eth ____________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      // console.log("🌍 DAI contract on mainnet:", mainnetDAIContract);
      console.log("🔐 writeContracts", writeContracts);
      console.groupEnd();
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    // mainnetDAIContract,
  ]);

  let networkDisplay = "";
  if (localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <b>{networkLocal && networkLocal.name}</b>.
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name == "localhost";

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId == 31337 &&
    yourLocalBalance &&
    formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  const [yourJSON, setYourJSON] = useState(STARTING_JSON);
  const [sending, setSending] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ipfsDownHash, setIpfsDownHash] = useState();
  // const [collectionContract, setCollectionContract] = useState();
  const [tokenId, setTokenId] = useState();

  const [downloading, setDownloading] = useState();
  const [ipfsContent, setIpfsContent] = useState();

  // const [sellOrderContent, setSellOrderContent] = useState();

  // const [transferToAddresses, setTransferToAddresses] = useState({});
  // const [approveAddresses, setApproveAddresses] = useState({});

  useEffect(() => {
    if (readContracts) {
      let contract = readContracts.YourCollectible;
      setContractAddress(contract.addresss)
      const _raribleHome = `https://ropsten.rarible.com/collection/${contract.address}`
      const _raribleTokenAddress = `https://ropsten.rarible.com/token/${contractAddress}`
      setRaribleHome(_raribleHome)
      setRaribleTokenAddress(_raribleTokenAddress)
      console.log('contract.address', contract.address)
    }
  }, [readContracts]);

  // const  = useContractLoader(provider);

  return (
    <div className="App">
      <span id='force-noodle' style={{ font: '10px/10px P0T-NOoDLE' }}> </span>

      <Header />
      {networkDisplay}
      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">

          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              About
            </Link>
          </Menu.Item>

          <Menu.Item key="/letters">
            <Link
              onClick={() => {
                setRoute("/letters");
              }}
              to="/letters"
            >
              Letters
            </Link>
          </Menu.Item>

          <Menu.Item key="/words">
            <Link
              onClick={() => {
                setRoute("/words");
              }}
              to="/words"
            >
              Words
            </Link>
          </Menu.Item>

          <Menu.Item key="/mint">
            <Link
              onClick={() => {
                setRoute("/mint");
              }}
              to="/mint"
            >
              Mint
            </Link>
          </Menu.Item>

          {/*
          <Menu.Item key="/lazyMint">
            <Link
              onClick={() => {
                setRoute("/lazyMint");
              }}
              to="/lazyMint"
            >
              Lazy Mint
            </Link>
          </Menu.Item>

          <Menu.Item key="/raribleItemIndexer">
            <Link
              onClick={() => {
                setRoute("/raribleItemIndexer");
              }}
              to="/raribleItemIndexer"
            >
              Item Indexer
            </Link>
          </Menu.Item>

          <Menu.Item key="/rarible">
            <Link
              onClick={() => {
                setRoute("/rarible");
              }}
              to="/rarible"
            >
              Order Indexer
            </Link>
          </Menu.Item>
          */}

          <Menu.Item key="/transfers">
            <Link
              onClick={() => {
                setRoute("/transfers");
              }}
              to="/transfers"
            >
              Transfers
            </Link>
          </Menu.Item>

          <Menu.Item key="/ipfsup">
            <Link
              onClick={() => {
                setRoute("/ipfsup");
              }}
              to="/ipfsup"
            >
              IPFS up
            </Link>
          </Menu.Item>

          <Menu.Item key="/ipfsdown">
            <Link
              onClick={() => {
                setRoute("/ipfsdown");
              }}
              to="/ipfsdown"
            >
              IPFS down
            </Link>
          </Menu.Item>

          <Menu.Item key="/contract">
            <Link
              onClick={() => {
                setRoute("/contract");
              }}
              to="/contract"
            >
              YC Contract
            </Link>
          </Menu.Item>

          <Menu.Item key="/debugcontracts">
            <Link
              onClick={() => {
                setRoute("/debugcontracts");
              }}
              to="/debugcontracts"
            >
              Debug Contracts
            </Link>
          </Menu.Item>

        </Menu>

        <Switch>

          <Route exact path="/">

            <div className='main-menu'>
              <ol>
                <li>
                  <Link to="/letters"
                    onClick={() => { setRoute("/letters"); }}
                  >Mint and then claim some letters</Link>
                </li>
                <li>
                  <Link to="/words"
                    onClick={() => { setRoute("/words"); }}
                  >Make words from Letters and Mint the word!</Link>
                </li>
                <li>
                  <a href={raribleHome} target="_blank" rel="noopener noreferrer">
                    View and Trade the Collection on <img className='tiny-icon' src='rarible-icon.jpg' /> RARIBLE!
                  </a>
                </li>
              </ol>


            </div>

          </Route>

          <Route path="/letters">
            <Letters
              // dataSource={yourCollectibles}
              ensProvider={mainnetProvider}
              provider={userProvider}
              writeContracts={writeContracts}
              readContracts={readContracts}
            />
          </Route>

          <Route path="/words">

            <DrawWordTool yourTokens={letters} ipfs={ipfs} writeContracts={writeContracts} readContracts={readContracts} />
            <LetterGrid letters={letters} />

          </Route>

          <Route path="/mint">
            <div style={{ paddingTop: 32, width: 740, margin: "auto" }}>
              {/* <RollMint ensProvider={mainnetProvider} provider={userProvider} writeContracts={writeContracts} /> */}
              <Mint ensProvider={mainnetProvider} provider={userProvider} writeContracts={writeContracts} />
            </div>
          </Route>

          <Route path="/transfers">
            <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={transferEvents}
                renderItem={item => {
                  return (
                    <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item[2].toNumber()}>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{item[2].toNumber()}</span>
                      <Address address={item[0]} ensProvider={mainnetProvider} fontSize={16} /> =&gt;
                      <Address address={item[1]} ensProvider={mainnetProvider} fontSize={16} />
                    </List.Item>
                  );
                }}
              />
            </div>
          </Route>

          <Route path="/ipfsup">
            <div style={{ paddingTop: 32, width: 740, margin: "auto", textAlign: "left" }}>
              <ReactJson
                style={{ padding: 8 }}
                src={yourJSON}
                theme="pop"
                enableClipboard={false}
                onEdit={(edit, a) => {
                  setYourJSON(edit.updated_src);
                }}
                onAdd={(add, a) => {
                  setYourJSON(add.updated_src);
                }}
                onDelete={(del, a) => {
                  setYourJSON(del.updated_src);
                }}
              />
            </div>

            <Button
              style={{ margin: 8 }}
              loading={sending}
              size="large"
              shape="round"
              type="primary"
              onClick={async () => {
                console.log("UPLOADING...", yourJSON);
                setSending(true);
                setIpfsHash();
                const result = await ipfs.add(JSON.stringify(yourJSON)); // addToIPFS(JSON.stringify(yourJSON))
                if (result && result.path) {
                  setIpfsHash(result.path);
                }
                setSending(false);
                console.log("RESULT:", result);
              }}
            >
              Upload to IPFS
            </Button>

            <div style={{ padding: 16, paddingBottom: 150 }}>{ipfsHash}</div>
          </Route>

          <Route path="/ipfsdown">
            <div style={{ paddingTop: 32, width: 740, margin: "auto" }}>
              <Input
                value={ipfsDownHash}
                placeholder="IPFS hash (like QmadqNw8zkdrrwdtPFK1pLi8PPxmkQ4pDJXY8ozHtz6tZq)"
                onChange={e => {
                  setIpfsDownHash(e.target.value);
                }}
              />
            </div>
            <Button
              style={{ margin: 8 }}
              loading={downloading}
              size="large"
              shape="round"
              type="primary"
              onClick={async () => {
                console.log("DOWNLOADING...", ipfsDownHash);
                setDownloading(true);
                setIpfsContent();
                const result = await getFromIPFS(ipfsDownHash); // addToIPFS(JSON.stringify(yourJSON))
                if (result && result.toString) {
                  setIpfsContent(result.toString());
                }
                setDownloading(false);
              }}
            >
              Download from IPFS
            </Button>

            <div
              className='debug-field'
            >{ipfsContent}</div>
          </Route>

          <Route path="/contract">
            <Contract
              name="YourCollectible"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>

        </Switch>
      </BrowserRouter>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

/* eslint-disable */
window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", accounts => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */

export default App;
