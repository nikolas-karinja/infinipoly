import { MATERIALS, TIME } from "@little-island/octavia-engine";
import { GAME_SETTINGS } from ".";
import { SHADER_FRAGMENTS } from "./shaderFragments";
import * as THREE from 'three'

export const OCTAVIA_MATERIALS = {
    'Terrain': {
        type: 'MeshPhong',
        options: {
            flatShading: true,
            onBeforeCompile: (shader) =>
            {
    			shader.vertexShader = shader.vertexShader.replace(
        			`#include <common>`,
        			`#include <common>

      				varying float y;
      				varying float x;
      				varying float z;
      			`);
      			shader.vertexShader = shader.vertexShader.replace(
        			`#include <begin_vertex>`,
        			`#include <begin_vertex>

      				y = ( position.z + 0.1 ) * 5.0;
      			`);
      /**     x = ( position.x + 0.1 ) * 5.0;
      z = ( position.z + 0.1 ) * 5.0;
      transformed.y = x > 110. || z > 110. ? -10. : transformed.y; */
      // Fragment Shader
  
      			shader.fragmentShader = shader.fragmentShader.replace(
        			`#include <common>`,
					`#include <common>

      				varying float y;
      				vec3 col;
      			`);
  
      			const colors = {
        			grass: `vec3(0.373,0.451,0.263)`,
        			grass2: `vec3 (0.282,0.412,0.102)`,
        			snow: `vec3(1.0, 1.0, 1.0)`,
        			dirt: `vec3(0.4,0.38,0.337)`,
        			sand: `vec3(0.918,0.808,0.416)`,
        			clay: `vec3(0.388,0.333,0.212)`,
      			}
  
      			shader.fragmentShader = shader.fragmentShader.replace(
        			`#include <dithering_fragment>`,
        			`#include <dithering_fragment>
  
      				float alpha = smoothstep(0.0, 1.0, y);

					float colorMix1 = smoothstep(-2., .1, y);
    				float colorMixA = smoothstep(1., 2., y);
    				float colorMixB = smoothstep(2., 5., y);
    				float colorMixC = smoothstep(5., 8., y);
    				float colorMixD = smoothstep(10., 12., y);

    				col = ${colors.clay};

					if (y > -2.)
						col = mix(${colors.clay}, ${colors.sand}, colorMix1);
					if (y > 1.)
						col = mix(${colors.sand}, ${colors.grass}, colorMixA) * alpha;
					if (y > 2.)
      					col = mix(${colors.grass}, ${colors.grass2}, colorMixB) * alpha;
   	 				if (y > 5.)
      					col = mix(${colors.grass2}, ${colors.dirt}, colorMixC) * alpha;
    				if (y > 10.)
      					col = mix(${colors.dirt}, ${colors.snow}, colorMixD) * alpha;
  
    				outgoingLight *= col;
    				gl_FragColor = vec4(outgoingLight, diffuseColor.a);
      			`);
            }
        },
    },
    'Terrain Water': {
        type: 'MeshStandard',
        options: {
            flatShading: true,
            opacity: 0.7,
            transparent: true,
            // shininess: 500,
            roughness: 0,
            metalness: 1,
            envMapIntensity: 100,
            onBeforeCompile: (shader) =>
            {
                shader.uniforms.uTime= TIME.Uniform
				shader.uniforms.uColor = {value: new THREE.Color(0x3499ff)}
				shader.uniforms.uTexLayer1 = {value: MATERIALS.FindTexture('Water Layer 1')}
				shader.uniforms.uTexLayer2 = {value: MATERIALS.FindTexture('Water Layer 2')}
        
                shader.vertexShader = `
					varying vec2 vUv;
                    uniform float uTime;

                    ${SHADER_FRAGMENTS.simplex4d}
                    ${shader.vertexShader}
                `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>

					vUv = uv;

                    float t = uTime * 0.25;
                    vec3 pos1 = position;
                    float n1 = snoise(vec4(pos1 * 5., t));
                
                    pos1.z += n1 * 0.025;
                
                    transformed = pos1;
                `)

                shader.fragmentShader = `
					varying vec2 vUv;
					uniform sampler2D uTexLayer1;
					uniform sampler2D uTexLayer2;
					uniform vec4 uColor;
					uniform float uTime;

					// get time-affected uv
                    vec2 gtauv(float multX, float multY, float speed)
                    {
                        return vUv + (vec2(uTime * multX, uTime * multY) * speed);
                    }

                    ${shader.fragmentShader}
                `.replace(
                	`#include <map_fragment>`,
                    `#include <map_fragment>

					vec4 color_texLayer1 = texture2D(uTexLayer1, gtauv(-1., -1., 0.01));
					vec4 color_texLayer2 = texture2D(uTexLayer2, gtauv(1., -1., 0.04));

					vec3 color_texLayers = mix(color_texLayer1.rgb, color_texLayer2.rgb, 0.25);

					diffuseColor.rgb = mix(uColor.rgb, color_texLayers, 0.05);
                `)
            }
        },
    },
	'Terrain Chunk Icon': {
		type: 'Sprite',
		options: {
			map: 'Terrain Chunk Icon',
			sizeAttenuation: false,
		}
	}
}