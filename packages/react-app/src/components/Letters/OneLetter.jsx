import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";

import React, { useEffect, useState } from "react"; // useCallback, useEffect, useState

import { useUserAddress } from "eth-hooks";
import { DAI_ABI, DAI_ADDRESS, INFURA_ID, NETWORK, NETWORKS } from "../../constants";


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
                    const dna = dnaObj.toHexString()
                    setHex(dna)
                    setClaimed(isClaimed)
                    console.log({ isClaimed, dna })
                })
            // props.readContracts.YourCollectible.getDna(itemId)
            //     .then((dnaObj) => {
            //         setHex(dnaObj.toHexString())
            //     })
            // props.readContracts.YourCollectible.isClaimed(itemId)
            //     .then((isClaimed) => {
            //         setClaimed(isClaimed)
            //         if (isClaimed) {
            //             console.log('claimed item:', item, isClaimed)
            //             console.log('item.keys', Object.keys(item))
            //         }
            //     })
        }
    }, [tokenId])

    const letterClass = claimed ? 'letter-item claimed' : 'letter-item'
    // const key = 'item-' + item.id.toNumber()
    return (
        <span className={letterClass} key={props.ukey}>
            <div>
                tokenId: {tokenId}
            </div>
            <div className='break-word'>
                <div>
                    hex: {hex} <br />
                    tokenURI: {tokenURI}
                </div>
                <div>
                    claimed: {claimed ? 'true' : 'false'}
                </div>
                <div>
                    {/* name: {props.item.dataProvider.name} */}
                </div>

                <div>
                    {claimed ?
                        <div>
                            _name_: {info.name} <br />

                        </div>
                        :
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
            </div>
        </span>
    )
}


