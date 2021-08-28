import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";

import React, { useEffect, useState } from "react"; // useCallback, useEffect, useState

import { useUserAddress } from "eth-hooks";
import { DAI_ABI, DAI_ADDRESS, INFURA_ID, NETWORK, NETWORKS } from "../../constants";
import { newGrid, makeRng, renderLetter } from "./grapheme";


// import {
//     List,
//     // Alert, Button, Card, Col, Input,
//     // Menu, Row
// } from "antd";

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

import './letters.css'

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
    const [hex, setHex] = useState('0x')
    const [itemDna, setItemDna] = useState([7, 2, 0, 6, 2, 7, 0, 4]) // P
    // const [bigInt, setBigInt] = useState('10101')
    const [claimed, setClaimed] = useState(false)
    const [tokenURI, setTokenURI] = useState('')
    const [injectedProvider, setInjectedProvider] = useState();
    const userProvider = useUserProvider(injectedProvider, localProvider);
    const [info, setInfo] = useState({})
    const graphemeContract = props.readContracts.YourCollectible

    // const [fakeClaimed, setFakeClaimed] = useState([]);

    const address = useUserAddress(userProvider);
    const writeContracts = useContractLoader(userProvider);

    const makeLetter = (dna) => {
        let grid = newGrid();
        //renderLetter(grid, makeRng([4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2]));
        renderLetter(grid, makeRng(dna));
        return grid;//.map(row => row.join('') ).join('<br />');
    };
    const letterStyle = {
        fontFamily: 'monospace',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '12px',
        letterSpacing: '-2px',
        marginBottom: 0
    };

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
                    // console.log('info', infoRes)
                    const hex = dnaObj.toHexString()
                    setHex(hex)
                    const firstHex = hex.slice(0, 8)
                    const num = parseInt(firstHex, 16)
                    const digits = num.toString().split('')
                    const dna = digits.map(digit => parseInt(digit))

                    // const num = dnaObj.toNumber() / 1e12
                    setItemDna(dna) // last 6 digits e12-e18
                    setClaimed(isClaimed)
                    console.log({ isClaimed, hex, num, dna })
                })

        }
    }, [tokenId])

    const letterClass = claimed ? 'letter-item claimed' : 'letter-item'
    // const key = 'item-' + item.id.toNumber()
    return (
        <span className={letterClass} key={props.ukey}>
            <div className='letter-inner'>
                <div className='break-word'>
                    [{tokenId}]
                    hex: {hex} <br />
                    tokenURI: {tokenURI} <br />
                    claimed: {claimed ? 'true' : 'false'} <br />
                    name: {info.name} <br />
                </div>

                {makeLetter(itemDna).map(row => (<pre style={letterStyle}>{row.join('')}</pre>))}

                {!claimed &&
                    <Claim
                        provider={userProvider}
                        accountAddress={address}
                        // ERC721Address={writeContracts.YourCollectible.address}
                        writeContracts={writeContracts}
                        ipfs={ipfs}
                        tokenId={tokenId}
                        tokenDNA={hex}
                    />
                }
            </div>
        </span>
    )
}


