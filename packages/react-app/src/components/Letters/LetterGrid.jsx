import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";

import {
    EditOutlined, EllipsisOutlined,
    SettingOutlined, LinkOutlined
} from '@ant-design/icons';

import { newGrid, makeRng, renderLetter } from "./grapheme";



let keyCounter = 0
function counter () {
    return keyCounter++
}

export default function LetterGrid (props) {
    const letters = props.letters

    const makeLetter = (dna) => {
        let grid = newGrid();
        //renderLetter(grid, makeRng([4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2]));
        renderLetter(grid, makeRng(dna));
        return grid;//.map(row => row.join('') ).join('<br />');
    };
    const letterStyle = {
        textAlign: 'left', fontWeight: 'bold',
        fontSize: '6px', lineHeight: '6px',
        letterSpacing: '0px', marginBottom: 0
    };

    return (

        <div style={{ width: '100%', padding: 24, marginTop: 32, paddingBottom: 250 }}>
            <List
                //bordered
                grid={{ gutter: 16, column: 3 }}
                dataSource={letters}
                renderItem={item => {
                    // console.log(letters);
                    const id = item.tokenId;

                    // FIXME - these vars are not defined
                    // const key = id + "_" + item.tokenURI + "_" + item.owner
                    const key = `item-${id}-${counter()}`;
                    const actionType = item.info.isClaimed ? 'add' : 'claim'
                    const itemType = item.info.isPrimitive ? 'letter' : 'word'
                    const rarible = `https://ropsten.rarible.com/token/0x1725eab2faa1e9b97487b818318ba2310334e029:${item.tokenId}?tab=details`

                    const title = <span className='card-title'>
                        #{id} | {item.metadata.name || 'no name'}
                    </span>
                    return (
                        <List.Item key={key}>
                            <Card
                                title={title}
                                actions={[
                                    <a href={rarible} target="_blank" rel="noopener noreferrer">
                                        <img className='tiny-icon' src='rarible-icon.jpg' />
                                    </a>,
                                    <span>
                                        {itemType}
                                    </span>,
                                    <Button size='small'>
                                        {actionType}
                                    </Button>
                                ]}
                            >
                                {makeLetter([...item.info.dna]).map((row, idx) => (<pre key={key + idx} style={letterStyle}>{row.join('')}</pre>))}
                            </Card>
                        </List.Item>
                    );
                }}
            />
        </div>
    )

}