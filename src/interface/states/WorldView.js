import { useEffect, useState } from "react"
import Buttons from "../Buttons"
import UIState from "../UIState"
import { EVENTS, OCTAVIA } from "@little-island/octavia-engine"
import { GAME_SETTINGS } from "../../core"

const WorldViewState = () =>
    {
        const [visible, setVisibility] = useState(false)
        const [inMacroView, setInMacroView] = useState(false)
    
        useEffect(() =>
        {
            EVENTS.AddListener('start new world', () =>
            {
                setVisibility(true)
            })

            EVENTS.AddListener('view level changed', () =>
            {
                setInMacroView(GAME_SETTINGS.Private.inMacroView)
            })
        }, [])
    
        return <UIState visible={visible}>
            <div className='WorldView-module'>
                <div className={`WorldView-module--viewIndicator ${inMacroView ? 'macro' : ''}`}>
                    <div>{inMacroView ? 'Detailed' : 'Simplified' } View</div>
                </div>
            </div>
        </UIState>
    }
    
    export default WorldViewState