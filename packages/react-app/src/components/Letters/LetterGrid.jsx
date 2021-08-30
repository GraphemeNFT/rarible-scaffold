import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";

import {
    InfoCircleOutlined,
    EditOutlined, EllipsisOutlined,
    SettingOutlined, LinkOutlined,
    DownloadOutlined
} from '@ant-design/icons';

import { newGrid, makeRng, renderLetter } from "./grapheme";

import { useStore } from "../../helpers/Store"

let keyCounter = 0
function counter () {
    return keyCounter++
}

export default function LetterGrid (props) {
    const letters = props.letters
    const contractAddress = useStore(state => state.contractAddress);

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
                    let actionButton
                    if (item.info.isClaimed) {
                        actionButton = <Button type="link" icon={<LinkOutlined />} />
                    } else {
                        actionButton = <Button type="link" icon={<EditOutlined />} />
                    }
                    // const actionType = item.info.isClaimed ? 'add' : 'claim'
                    // const itemType = item.info.isPrimitive ?
                    //     <span>'letter'</span> :
                    //     <span>'word'</span>
                    const itemType = <span>word</span>

                    const raribleLink = () => {
                        if (item.info.isClaimed) {
                            const rarible = `https://ropsten.rarible.com/token/${contractAddress}:${item.tokenId}?tab=details`
                            return (
                                <a href={rarible} target="_blank" rel="noopener noreferrer">
                                    View on <img className='tiny-icon' src='rarible-icon.jpg' /> RARIBLE
                                </a>
                            )
                        } else {
                            // FIXME - claim directly from here
                            return (
                                <Link to='/letters'>
                                    <Button type="primary" icon={<DownloadOutlined />}>Claim this!</Button>
                                </Link>
                            )
                        }
                    }

                    const title = <span className='card-title'>
                        #{id} | {item.metadata.name || 'no name'}
                    </span>
                    return (
                        <List.Item key={key}>
                            <Card
                                title={title}
                                actions={[
                                    raribleLink(),
                                    <Button type="link" icon={<InfoCircleOutlined />} />,
                                ]}
                            >
                                {makeLetter([...item.info.dna]).map((row, idx) => (<pre key={key + idx} style={letterStyle}>{row.join('')}</pre>))}
                            </Card>
                        </List.Item>
                    );
                }}
            />

            <hr />

            <Link to='/letters'>
                <Button type="primary" icon={<SettingOutlined />}>Claim More Letters!</Button>
            </Link>

        </div>
    )

}