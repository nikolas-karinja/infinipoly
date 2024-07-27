import { Octavia } from '@little-island/octavia-engine'
import MainMenuState from './states/MainMenu'
import { OCTAVIA_DATA, OCTAVIA_SETTINGS } from '../core'
import NewWorldSettingsState from './states/NewWorldSettings'
import InitNewWorldState from './states/InitNewWorld'

const App = () =>
{
    return <>
        <Octavia
            title='Infinipoly'
            data={OCTAVIA_DATA}
            settings={OCTAVIA_SETTINGS}>
            <MainMenuState />
            <NewWorldSettingsState />
            <InitNewWorldState />
        </Octavia>
    </>
}

export default App