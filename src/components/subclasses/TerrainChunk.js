import * as THREE from 'three'
import { TerrainPlaneGeometry } from './TerrainPlaneGeometry'
import {OCTAVIA, MATERIALS, WORKERS, EVENTS, MODELS, CONSTANTS } from '@little-island/octavia-engine'
import { GAME_SETTINGS } from "../../core";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { TerrainWaterGeometry } from './TerrainWaterGeometry';

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
        this.MacroGeo = null
        this.MacroMesh = null
        this.MicroGeo = null
        this.MicroMesh = null
        this.SpriteMesh = null
        this.WaterMesh = null
        this.VegetationMesh = null
        this.cellHeights = []
    }

    get chunkSizeWU ()
    {
        return (GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro) 
            * GAME_SETTINGS.Private.chunkCellSize
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

        const _BoundsMesh = new THREE.BoxHelper(this.MicroMesh, 0xff00ff)

        this.Component.MacroChunksGLGroup.add(this.MacroMesh)
        this.Component.MicroChunksGLGroup.add(this.MicroMesh)

        // this.Component.SceneGL.add(_BoundsMesh)
    }

    CreateNoise ()
    {
        return new Promise((resolve) =>
        {
            const Worker = WORKERS.Create('./workers/calculateTerrainChunkHeights.js', {type: 'module'})

            const _Data = {
                ccc: GAME_SETTINGS.Private.chunkCellsMicro,
                cms: GAME_SETTINGS.Private.chunkScaleMacro,
                na: GAME_SETTINGS.Private.noiseAmplitude,
                nac: GAME_SETTINGS.Private.noiseAmplitudeCoef,
                nf: GAME_SETTINGS.Private.noiseFrequency,
                nfc: GAME_SETTINGS.Private.noiseFrequencyCoef,
                seed: this.Component.noiseSeed,
                tx: this.tx,
                ty: this.ty,
            }

            Worker.PostMessage(_Data, (e) =>
            {
                const _macroArgs = [this.chunkSizeWU, 
                    this.chunkSizeWU,
                    GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro, 
                    GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro,
                    e.macro]
                const _microArgs = [this.chunkSizeWU, 
                    this.chunkSizeWU,
                    GAME_SETTINGS.Private.chunkCellsMicro, 
                    GAME_SETTINGS.Private.chunkCellsMicro,
                e.micro]

                const _Mat = MATERIALS.FindMaterial('Terrain')

                this.cellHeights = e.cellHeights

                this.MacroGeo = new TerrainPlaneGeometry(..._macroArgs)
                this.MacroMesh = new OCTAVIA.Core.Mesh(this.MacroGeo, _Mat)
                this.MacroMesh.castShadow = true
                this.MacroMesh.receiveShadow = true
                
                this.MicroGeo = new TerrainPlaneGeometry(..._microArgs)
                this.MicroMesh = new OCTAVIA.Core.Mesh(this.MicroGeo, _Mat)

                resolve()
            })
        })
    }

    CreateVegetation ()
    {
        return new Promise((resolve) =>
        {
            let _geometries = []
            const _cellCount = GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro
            const _cellSize = GAME_SETTINGS.Private.chunkCellSize

            let _cy = 0
            let _cx = 0

            let _sw = ((_cellCount / -2) * _cellSize) + (_cellSize / 2)

            for (let i = 0; i < _cellCount * _cellCount; i++)
            {
                if (i !== 0 && i % _cellCount === 0)
                {
                    _cy++
                    _cx = 0
                }

                const _Position = new THREE.Vector3(_sw + (_cx * _cellSize),
                    this.cellHeights[_cy][_cx],
                    _sw + (_cy * _cellSize))

                let _meshName = null
                let _Geo = null
                let _chance = Math.random() * 100

                let _Model = MODELS.FindModel('Vegetation')

                if (_Position.y > GAME_SETTINGS.Private.seaLevel && _Position.y < 1.2)
                {
                    const _spawnChance = Math.random() * 100

                    if (_spawnChance < GAME_SETTINGS.Private.vegetationSpreadLand * Math.pow((_Position.y * 2), 2))
                    {
                        if (_chance < 100)
                            _meshName = 'Weed'
                        if (_chance < 25)
                            _meshName = OCTAVIA.ArrayUtils.getRandomItem(['Pine'])
                        if (_chance < 10)
                            _meshName = 'Green_Birch'
                        if (_chance < 7)
                            _meshName = 'Rock'
                    }
                }
                else if (_Position.y < GAME_SETTINGS.Private.seaLevel)
                {
                    const _spawnChance = Math.random() * 100

                    if (_spawnChance < GAME_SETTINGS.Private.vegetationSpreadSea)
                    {   
                        if (_chance < 100)
                            _meshName = 'Weed'
                        if (_chance < 1)
                            _meshName = 'Boulder'
                    }
                }

                if (_meshName)
                {
                    const _scale = _cellSize * OCTAVIA.MathUtils.randFloat(0.5, 0.75)

                    _Geo = _Model.FindMesh(_meshName).geometry.clone()
                    _Geo.rotateY(Math.random() * (Math.PI * 2))
                    _Geo.scale(_scale ,_scale, _scale)
                    _Geo.translate(_Position.x, _Position.y, _Position.z)
                        
                    _geometries.push(_Geo)
                }

                _cx++
            }

            if (_geometries.length > 0)
            {
                const _Geo = BufferGeometryUtils.mergeGeometries(_geometries)
                
                this.VegetationMesh = new OCTAVIA.Core.Mesh(_Geo, MATERIALS.FindMaterial('Vegetation'))
                this.VegetationMesh.castShadow = true
                this.VegetationMesh.receiveShadow = true
                this.VegetationMesh.rotateX(Math.PI / 2)
                this.VegetationMesh.raycastEnabled = false

                this.MacroMesh.add(this.VegetationMesh)
            }

            resolve()
        })
    }

    CreateWater ()
    {
        const _size = (GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro) 
            * GAME_SETTINGS.Private.chunkCellSize
        const _Geo = new TerrainWaterGeometry(this.tx, this.ty, _size, _size, 16, 16)
        
        this.WaterMesh = new OCTAVIA.Core.Mesh(_Geo, MATERIALS.FindMaterial('Terrain Water'))
        this.WaterMesh.rotateX(Math.PI / -2)
        this.WaterMesh.receiveShadow = true

        this.Component.SceneGL.add(this.WaterMesh)

        /** TO-DO: Make seperate macro and micro mesh for water
         * with different textures for detail.
         */
    }

    CreateSprite ()
    {
        this.SpriteMesh = new THREE.Sprite(MATERIALS.FindMaterial('Terrain Chunk Icon'))
        this.SpriteMesh.position.set(this.wx, 0, this.wz)
        this.SpriteMesh.scale.setScalar(GAME_SETTINGS.Private.cameraProjection === CONSTANTS.CameraTypes.PERSPECTIVE ? 0.03 : 0.5)

        this.Component.MacroChunksGLGroup.add(this.SpriteMesh)
    }

    async Init (name)
    {
        await this.CreateNoise()
        this.CreateSprite()
        this.CreateMeshes()
        await this.CreateVegetation()
        this.CreateWater()
        this.SetName(name)

        EVENTS.DispatchEvent('chunk creation finished')
    }

    SetMacroVisibility (value)
    {
        if (this.MacroMesh)
            this.MacroMesh.visible = value
    }

    SetName (value)
    {
        this.name = value
        this.MacroMesh.name = value
        this.MicroMesh.name = value
    }

    UpdateSimulation ()
    {
        
    }

    UpdateVisuals ()
    {
        if (this.Component.inMacroView)
        {
            if (this.SpriteMesh)
                this.SpriteMesh.visible = !this.MacroMesh.visible

            if (this.WaterMesh)
                this.WaterMesh.visible = this.MacroMesh.visible
        }
        else
        {
            if (this.WaterMesh)
                this.WaterMesh.visible = true
        }
    }
}

export { TerrainChunk }