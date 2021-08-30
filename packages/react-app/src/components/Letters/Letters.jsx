import React, { useState } from "react"; // useCallback, useEffect, useState
import create from 'zustand'

import Mint from '../Mint/Mint'
import OneLetter from './OneLetter'
import './letters.css'

import { useStore } from '../../helpers/Store'

export default function Letters (props) {
    // console.log('letters.props', props.dataSource)
    // const wallet = useStore(state => state.wallet)
    // const localWallet = useStore(state => state.wallet);

    const letters = useStore(state => state.letters)

    const inner = (_letters) => {
        return _letters.map(letter => {
            console.log('letter', letter)
            const ukey = 'letter-' + letter.id
            return (
                <OneLetter
                    readContracts={props.readContracts}
                    writeContracts={props.writeContracts}
                    key={ukey} tokenId={letter.tokenId} />
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
                {(letters && letters.length > 0)
                    ?
                    inner(letters)
                    : <div>...</div>
                }
            </div>
        </div>
    )

}
