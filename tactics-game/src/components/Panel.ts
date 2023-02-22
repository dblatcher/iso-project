import { FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import { CharacterFigure } from '../CharacterFigure';
import { Team } from '../Battle';

interface Props {
    team: Team;
    selectedFigure?: CharacterFigure;
}

export const Panel: FunctionalComponent<Props> = ({ team, selectedFigure }) => {
    return html`
    <div>
        <p>TEAM: ${team.name}</p>
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