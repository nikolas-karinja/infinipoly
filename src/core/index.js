import { GAME_SETTINGS } from "./settings"
import { OCTAVIA_ASSEMBLIES } from "./assemblies"
import { OCTAVIA_COMPONENTS } from "./components"
import { OCTAVIA_MATERIALS } from "./materials"
import { OCTAVIA_MODELS } from "./models"
import { OCTAVIA_SCENES } from "./scenes"
import { OCTAVIA_SETTINGS } from "./settings"
import { OCTAVIA_TEXTURES } from "./textures"


const OCTAVIA_DATA = {
    assemblies: OCTAVIA_ASSEMBLIES,
    components: OCTAVIA_COMPONENTS,
    events: [
        'chunk creation finished',
        'chunk creation started',
        'back to main menu',
        'init new world',
        'pre new world',
        'start new world',
        'chunk in view updated',
        'view level changed'
    ],
    materials: OCTAVIA_MATERIALS,
    models: OCTAVIA_MODELS,
    scenes: OCTAVIA_SCENES,
    textures: OCTAVIA_TEXTURES,
}

export { SHADER_FRAGMENTS } from './shaderFragments'
export {
    GAME_SETTINGS,

    OCTAVIA_DATA,
    OCTAVIA_SETTINGS,
}