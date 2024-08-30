import { EVENTS, MATERIALS, OCTAVIA } from '@little-island/octavia-engine';
import * as THREE from 'three'

class MainMenuLighting extends OCTAVIA.Core.GameObjectComponent
{
    constructor (...args)
    {
        super(...args)

        this.Sun = new THREE.DirectionalLight(0xffffff, 1.75)
        this.Hemi = new THREE.AmbientLight(0xffffff, 1.5)
        this.ShadowHelper = null
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

        this.Sun.position.set(20, 20, 20)
    }

    InitGameObject ()
    {
        this.SceneGL.background = MATERIALS.FindTexture('Sky')
        this.SceneGL.environment = MATERIALS.FindTexture('Sky')

        this.SceneGL.add(this.Sun)
        this.SceneGL.add(this.Sun.target)
        this.SceneGL.add(this.Hemi)
    }

    Destroy ()
    {
        this.SceneGL.remove(this.Sun)
        this.SceneGL.remove(this.Hemi)

        if (this.ShadowHelper)
            this.SceneGL.remove(this.ShadowHelper)
    }
}

export { MainMenuLighting }