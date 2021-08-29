import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";

import React, { useEffect, useState } from "react"; // useCallback, useEffect, useState

import { useUserAddress } from "eth-hooks";
import { DAI_ABI, DAI_ADDRESS, INFURA_ID, NETWORK, NETWORKS } from "../../constants";
import { newGrid, makeRng, renderLetter } from "./grapheme";


import {
//     List,
//     // Alert, Button, Card, Col, Input,
  Button
//     // Menu, Row
} from "antd";

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
} from "../../hooks";

import Claim from './Claim'
import GraphUtils from '../../helpers/GraphUtils'
import LetterUtils from './LetterUtils'
import GridCanvas from "../GridCanvas";

import './letters.css'
import { getArgumentValues } from "graphql/execution/values";

// TODO move these up to Letters and prop drill them down?
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });
const targetNetwork = NETWORKS.localhost;
const localProviderUrl = targetNetwork.rpcUrl;
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);


export default function OneLetter (props) {
    // console.log('oneLetter.props', props.item)
    // const [dna, setDna] = useState({ hex: '0x', num: 0 })
    // const [itemHex, setItemHex] = useState()
    const [metadata, setMetadata] = useState({})
    const [itemSig, setItemSig] = useState({})
    const [ready, setReady] = useState(false)
    // const [itemDna, setItemDna] = useState([]) // P
    const [tokenURI, setTokenURI] = useState('')
    const [claimed, setClaimed] = useState(false)
    const [injectedProvider, setInjectedProvider] = useState();
    const userProvider = useUserProvider(injectedProvider, localProvider);
    // const [info, setInfo] = useState({})
    const graphemeContract = props.readContracts.YourCollectible

    // const [fakeClaimed, setFakeClaimed] = useState([]);

    const address = useUserAddress(userProvider);
    const writeContracts = useContractLoader(userProvider);
    const { item } = props
    const tokenId = item.id.toNumber()

    useEffect(() => {
        if (tokenId) {
            graphemeContract.tokenURI(tokenId).then(uri => {
                console.log('uri', uri)
                setTokenURI(uri)
            })

            graphemeContract.getInfo(tokenId)
                .then((infoRes) => {
                    // returns an array of dna, isClaimed
                    const [dnaObj, isClaimed] = infoRes
                    const hex = dnaObj.toHexString()
                    const sig = GraphUtils.calcDna(hex)
                    setItemSig(sig)
                    setClaimed(isClaimed)
                    makeGrid(sig)
                    setReady(true)
                })
        }

        // call async method immediately
        const getMeta = async () => {
            await LetterUtils.getMetadata(tokenId, graphemeContract, setMetadata)
        }
        getMeta()

    }, [tokenId])

    const letterStyle = {
        fontFamily: 'monospace',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '12px',
        letterSpacing: '-2px',
        marginBottom: 0
    };
    const letterClass = claimed ? 'letter-item claimed' : 'letter-item unclaimed'

    const [grid, setGrid] = useState(newGrid());
    const makeGrid = (newSig) => {
      console.log(newSig);
        if (tokenId == 1) {
            // debugger
            console.log('make', tokenId, newSig)
        }
        if ('dna' in newSig) {
          const cloneDna = [...newSig.dna]
          const _grid = newGrid(); // mem leak?
          renderLetter(_grid, makeRng(cloneDna));
          setGrid(_grid);
        }
        // return grid;//.map(row => row.join('') ).join('<br />');
    };
    const asText = () => {
        const key = 'row-' + tokenId
        const rows = grid.map((row, idx) => (<pre key={"pre-" + key + idx} style={letterStyle}>{row.join('')}</pre>))
        return (< div className='glyph-outer' >{rows}</div>)
    };
    const copyTextToClip = () => {
      navigator.clipboard.writeText(grid.map(row => row.join('')).join('\n'));
    };

    const wordDetails = () => {
        return (
            <span className='word-details'>
                [{tokenId}] name: {metadata.name} <br />
                hex: {itemSig.hex.slice(2, 10)} <br />
                dna: {itemSig.dna.join(' ')}<br />
                tokenURI: {tokenURI} <br />
                claimed: {claimed ? 'true' : 'false'} <br />
            </span>
        )
    }
    const [showText, setShowText] = useState(false);

    return (

        <span className={letterClass} key={props.ukey}>
            <span style={{font: '10px/10px P0T-NOoDLE'}}> </span>
            <div className='letter-inner'>

                {ready && wordDetails()}
                {ready && showText && asText()}
                <div style={{marginTop: 100}}>
                  <Button onClick={copyTextToClip} >Copy text to clipboard</Button>
                </div>

                <div className='claim-box'>
                    {claimed ?
                        <div>Claimed!</div>
                        :
                        <Claim
                            provider={userProvider}
                            accountAddress={address}
                            // ERC721Address={writeContracts.YourCollectible.address}
                            writeContracts={writeContracts}
                            ipfs={ipfs}
                            tokenId={tokenId}
                            tokenDNA={itemSig.hex}
                        />
                    }
                </div>
                {ready && <GridCanvas grid={grid} canId={'lettercan-' + tokenId} color1={0b111111} color2={0b111111} />}
            </div>
        </span>
    )
}



