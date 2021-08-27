import React, { useEffect, useState } from "react"; // useCallback, useEffect, useState
// import {
//     List,
//     // Alert, Button, Card, Col, Input,
//     // Menu, Row
// } from "antd";

import './letters.css'

export default function OneLetter (props) {
    // console.log('oneLetter.props', props.item)
    const [dna, setDna] = useState({ hex: '0x', num: 0 })

    const { item } = props
    const itemId = item.id.toNumber()
    console.log('itemId', itemId)

    useEffect(() => {
        async function getInfo () {
            if (itemId) {
                const dnaObj = await props.readContracts.YourCollectible.getDNA(itemId);

                if (dnaObj) {
                    console.log('dnaObj', dnaObj)
                    const dna = {
                        hex: dnaObj.toHexString(),
                        num: dnaObj.toBigInt(),
                    }
                    console.log('dna', dna)
                    setDna('dna', dna)
                } else {
                    console.log('no dna', dnaObj)
                }
            }
        }
        getInfo()
    }, [itemId])

    // const key = 'item-' + item.id.toNumber()
    return (
        <span className='letter-item' key={props.ukey}>
            <div>
                key: {itemId}
            </div>
            <div>
                name: {props.item.name}
                <div>
                    hex: {dna.hex}
                </div>
                <div>
                    num: {dna.num}
                </div>
            </div>
        </span>
    )
}


