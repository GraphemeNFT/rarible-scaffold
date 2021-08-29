import React, { useState } from "react"; // useCallback, useEffect, useState
// import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import create from 'zustand'

import Mint from '../Mint/Mint'
import OneLetter from './OneLetter'
import './letters.css'

// const scaffoldEthProvider = null; // new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
// const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);

// import useStore from '../../helpers/Store'

export default function Letters (props) {
    // console.log('letters.props', props.dataSource)
    // const wallet = useStore(state => state.wallet)
    // const localWallet = useStore(state => state.wallet);

    const inner = (letters) => {
        return letters.map(letter => {
            console.log('letter', letter)
            const ukey = 'letter-' + letter.id
            return (
                <OneLetter readContracts={props.readContracts} writeContracts={props.writeContracts} key={ukey} tokenId={letter.tokenId} />
            )
        })
    }

    return (
        <div>
            <Mint
                ensProvider={props.mainnetProvider}
                provider={props.userProvider}
                writeContracts={props.writeContracts}
            />
            <div className="letter-holder">
                {props.dataSource &&
                    inner(props.dataSource)
                }
            </div>
        </div>
    )

}
