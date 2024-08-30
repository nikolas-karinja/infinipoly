import { OCTAVIA, RENDER } from '@little-island/octavia-engine';
import { OrbitControls } from 'three/addons'
import { GAME_SETTINGS } from '../core';
import * as THREE from 'three'

class MainMenuCamera extends OCTAVIA.Core.GameObjectComponent
{
    constructor (...args)
    {
        super(...args)

        this.Camera = new THREE.PerspectiveCamera(45, this.windowAspect, 0.01, 1000)
        this.Controls = new OrbitControls(this.Camera, OCTAVIA.InterfaceUtils.getGameElement())
    }

    get windowAspect ()
    {
        return window.innerWidth / window.innerHeight
    }

    InitComponent ()
    {
        // setup camera
        this.Camera.position.set(0, 1, 1)

        RENDER.SetCamera(this.Camera)

        // setup controls
        this.Controls.screenSpacePanning = false
        this.Controls.enablePan = false
        this.Controls.enableRotate = false
        this.Controls.enableZoom = false
    }

    Update ()
    {
        this.Controls.update()

        GAME_SETTINGS.Private.currentZoomLevel = this.Controls.getDistance()
    }
}

export { MainMenuCamera }