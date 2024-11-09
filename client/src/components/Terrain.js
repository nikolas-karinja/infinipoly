import { CONSTANTS, EVENTS, MATERIALS, OCTAVIA, TIME } from "@little-island/octavia-engine";
import { GAME_SETTINGS, UTILS } from "../core";
import { Perlin } from 'three-noise'
import * as THREE from 'three'
import { TerrainChunk } from "./subclasses/TerrainChunk";

class Terrain extends OCTAVIA.Core.ScriptComponent
{
    constructor(...args)
    {
        super(...args)

        this.Camera = this.GetComponent('Camera').Camera
        this.ControlsComponent = this.GetComponent('Orbit Controls')
        this.Chunks = {}
        this.chunksLoaded = 0
        this.ChunkInView = new THREE.Vector2()
        this.inMacroView = false
        this.chunksInView = []
        this.chunksInSimulation = []
        this.MacroChunksGLGroup = new THREE.Group()
        this.MicroChunksGLGroup = new THREE.Group()
        this.noiseSeed = Math.random()
        this.Raycaster = new THREE.Raycaster()
        this.ScreenCenterVec2 = new THREE.Vector2()

        this.gu = {
            time: {value: 100},
            morph: {value: 0},
            shift: {value: 0}
          }
    }

    get chunkWorldSize ()
    {
        return (GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro)
            * GAME_SETTINGS.Private.chunkCellSize
    }

    CreateChunk (tx, ty)
    {
        EVENTS.DispatchEvent('chunk creation started')

        const _name = `${tx},${ty}`

        this.Chunks[_name] = new TerrainChunk(this, tx, ty)
        this.Chunks[_name].Init(_name)
    }

    CreateEvents () 
    {
        EVENTS.AddListener('init new world', () =>
        {
            const _radius = GAME_SETTINGS.Private.initTerrainChunkRadius

            for (let x = -_radius; x <= _radius; x++)
            {
                for (let y = -_radius; y <= _radius; y++)
                {
                    this.CreateChunk(x, y)
                }
            }
        })

        EVENTS.AddListener('chunk creation finished', () =>
        {
            this.chunksLoaded++;

            if (this.chunksLoaded === GAME_SETTINGS.Private.chunkToLoadBeforeStart)
            {
                this.UpdateFromChunkInView(1, 1)

                EVENTS.DispatchEvent('start new world')
            }
        })
    }

    InitGameObject ()
    {
        this.CreateEvents()
        this.SetupScene()
    }

    SetupScene ()
    {
        this.MacroChunksGLGroup.visible = false

        this.AddGLObjectToScene(this.MacroChunksGLGroup)
        this.AddGLObjectToScene(this.MicroChunksGLGroup)
    }

    Update ()
    {
        GAME_SETTINGS.Private.currentZoomLevel = this.ControlsComponent.GetDistance()

        this.Raycaster.setFromCamera(this.ScreenCenterVec2, this.Camera)

        const _Intersects = this.Raycaster.intersectObjects(this.MicroChunksGLGroup.children)

        const _inMacroView = GAME_SETTINGS.Private.cameraProjection === CONSTANTS.Camera.PERSPECTIVE_PROJECTION ? 
            GAME_SETTINGS.Private.currentZoomLevel <= GAME_SETTINGS.Private.macroZoomLevel : 
            this.Camera.zoom > 2

        if (_inMacroView)
        {
            if (!this.MacroChunksGLGroup.visible)
            {
                
                GAME_SETTINGS.Private.inMacroView = true

                this.inMacroView = true

                this.MacroChunksGLGroup.visible = true
                this.MicroChunksGLGroup.visible = false

                EVENTS.DispatchEvent('view level changed')
            }
        }
        else
        {
            if (this.MacroChunksGLGroup.visible)
            {
                GAME_SETTINGS.Private.inMacroView = false

                this.inMacroView = false

                this.MacroChunksGLGroup.visible = false
                this.MicroChunksGLGroup.visible = true

                EVENTS.DispatchEvent('view level changed')
            }
        }

        if (_Intersects.length > 0)
        {
            const _IntersectedChunk = _Intersects[0].object
            const _xz = _IntersectedChunk.name.split(',').map(Number)

            this.UpdateFromChunkInView(_xz[0], _xz[1])
        }

        for (const c in this.Chunks)
            this.Chunks[c].UpdateVisuals()
    }

    UpdateFromChunkInView (tx, ty)
    {
        if (this.chunksInSimulation.length === 0 || 
            (this.ChunkInView.x !== tx || this.ChunkInView.y !== ty))
        {
            const _renderDistance = GAME_SETTINGS.Public.Game.renderDistance[0]
            const _newChunksInView = []

            this.ChunkInView.set(tx, ty)

            EVENTS.DispatchEvent('chunk in view updated')

            for (let i = 0, x = -_renderDistance, y = -_renderDistance; i < Math.pow((_renderDistance * 2) + 1, 2); i++, x++)
            {
                if (x > _renderDistance)
                {
                    x = -_renderDistance
                    y++
                }

                const _tx = x + this.ChunkInView.x
                const _ty = y + this.ChunkInView.y
                const _chunkName = `${_tx},${_ty}`

                if (this.Chunks[_chunkName])
                {
                    _newChunksInView.push(_chunkName)
                }

                for (let c of this.chunksInView)
                {
                    if (!_newChunksInView.includes(c))
                        this.Chunks[c].SetMacroVisibility(false)
                }

                this.chunksInView = _newChunksInView

                for (let c of this.chunksInView)
                    this.Chunks[c].SetMacroVisibility(true)
            }
        }
    }
}

export { Terrain }