import { CONSTANTS } from '@little-island/octavia-engine'
import * as THREE from 'three'
import { GAME_SETTINGS } from './settings'

export const OCTAVIA_ASSEMBLIES = {
    'World': {
        components: {
            'Camera': {
                type     : GAME_SETTINGS.Private.cameraProjection,
                fov      : 45,
                size     : 40,
                far      : 1000,
                position : new THREE.Vector3(7, 21, 14),
            },
            'Orbit Controls': {
                screenSpacePanning : false,
            },
            'Terrain': {},
            'World Lighting': {},
        }
    },
    'Main Menu World': {
        gameScene: 'Main Menu',
        components: {
            'Camera': {
                fov      : 45,
                position : new THREE.Vector3(0, 1, 1),
            },
            'Main Menu Lighting': {},
            'Main Menu Model': {},
        }
    }
}