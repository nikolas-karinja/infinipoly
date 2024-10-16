import { EVENTS, MATERIALS, OCTAVIA, RENDER } from '@little-island/octavia-engine';
import { OrbitControls } from 'three/addons'
import { GAME_SETTINGS } from '../core';
import * as THREE from 'three'

class WorldLighting extends OCTAVIA.Core.ScriptComponent
{
    constructor (...args)
    {
        super(...args)

        this.Sun = new THREE.DirectionalLight(0xffffff, 1.75)
        this.Hemi = new THREE.AmbientLight(0xffffff, 1.5)
        this.ShadowHelper = null
        this.CameraComponent = this.GetComponent('World Camera')
        this.TerrainComponent = this.GetComponent('Terrain')
    }

    get windowAspect ()
    {
        return window.innerWidth / window.innerHeight
    }

    InitComponent ()
    {
        this.Sun.position.set(20, 20, 20)

        this.Sun.castShadow = true
        this.Sun.shadow.camera.left = -12
        this.Sun.shadow.camera.right = 12
        this.Sun.shadow.camera.top = 12
        this.Sun.shadow.camera.bottom = -12
        this.Sun.shadow.mapSize.width = 2048
        this.Sun.shadow.mapSize.height = 2048
        this.Sun.shadow.camera.near = 0.1
        this.Sun.shadow.camera.far = 50

        EVENTS.AddListener('chunk in view updated', () =>
        {
            const _CIV = this.TerrainComponent.ChunkInView
            const _wx = _CIV.x * this.TerrainComponent.chunkWorldSize
            const _wz = _CIV.y * this.TerrainComponent.chunkWorldSize

            this.Sun.position.set(_wx + 20, 20, _wz + 20)
            this.Sun.target.position.set(_wx, 0, _wz)
        })
    }

    InitGameObject ()
    {
        this.SceneGL.background = MATERIALS.FindTexture('Sky')
        this.SceneGL.environment = MATERIALS.FindTexture('Sky')

        this.SceneGL.add(this.Sun)
        this.SceneGL.add(this.Sun.target)
        this.SceneGL.add(this.Hemi)

        if (this.Options.addShadowHelper)
        {
            this.ShadowHelper = new THREE.CameraHelper(this.Sun.shadow.camera)

            this.SceneGL.add(this.ShadowHelper)
        }
    }

    Destroy ()
    {
        this.SceneGL.remove(this.Sun)
        this.SceneGL.remove(this.Hemi)

        if (this.ShadowHelper)
            this.SceneGL.remove(this.ShadowHelper)
    }
}

export { WorldLighting }