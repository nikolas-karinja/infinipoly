import { EVENTS, MATERIALS, OCTAVIA, RENDER } from '@little-island/octavia-engine';
import { OrbitControls } from 'three/addons'
import { GAME_SETTINGS } from '../core';
import * as THREE from 'three'

class WorldLighting extends OCTAVIA.Core.ScriptComponent
{
    constructor (...args)
    {
        super(...args)

        // this.CameraComponent
        this.SunLightComponent = this.FindGameObject('Sun').GetComponent('Light')
        this.CameraComponent = this.GetComponent('Camera')
        this.TerrainComponent = this.GetComponent('Terrain')
    }

    InitComponent ()
    {
        this.SunLightComponent.Light.castShadow = true
        this.SunLightComponent.Light.shadow.camera.left = -12
        this.SunLightComponent.Light.shadow.camera.right = 12
        this.SunLightComponent.Light.shadow.camera.top = 12
        this.SunLightComponent.Light.shadow.camera.bottom = -12
        this.SunLightComponent.Light.shadow.mapSize.width = 2048
        this.SunLightComponent.Light.shadow.mapSize.height = 2048
        this.SunLightComponent.Light.shadow.camera.near = 0.1
        this.SunLightComponent.Light.shadow.camera.far = 50

        EVENTS.AddListener('chunk in view updated', () =>
        {
            const _CIV = this.TerrainComponent.ChunkInView
            const _wx = _CIV.x * this.TerrainComponent.chunkWorldSize
            const _wz = _CIV.y * this.TerrainComponent.chunkWorldSize

            this.SunLightComponent.SetPositionXYZ(_wx + 20, 20, _wz + 20)
            this.SunLightComponent.SetTargetPositionXYZ(_wx, 0, _wz)
        })
    }
}

export { WorldLighting }