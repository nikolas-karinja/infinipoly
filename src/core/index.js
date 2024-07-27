import { OCTAVIA_ASSEMBLIES } from "./assemblies"
import { OCTAVIA_COMPONENTS } from "./components"
import { OCTAVIA_MATERIALS } from "./materials"

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
    ],
    materials: OCTAVIA_MATERIALS,
}

const OCTAVIA_SETTINGS = {
    avoidDefaultSceneCreation: true,
}

const GAME_SETTINGS = {
    Private: {
        chunkScaleMacro: 4, // chunk size micro mult (when zoomed in)
        chunkCellsMicro: 8, // chunk detail (when zoomed out)
        chunkCellSize: 0.1, // chunk divisions in world units
        chunkToLoadBeforeStart: 0, // if loading a world, this number is based on the chunk in the save file
        currentZoomLevel: 0, // current zoom level that the camera controls are at (updated every frame)
        isNewWorld: false, // value set to true when a brand-new world is created
        macroZoomLevel: 10, // the zoom level when the macro-terrain should be visible
        noiseAmplitude: 1,
        noiseScale: 1,
    },

    // [value: any, description: string]
    Public: {
        Game: {
            renderDistance: [1, 'The radius of chunks that get rendered when in the "Detailed" view mode.'],
            simulationDistance: [2, 'The radius of chunks that get their data updated from the center of the screen.'],
        },
    },
}

export {
    GAME_SETTINGS,
    OCTAVIA_DATA,
    OCTAVIA_SETTINGS,
}