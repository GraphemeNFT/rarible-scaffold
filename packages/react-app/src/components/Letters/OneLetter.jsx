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
    const [injectedProvider, setInjectedProvider] = useState();
    const userProvider = useUserProvider(injectedProvider, localProvider);

    const [fakeClaimed, setFakeClaimed] = useState([]);

    const address = useUserAddress(userProvider);
    const writeContracts = useContractLoader(userProvider);


    const { item } = props
    const itemId = item.id.toNumber()
    // console.log('itemId', itemId)

    useEffect(() => {
        if (itemId) {
            props.readContracts.YourCollectible.getDNA(itemId)
                .then((dnaObj) => {
                    setHex(dnaObj.toHexString())
                })
            props.readContracts.YourCollectible.isClaimed(itemId)
                .then((result) => {
                    console.log('isClaimed', result)
                    setClaimed(result)
                })
        }
    }, [itemId])

    const onClaimed = (opts) => {
        console.log('onClaimed', opts)
    }

    const letterClass = claimed ? 'letter-item claimed' : 'letter-item'
    // const key = 'item-' + item.id.toNumber()
    return (
        <span className={letterClass} key={props.ukey}>
            <div>
                itemId: {itemId}
            </div>
            <div className='break-word'>
                <div>
                    hex: {hex}
                </div>
                claimed: {claimed ? 'true' : 'false'}

                <div>
                    {claimed ?
                        '_name_' :
                        <Claim
                            provider={userProvider}
                            accountAddress={address}
                            // ERC721Address={writeContracts.YourCollectible.address}
                            writeContracts={writeContracts}
                            ipfs={ipfs}
                            tokenId={itemId}
                            tokenDNA={hex}
                            onClaimed={onClaimed}
                        />
                    }
                </div>
            </div>
        </span>
    )
}


