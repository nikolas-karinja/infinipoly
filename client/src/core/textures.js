import * as THREE from 'three'
import tex_water from '../img/tex/water.png'
import tex_hdriSky from '../img/tex/hdri_sky.jpg'
import tex_terrainChunkIcon from '../img/tex/terrain_chunk_icon.png'

export const OCTAVIA_TEXTURES = {
    'Water Layer 1': {
        url: tex_water,
        options: {
            minFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping, 
            wrapT: THREE.RepeatWrapping, 
            repeat: [1, 1]
        },
    },
    'Water Layer 2': {
        url: tex_water,
        options: {
            minFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping, 
            wrapT: THREE.RepeatWrapping, 
            repeat: [2, 2]
        },
    },
    'Sky': {
        url: tex_hdriSky,
        options: {
            mapping: THREE.EquirectangularReflectionMapping,
        }
    },
    'Terrain Chunk Icon': {
        url: tex_terrainChunkIcon,
        options: {
            magilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            colorSpace: THREE.SRGBColorSpace,
        }
    }
}