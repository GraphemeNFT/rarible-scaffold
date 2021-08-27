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
    const [hex, setHex] = useState('0x')
    const [bigInt, setBigInt] = useState('10101')

    const { item } = props
    const itemId = item.id.toNumber()
    // console.log('itemId', itemId)

    useEffect(() => {
        if (itemId) {
            props.readContracts.YourCollectible.getDNA(itemId).then((dnaObj) => {
                console.log('dnaObj', dnaObj)
                setHex(dnaObj.toHexString())
                const longNumber = dnaObj.toBigInt()
                console.log('longNumber', longNumber)
                setBigInt(longNumber)
            })
        }
        // getInfo()
    }, [itemId])

    // const key = 'item-' + item.id.toNumber()
    return (
        <span className='letter-item' key={props.ukey}>
            <div>
                key: {itemId}
            </div>
            <div className='break-word'>
                name: {props.item.name}
                <div>
                    hex: {hex}
                </div>
                <div>
                    num: {bigInt}
                </div>
            </div>
        </span>
    )
}


