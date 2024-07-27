import { OCTAVIA, RENDER } from '@little-island/octavia-engine';
import { OrbitControls } from 'three/addons'
import { GAME_SETTINGS } from '../core';

class WorldCamera extends OCTAVIA.Core.GameObjectComponent
{
    constructor (...args)
    {
        super(...args)

        this.Camera = new OCTAVIA.Three.PerspectiveCamera(45, this.windowAspect, 0.01, 1000)
        this.Controls = new OrbitControls(this.Camera, OCTAVIA.InterfaceUtils.getGameElement())
    }

    get windowAspect ()
    {
        return window.innerWidth / window.innerHeight
    }

    InitComponent ()
    {
        // setup camera
        this.Camera.position.set(14, 21, 14)

        RENDER.SetCamera(this.Camera)

        // setup controls
        this.Controls.screenSpacePanning = false
        // this.Controls.mouseButtons.LEFT = null
        this.Controls.mouseButtons.MIDDLE = OCTAVIA.Three.MOUSE.PAN
        this.Controls.mouseButtons.RIGHT = null
    }

    Update ()
    {
        this.Controls.update()

        GAME_SETTINGS.Private.currentZoomLevel = this.Controls.getDistance()
    }
}

export { WorldCamera }