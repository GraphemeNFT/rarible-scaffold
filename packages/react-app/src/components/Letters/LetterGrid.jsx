import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";

import {
    InfoCircleOutlined,
    EditOutlined, EllipsisOutlined,
    SettingOutlined, LinkOutlined,
    DownloadOutlined
} from '@ant-design/icons';

import { useStore } from "../../helpers/Store"
const grapheme = require("./grapheme");

let keyCounter = 0
function counter () {
    return keyCounter++
}

export default function LetterGrid (props) {
    const letters = props.letters
    const contractAddress = useStore(state => state.contractAddress);
    const raribleTokenAddress = useStore(state => state.raribleTokenAddress);
    // const [tokenAddress, setTokenAddress] = useState(raribleTokenAddress)

    // useEffect(() => {
    //     setTokenAddress(`raribleTokenAddress:${item.tokenId}?tab=details`)
    //     ""
    // }, [])


    const makeLetter = (dna) => {
        let grid = grapheme.newGrid();
        //grapheme.renderLetter(grid, grapheme.makeRng([4, 4, 1, 4, 1, 7, 0, 4, 0, 3, 2]));
        grapheme.renderLetter(grid, grapheme.makeRng(dna));
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
                        if (item.info.isClaimed || !item.info.isPrimitive) {
                            const thisTokenRarible = `${raribleTokenAddress}:${item.tokenId}?tab=details`
                            return (
                                <a href={thisTokenRarible} target="_blank" rel="noopener noreferrer">
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

            <br />
            <hr />
            <div class='debug-field small'>{raribleTokenAddress}</div>

        </div>
    )

}
