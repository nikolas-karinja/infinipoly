import { useEffect, useState } from "react"
import Buttons from "../Buttons"
import UIState from "../UIState"
import { EVENTS, OCTAVIA } from "@little-island/octavia-engine"

const NewWorldSettingsState = () =>
{
    const [visible, setVisibility] = useState(false)

    const onBack = () =>
    {
        EVENTS.DispatchEvent('back to main menu')
        setVisibility(false)
    }

    const onCreate = () =>
    {
        OCTAVIA.AssembleGameObject('World')
        EVENTS.DispatchEvent('init new world')
        setVisibility(false)
    }

    useEffect(() =>
    {
        EVENTS.AddListener('pre new world', () =>
        {
            setVisibility(true)
        })
    }, [])

    return <UIState visible={visible}>
        <div className='NewWorldSettings-module'>
            <h2>New World</h2>
            <Buttons vert final>
                <button onMouseDown={onBack}>Back</button>
                <button onMouseDown={onCreate}>Create</button>
            </Buttons>
        </div>
    </UIState>
}

export default NewWorldSettingsState