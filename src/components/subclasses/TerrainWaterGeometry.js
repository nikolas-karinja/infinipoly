import * as THREE from 'three'
import { GAME_SETTINGS } from '../../core';

class TerrainWaterGeometry extends THREE.BufferGeometry 
{
	constructor(tx, ty, width, height, widthSegments, heightSegments) 
    {
		super();

		this.type = 'TerrainWaterGeometry';
        this.tx = tx
        this.ty = ty

		this.parameters = {
            tx: tx,
            ty: ty,
			width: width,
			height: height,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
		};

		const width_half = width / 2;
		const height_half = height / 2;

		const gridX = Math.floor( widthSegments );
		const gridY = Math.floor( heightSegments );

		const gridX1 = gridX + 1;
		const gridY1 = gridY + 1;

		const segment_width = width / gridX;
		const segment_height = height / gridY;

		//

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		for (let iy = 0; iy < gridY1; iy ++)
        {
			const y = iy * segment_height - height_half;

			for (let ix = 0; ix < gridX1; ix ++) 
            {
				const x = ix * segment_width - width_half;

                let vtx = x + (tx * ((GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro) * GAME_SETTINGS.Private.chunkCellSize))
                let vty = y + (ty * ((GAME_SETTINGS.Private.chunkCellsMicro * GAME_SETTINGS.Private.chunkScaleMacro) * GAME_SETTINGS.Private.chunkCellSize))

				vertices.push( vtx, - vty, 0 );

				normals.push( 0, 0, 1 );

				uvs.push( ix / gridX );
				uvs.push( 1 - ( iy / gridY ) );
			}
		}

		for (let iy = 0; iy < gridY; iy ++) 
        {
			for (let ix = 0; ix < gridX; ix ++) 
            {
				const a = ix + gridX1 * iy;
				const b = ix + gridX1 * ( iy + 1 );
				const c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				const d = ( ix + 1 ) + gridX1 * iy;

				if ( iy % 2 === 0 ) 
                {
                    if ( ix % 2 === 0 ) 
                    {
                        indices.push( a, b, d )
                        indices.push( b, c, d )
                    } 
                    else 
                    {
                        indices.push( a, b, c )
                        indices.push( a, c, d )
                    }
                } 
                else 
                {
                    if ( ix % 2 !== 0 ) 
                    {
                        indices.push( a, b, d )
                        indices.push( b, c, d )
                    } 
                    else 
                    {
                        indices.push( a, b, c )
                        indices.push( a, c, d )
                    }
                }
			}
		}

		this.setIndex( indices );
		this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
		this.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
	}

	static fromJSON (data) 
    {
		return new TerrainWaterGeometry( data.width, data.height, data.widthSegments, data.heightSegments, data.heightArray );
	}
}

export { TerrainWaterGeometry }