import { useEffect, useState } from 'react'
import Buttons from '../Buttons'
import UIState from '../UIState'
import { EVENTS } from '@little-island/octavia-engine'
import TextBody from '../TextBody'

import art_mainMenuTitle from '../../img/art/main_menu_title.png'

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
            <img className="mainMenuTitle"
                src={art_mainMenuTitle}
                alt="Title" />
            <TextBody center>
                A low-poly terrain generator using the Octavia Game Engine
            </TextBody>
            <Buttons className='MainMenu-module--buttons'>
                <button onMouseDown={onNewWorld}>New World</button>
                <button>Load</button>
            </Buttons>
            <TextBody center warning>
                &#9888; Program is currently in the Alpha version and is not fully optimized
            </TextBody>
            <TextBody center>
                Developed by Nikolas Karinja
            </TextBody>
        </div>
    </UIState>
}

export default MainMenuState