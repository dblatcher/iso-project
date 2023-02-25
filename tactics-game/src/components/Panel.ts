import { FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import {CharacterView} from './CharacterView'
import { CharacterFigure } from '../CharacterFigure';
import { Team } from '../Battle';

interface Props {
    team: Team;
    selectedFigure?: CharacterFigure;
    endTurn: { (): void }
    allFiguresMoved: boolean
}

const buttonStyle = (highlight: boolean) => ({
    fontWeight: highlight ? 'bold' : 'normal',
})

export const Panel: FunctionalComponent<Props> = ({ team, selectedFigure, endTurn, allFiguresMoved }) => {

    return html`
    <div>
        <div class="row">
            <span>TEAM: ${team.name}</span>
        </div>
        ${selectedFigure && html`
            <${CharacterView} figure=${selectedFigure}/>
        `}
        <div class="row">
            <button style=${buttonStyle(allFiguresMoved)} onclick=${endTurn}>END OF TURN</button>
        </div>
    </div>
    `
}