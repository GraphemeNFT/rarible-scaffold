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
    useContractLoader,
    useUserProvider,
} from "../../hooks";

import Claim from './Claim'
import GridCanvas from "../GridCanvas";
import ClientConfig from '../../helpers/ClientConfig'
import useStore from '../../helpers/Store'
import './letters.css'

// TODO move these up to Letters and prop drill them down?
// or into the Claim component?
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

// const targetNetwork = NETWORKS.localhost;
// const localProviderUrl = targetNetwork.rpcUrl;
// const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
// const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);


export default function OneLetter (props) {

    const { tokenId } = props
    const letter = useStore(state => state.letters.find(l => l.tokenId === tokenId))
    const [showText, setShowText] = useState(ClientConfig.showLetterText)
    const [ready, setReady] = useState(false)
    // const [injectedProvider, setInjectedProvider] = useState();
    // const userProvider = useUserProvider(injectedProvider, localProvider);

    // const address = useUserAddress(userProvider);
    // const writeContracts = props.writeContracts;

    useEffect(() => {
        console.log('OneLetter:', letter)
    }, [letter])

    useEffect(() => {
        if (letter && letter.info) {
            makeGrid(letter.info)
            setReady(true)
        }
    }, [letter])

    const letterStyle = {
        textAlign: 'left',
        fontSize: '12px',
        lineHeight: '12px',
        marginBottom: 0
    };
    const letterClass = letter?.info.isClaimed ? 'letter-item claimed' : 'letter-item unclaimed'

    // why creating two grids?
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
        return (<div className='glyph-outer' >{rows}</div>)
    };

    const copyTextToClip = () => {
        navigator.clipboard.writeText(grid.map(row => row.join('')).join('\n'));
    };

    const wordDetails = () => {
        return (
            <span className='word-details'>
                [{tokenId}] name: {letter.metadata.name} <br />
                hex: {letter.info.hex.slice(2, 10)} <br />
                dna: {letter.info.dna.join(' ')}<br />
                {/* tokenURI: {letter.tokenURI} <br /> */}
                claimed: {letter.info.isClaimed ? 'true' : 'false'} <br />
            </span>
        )
    }

    if (!ready) {
        return (<div>loading</div>)
    } else {
        return (

            <span className={letterClass} key={props.ukey}>
                {/* <span style={{ font: '10px/10px P0T-NOoDLE' }}> </span> */}
                <div className='copy-button'>
                    <Button size='small' onClick={copyTextToClip} >Copy</Button>
                </div>
                <div className='letter-inner'>

                    {ready && wordDetails()}
                    {ready && showText && asText()}

                    {letter?.info.isClaimed ?
                        <span className='claimed-info'>Claimed!</span>
                        :
                        <Claim
                            // provider={userProvider}
                            // accountAddress={address}
                            // ERC721Address={writeContracts.YourCollectible.address}
                            writeContracts={props.writeContracts}
                            ipfs={ipfs}
                            tokenId={tokenId}
                            tokenDNA={letter.info.hex}
                        />
                    }

                    {ready && <GridCanvas grid={grid} canId={'lettercan-' + tokenId} color1={0b111111} color2={0b111111} />}
                </div>
            </span>
        )
    }
}



