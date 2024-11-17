import { useEffect, useState } from "react"
import Buttons from "../Buttons"
import UIState from "../UIState"
import { EVENTS, OCTAVIA } from "@little-island/octavia-engine"
import LabeledInput from "../LabeledInput"
import { GAME_SETTINGS } from "../../core/settings"
import TextBody from "../TextBody"

import art_newWorldTitle from '../../img/art/new_world_title.png'

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
        OCTAVIA.AssembleGameObject('Atmosphere')
        OCTAVIA.AssembleGameObject('Sun')
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
            <img className="newWorldTitle"
                src={art_newWorldTitle}
                alt="Title" />
            <h4>Chunks</h4>
            <TextBody>
                For performance and speedy generation, the terrain is divided into segments called "Chunks". When you zoom into the terrain during gameplay, you will see what's called the "Detailed View". In this mode you can actually see the chunks disappearing and reappearing based on where the camera is located within the map.
            </TextBody>
            <TextBody warning>
                &#9888; These settings affect performance the heaviest
            </TextBody>
            <LabeledInput label="Initial Generation Radius"
                type="number"
                min={1}
                step={1}
                short
                dark
                gameProperty={"initTerrainChunkRadius"} />
            <LabeledInput label="Micro Detail"
                type="number"
                min={2}
                step={2}
                short
                gameProperty={"chunkCellsMicro"} />
            <LabeledInput label="Macro Detail Multiplier"
                type="number"
                min={2}
                step={2}
                short
                dark
                gameProperty={"chunkScaleMacro"} />
            <h4>Terrain</h4>
            <TextBody>
                The landscape that dominates the screen is called the terrain. It includes geography and topography, such as mountains and vegetation. The terrain uses "Simplex Noise" to generate its peaks and valleys.
            </TextBody>
            <LabeledInput label="Amplitude"
                type="number"
                min={0}
                step={0.1}
                short
                dark
                gameProperty={"noiseAmplitude"} />
            <LabeledInput label="Amplitude Multiplier"
                type="number"
                min={0}
                max={1}
                step={0.01}
                short
                gameProperty={"noiseAmplitudeCoef"} />
            <LabeledInput label="Frequency"
                type="number"
                min={0}
                step={1}
                short
                dark
                gameProperty={"noiseFrequency"} />
            <LabeledInput label="Frequency Multiplier"
                type="number"
                min={0}
                max={1}
                step={0.01}
                short
                gameProperty={"noiseFrequencyCoef"} />
            <h4>Vegetation</h4>
            <TextBody>
                This would be the trees, brush, rocks, etc. Individuals spawn based by random chance in addition to a noise map.
            </TextBody>
            <LabeledInput label="Land Tile Spawn Chance (%)"
                type="number"
                min={0}
                max={100}
                step={0.5}
                short
                dark
                gameProperty={"vegetationSpreadLand"} />
            <LabeledInput label="Sea Tile Spawn Chance (%)"
                type="number"
                min={0}
                max={100}
                step={0.5}
                short
                gameProperty={"vegetationSpreadSea"} />
            <Buttons vert final>
                <button onMouseDown={onBack}>Back</button>
                <button onMouseDown={onCreate}>Create</button>
            </Buttons>
        </div>
    </UIState>
}

export default NewWorldSettingsState