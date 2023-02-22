import { FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import { CharacterFigure } from '../CharacterFigure';
import { Team } from '../Battle';

interface Props {
    team: Team;
    selectedFigure?: CharacterFigure;
    endTurn: { (): void }
}

export const Panel: FunctionalComponent<Props> = ({ team, selectedFigure, endTurn }) => {
    return html`
    <div>
        <div class="row">
            <span>TEAM: ${team.name}</span>
            <button onclick=${endTurn}>END OF TURN</button>
        </div>
        ${selectedFigure && html`
        <div class="row">
            <p>
                ${selectedFigure.remainingMoves} / ${selectedFigure.attributes.move} moves
            </p>
            <img src=${selectedFigure.sprite.frontImage} height=50 />
        </div>
        `}
    </div>
    `
}