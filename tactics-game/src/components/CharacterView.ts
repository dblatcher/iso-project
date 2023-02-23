import { FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import { CharacterFigure } from '../CharacterFigure';

interface Props {
    figure?: CharacterFigure;
}


export const CharacterView: FunctionalComponent<Props> = ({ figure }) => {

    const { sprite, remainingMoves } = figure
    const { name, move } = figure.attributes

    return html`
    <div class="row">
        <div>
            <p>${name}</p>
            <p>${remainingMoves} / ${move} moves</p>
        </div>
        <img src=${sprite.frontImage} height=50 />
    </div>
    `
}