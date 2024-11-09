import { Noise } from "./sub/noise.js"

addEventListener('message', (e) =>
{
    const _tx = e.data.tx
    const _ty = e.data.ty
    const _noiseSeed = e.data.seed
    const _noiseAmplitude = e.data.na
    const _noiseAmplitudeCoef = e.data.nac
    const _noiseFrequency = e.data.nf
    const _noiseFrequencyCoef = e.data.nfc
    const _chunkCellCount = e.data.ccc
    const _chunkMacroScale = e.data.cms
    
    const _vC = (_chunkCellCount * _chunkMacroScale) + 1 // vertex count
    const _heightsMicro = []
    const _heightsMacro = []
    const _cellHeights = []

    Noise.seed(_noiseSeed)

    let _amplitude = 0
    let _frequency = 0

    for (let y = 0; y < _vC; y++)
    {
        _heightsMacro.push([])

        if (y % _chunkMacroScale === 0)
            _heightsMicro.push([])

        for (let x = 0; x < _vC; x++)
        {
            _amplitude = _noiseAmplitude;
            _frequency = _noiseFrequency;
            
            let _value = 0

            const _valX = ((_tx * (_vC - 1)) + x)
            const _valY = ((_ty * (_vC - 1)) + y)
2
            // compute noise value with 5 octaves
            for (let k = 0; k < 5; k++) 
            {
                let _n = Noise.simplex2(_valX / _frequency, _valY / _frequency)
                _value += _amplitude * _n;
                _amplitude *= _noiseAmplitudeCoef;
                _frequency *= _noiseFrequencyCoef;
            }

            _heightsMacro[y][x] = _value

            if (y % _chunkMacroScale === 0 &&
                x % _chunkMacroScale === 0)
                _heightsMicro[y / _chunkMacroScale][x / _chunkMacroScale] = _value
        }
    }

    // calc cell heights
    for (let y = 0; y < _vC - 1; y++)
    {
        _cellHeights.push([])

        for (let x = 0; x < _vC - 1; x++)
        {
            const _heights = []

            _heights.push(_heightsMacro[y][x],
                _heightsMacro[y][x + 1],
                _heightsMacro[y + 1][x],
                _heightsMacro[y + 1][x + 1]
            )

            _cellHeights[y][x] = Math.min(..._heights)
        }
    }

    postMessage({
        cellHeights: _cellHeights,
        macro: _heightsMacro,
        micro: _heightsMicro,
    })
})