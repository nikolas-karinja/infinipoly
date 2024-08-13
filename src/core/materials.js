import { TIME } from "@little-island/octavia-engine";
import { GAME_SETTINGS } from ".";
import { SHADER_FRAGMENTS } from "./shaderFragments";

export const OCTAVIA_MATERIALS = {
    'Terrain': {
        type: 'MeshPhong',
        options: {
            color: 0x92af5e,
            flatShading: true,
            // wireframe: true,
        },
    },
    'Terrain Water': {
        type: 'MeshPhong',
        options: {
            color: 0xb6e3db,
            flatShading: true,
            opacity: 0.65,
            transparent: true,
            shininess: 500,
            onBeforeCompile: (shader) =>
            {
                shader.uniforms.time = TIME.Uniform
        
                shader.vertexShader = `
                    uniform float time;
                    ${SHADER_FRAGMENTS.simplex4d}
                    ${shader.vertexShader}
                `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>

                    float t = time * 0.3;
                    vec3 pos1 = position;
                    float n1 = snoise(vec4(pos1 * 5., t));
                
                    pos1.z += n1 * 0.025;
                
                    transformed = pos1;
                    `)
            }
        },
    },
}