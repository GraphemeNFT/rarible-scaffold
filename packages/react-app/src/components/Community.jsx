import React, { useEffect, useState } from "react"; // useCallback, useEffect, useState

import OneLetter from './Letters/OneLetter'

import { useStore } from '../helpers/Store'

export default function Community (props) {
    const letters = useStore(state => state.letters)
    const raribleHome = useStore(state => state.raribleHome)

    const [words, setWords] = useState([])
    useEffect(() => {
        const _words = letters.filter(letter => !letter.info.isPrimitive)
        console.log('words', letters, '=>', words)
        setWords(_words)
    }, [letters])

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
            <h1>
                <a href={raribleHome} target="_blank" rel="noopener noreferrer">
                    View and Trade the Collection on <img className='tiny-icon' src='rarible-icon.jpg' /> RARIBLE!
                </a>
            </h1>

            <div className="letter-holder">
                {(letters && letters.length > 0)
                    ?
                    inner(words)
                    : <div>...</div>
                }
            </div>

        </div>
    )

}
