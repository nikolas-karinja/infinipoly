import { OCTAVIA, Octavia } from '@little-island/octavia-engine'
import MainMenuState from './states/MainMenu'
import { OCTAVIA_DATA, OCTAVIA_SETTINGS } from '../core'
import NewWorldSettingsState from './states/NewWorldSettings'
import InitNewWorldState from './states/InitNewWorld'
import WorldViewState from './states/WorldView'

const App = () =>
{
    return <>
        <Octavia
            title='Infinipoly'
            data={OCTAVIA_DATA}
            settings={OCTAVIA_SETTINGS}
            onReady={() =>
            {
                OCTAVIA.AssembleGameObject('Main Menu World')

                OCTAVIA.SelectScene('Main Menu')
            }}>
            <MainMenuState />
            <NewWorldSettingsState />
            <InitNewWorldState />
            <WorldViewState />
        </Octavia>
    </>
}

export default App