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
    'Atmosphere': {
        components: {
            'Light': {
                type      : CONSTANTS.Lights.AMBIENT_TYPE,
                intensity : 1.5,
                position  : new THREE.Vector3(0, 100, 0),
            },
        }
    },
    'Sun': {
        components: {
            'Light': {
                type      : CONSTANTS.Lights.DIRECTIONAL_TYPE,
                intensity : 1.75,
                position  : new THREE.Vector3(20, 20, 20),
            },
        }
    },
    'Main Menu World': {
        gameScene: 'Main Menu',
        components: {
            'Camera': {
                fov      : 45,
                position : new THREE.Vector3(0, 1, 1),
            },
            // 'Main Menu Lighting': {},
            // 'Light': {
            //     type      : CONSTANTS.Lights.DIRECTIONAL_TYPE,
            //     intensity : 1.75,
            //     position  : new THREE.Vector3(20, 20, 20),
            // },
            'Main Menu Model': {},
        }
    }
}