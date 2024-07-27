import { EVENTS, GAME_SCENES, MATERIALS, OCTAVIA } from "@little-island/octavia-engine";
import { GAME_SETTINGS } from "../core";
import { Perlin } from 'three-noise'

class TerrainChunk
{
    constructor (component, tx, ty)
    {
        this.name = ''
        this.tx = tx
        this.ty = ty
        this.wx = tx * this.chunkSizeWU
        this.wz = ty * this.chunkSizeWU
        this.Component = component
        this.MacroGeo = new OCTAVIA.Three.PlaneGeometry(...this.macroGeoArgs)
        this.MacroMesh = new OCTAVIA.Core.Mesh(this.MacroGeo, MATERIALS.FindMaterial('Terrain Wireframe'))
        this.MicroGeo = new OCTAVIA.Three.PlaneGeometry(...this.microGeoArgs)
        this.MicroMesh = new OCTAVIA.Core.Mesh(this.MicroGeo, MATERIALS.FindMaterial('Terrain Wireframe'))
    }

    get chunkSizeWU ()
    {
        return (GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro) 
            * GAME_SETTINGS.Private.chunkCellSize
    }

    // x-vertex, z-vertex
    GetNoiseAt (vx, vy)
    {
        
    }

    get macroGeoArgs ()
    {
        return [this.chunkSizeWU, 
            this.chunkSizeWU,
            GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro, 
            GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro]
    }

    get microGeoArgs ()
    {
        return [this.chunkSizeWU, 
            this.chunkSizeWU,
            GAME_SETTINGS.Private.chunkCellsMicro, 
            GAME_SETTINGS.Private.chunkCellsMicro]
    }

    CreateMeshes ()
    {
        this.MacroMesh.userData.tx = this.tx
        this.MacroMesh.userData.ty = this.ty

        this.MacroMesh.visible = false
        this.MacroMesh.rotateX(Math.PI / -2)
        this.MacroMesh.position.x = this.wx
        this.MacroMesh.position.z = this.wz
        this.MicroMesh.rotateX(Math.PI / -2)
        this.MicroMesh.position.x = this.wx
        this.MicroMesh.position.z = this.wz

        this.Component.MacroChunksGLGroup.add(this.MacroMesh)
        this.Component.MicroChunksGLGroup.add(this.MicroMesh)
    }

    Init ()
    {
        this.CreateMeshes()
    }

    SetMacroVisibility (value)
    {
        this.MacroMesh.visible = value
    }

    SetName (value)
    {
        this.name = value
        this.MacroMesh.name = value
        this.MicroMesh.name = value
    }
}

class Terrain extends OCTAVIA.Core.GameObjectComponent
{
    constructor(...args)
    {
        super(...args)

        this.Camera = this.GetComponent('World Camera').Camera
        this.Chunks = {}
        this.chunksLoaded = 0
        this.ChunkInView = new OCTAVIA.Three.Vector2()
        this.inMacroView = false
        this.chunksInView = []
        this.chunksInSimulation = []
        this.MacroChunksGLGroup = new OCTAVIA.Three.Group()
        this.MicroChunksGLGroup = new OCTAVIA.Three.Group()
        this.Noise = new Perlin(Math.random())
        this.Raycaster = new OCTAVIA.Three.Raycaster()
        this.ScreenCenterVec2 = new OCTAVIA.Three.Vector2()
    }

    CreateChunk (tx, ty)
    {
        EVENTS.DispatchEvent('chunk creation started')

        const _name = `${tx},${ty}`

        this.Chunks[_name] = new TerrainChunk(this, tx, ty)
        this.Chunks[_name].SetName(_name)
        this.Chunks[_name].Init()
    }

    CreateEvents () 
    {
        EVENTS.AddListener('init new world', () =>
        {
            // this.CreateChunk(0, 0)
            
            for (let x = -5; x <= 5; x++)
            {
                for (let y = -5; y <= 5; y++)
                {
                    this.CreateChunk(x, y)
                }
            }
        })

        EVENTS.AddListener('chunk creation finished', () =>
        {
            if (GAME_SETTINGS.Private.isNewWorld)
            {
                EVENTS.DispatchEvent('start new world')
            }
            else
            {
                this.chunksLoaded++;

                if (this.chunksLoaded === GAME_SETTINGS.Private.chunkToLoadBeforeStart)
                {
                    EVENTS.DispatchEvent('start new world')
                }
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
        this.Raycaster.setFromCamera(this.ScreenCenterVec2, this.Camera)

        const _Intersects = this.Raycaster.intersectObjects(this.MicroChunksGLGroup.children)

        if (GAME_SETTINGS.Private.currentZoomLevel <= GAME_SETTINGS.Private.macroZoomLevel)
        {
            if (!this.MacroChunksGLGroup.visible)
            {
                this.inMacroView = true

                this.MacroChunksGLGroup.visible = true
                this.MicroChunksGLGroup.visible = false
            }
        }
        else
        {
            if (this.MacroChunksGLGroup.visible)
            {
                this.inMacroView = false

                this.MacroChunksGLGroup.visible = false
                this.MicroChunksGLGroup.visible = true
            }
        }

        if (_Intersects.length > 0)
        {
            const _IntersectedChunk = _Intersects[0].object
            const _xz = _IntersectedChunk.name.split(',').map(Number)

            if (this.chunksInSimulation.length === 0 || 
                (this.ChunkInView.x !== _xz[0] || this.ChunkInView.y !== _xz[1]))
            {
                const _renderDistance = GAME_SETTINGS.Public.Game.renderDistance[0]
                const _simDistance = GAME_SETTINGS.Public.Game.simulationDistance[0]
                const _newChunksInView = []

                this.chunksInSimulation = []
                this.ChunkInView.set(..._xz)

                for (let i = 0, x = -_simDistance, y = -_simDistance; i < Math.pow((_simDistance * 2) + 1, 2); i++, x++)
                {
                    if (x > _simDistance)
                    {
                        x = -_simDistance
                        y++
                    }

                    const _tx = x + this.ChunkInView.x
                    const _ty = y + this.ChunkInView.y
                    const _chunkName = `${_tx},${_ty}`

                    if (this.Chunks[_chunkName])
                    {
                        this.chunksInSimulation.push(_chunkName)

                        if (_tx >= _xz[0] - _renderDistance && _tx <= _xz[0] + _renderDistance &&
                            _ty >= _xz[1] - _renderDistance && _ty <= _xz[1] + _renderDistance)
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

            if (this.inMacroView)
            {

            }
        }
    }
}

export { Terrain }