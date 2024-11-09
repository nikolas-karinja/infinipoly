import { useEffect, useState } from 'react'
import Buttons from '../Buttons'
import UIState from '../UIState'
import { EVENTS } from '@little-island/octavia-engine'

const MainMenuState = () =>
{
    const [visible, setVisibility] = useState(true)

    const onNewWorld = () =>
    {
        EVENTS.DispatchEvent('pre new world')
    }

    useEffect(() =>
    {
        EVENTS.AddListener('back to main menu', () =>
        {
            setVisibility(true)
        })

        EVENTS.AddListener('pre new world', () =>
        {
            setVisibility(false)
        })
    }, [])

    return <UIState visible={visible}>
        <div className='MainMenu-module'>
            <h1>Infinipoly</h1>
            <h4>A sandbox game</h4>
            <Buttons className='MainMenu-module--buttons'>
                <button onMouseDown={onNewWorld}>New World</button>
                <button>Load</button>
            </Buttons>
        </div>
    </UIState>
}

export default MainMenuState