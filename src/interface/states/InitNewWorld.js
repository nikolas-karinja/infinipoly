import { useEffect, useState } from "react"
import Buttons from "../Buttons"
import UIState from "../UIState"
import { EVENTS, OCTAVIA } from "@little-island/octavia-engine"
import { GAME_SETTINGS } from "../../core"

const InitNewWorldState = () =>
{
    const [visible, setVisibility] = useState(false)

    useEffect(() =>
    {
        EVENTS.AddListener('init new world', () =>
        {
            OCTAVIA.AssembleGameObject('Sky')
            GAME_SETTINGS.Private.isNewWorld = true
            setVisibility(true)
        })

        EVENTS.AddListener('start new world', () =>
        {
            setVisibility(false)
        })
    }, [])

    return <UIState visible={visible}>
        <div className='InitNewWorld-module'>
            <h3>Creating new world...</h3>
        </div>
    </UIState>
}

export default InitNewWorldState