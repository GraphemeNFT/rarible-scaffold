import React from "react"; // useCallback, useEffect, useState



import OneLetter from './OneLetter'

import './letters.css'

export default function Letters (props) {
    // console.log('letters.props', props.dataSource)

    const inner = (letters) => {
        return letters.map(item => {
            const ukey = 'item-' + item.id.toNumber()
            return (
                <OneLetter readContracts={props.readContracts} key={ukey} item={item} />
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
