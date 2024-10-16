import { EVENTS, MATERIALS, OCTAVIA } from '@little-island/octavia-engine';
import * as THREE from 'three'
import { TerrainWaterGeometry } from './subclasses/TerrainWaterGeometry';

class MainMenuModel extends OCTAVIA.Core.ScriptComponent
{
    constructor (...args)
    {
        super(...args)

        this.WaterMesh = null
    }

    CreateWater ()
    {
        const _Geo = new TerrainWaterGeometry(0, 0, 4, 4, 32, 32)
        const _Mat = MATERIALS.FindMaterial('Terrain Water')

        this.WaterMesh = new OCTAVIA.Core.Mesh(_Geo, _Mat)
        this.WaterMesh.rotateX(Math.PI / -2)

        this.SceneGL.add(this.WaterMesh)
    }

    InitGameObject ()
    {
        this.CreateWater()
    }

    Destroy ()
    {
        if (this.WaterMesh)
            this.SceneGL.remove(this.WaterMesh)
    }
}

export { MainMenuModel }