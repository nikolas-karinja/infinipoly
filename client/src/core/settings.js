import { CONSTANTS } from "@little-island/octavia-engine"

export const OCTAVIA_SETTINGS = {
    // linearColorSpace: true,
    avoidDefaultSceneCreation: true,
    enableShadows: true,
}

export const GAME_SETTINGS = {
    Private: {
        cameraProjection: CONSTANTS.Camera.ORTHOGRAPHIC_PROJECTION,
        chunkScaleMacro: 4, // chunk size micro mult (when zoomed in)
        chunkCellsMicro: 8, // chunk detail (when zoomed out)
        chunkCellSize: 0.1, // chunk divisions in world units
        chunkToLoadBeforeStart: 0, // if loading a world, this number is based on the chunk in the save file
        currentZoomLevel: 0, // current zoom level that the camera controls are at (updated every frame)
        initTerrainChunkRadius: 5,
        isNewWorld: false, // value set to true when a brand-new world is created
        macroZoomLevel: 50, // the zoom level when the macro-terrain should be visible
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