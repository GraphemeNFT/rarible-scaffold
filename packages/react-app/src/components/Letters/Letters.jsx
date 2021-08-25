import React from "react"; // useCallback, useEffect, useState
// import {
//     List,
//     // Alert, Button, Card, Col, Input,
//     // Menu, Row
// } from "antd";

import './letters.css'

export default function Letters (props) {
    console.log('letters.props', props)

    const inner = (letters) => {
        return letters.map(item => {
            const key = 'item-' + item.id.toNumber()
            return (
                <span className='letter-item' key={key}>
                    <div>
                        {key}
                    </div>
                    <div>
                        {item.name}
                    </div>
                </span>
            )
        })
    }

    return (
        <div className="letter-holder">
            {props.dataSource &&
                inner(props.dataSource)
            }
        </div>
    )
}
