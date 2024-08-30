import { OCTAVIA_ASSEMBLIES } from "./assemblies"
import { OCTAVIA_COMPONENTS } from "./components"
import { OCTAVIA_MATERIALS } from "./materials"
import { OCTAVIA_MODELS } from "./models"
import { OCTAVIA_SCENES } from "./scenes"
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

const OCTAVIA_SETTINGS = {
    // linearColorSpace: true,
    avoidDefaultSceneCreation: true,
    enableShadows: true,
}

const GAME_SETTINGS = {
    Private: {
        chunkScaleMacro: 4, // chunk size micro mult (when zoomed in)
        chunkCellsMicro: 8, // chunk detail (when zoomed out)
        chunkCellSize: 0.1, // chunk divisions in world units
        chunkToLoadBeforeStart: 0, // if loading a world, this number is based on the chunk in the save file
        currentZoomLevel: 0, // current zoom level that the camera controls are at (updated every frame)
        initTerrainChunkRadius: 5,
        isNewWorld: false, // value set to true when a brand-new world is created
        macroZoomLevel: 20, // the zoom level when the macro-terrain should be visible
        noiseAmplitude: 1.5,
        noiseAmplitudeCoef: 0.4,
        noiseFrequency: 175,
        noiseFrequencyCoef: 0.4,
        seaLevel: 0,
        simTicks: 16,
        vegetationSpreadLand: 7.5, // [percent]
        vegetationSpreadSea: 10, // [percent]
        inMacroView: false,
    },

    // [value: any, description: string]
    Public: {
        Game: {
            renderDistance: [2, 'The radius of chunks that get rendered when in the "Detailed" view mode.'],
            simulationDistance: [2, 'The radius of chunks that get their data updated from the center of the screen.'],
        },
    },
}

export { SHADER_FRAGMENTS } from './shaderFragments'
export {
    GAME_SETTINGS,
    OCTAVIA_DATA,
    OCTAVIA_SETTINGS,
}