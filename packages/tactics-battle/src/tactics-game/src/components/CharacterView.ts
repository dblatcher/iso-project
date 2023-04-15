import { FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import { CharacterFigure } from '../../CharacterFigure';

interface Props {
    figure?: CharacterFigure;
}

export const CharacterView: FunctionalComponent<Props> = ({ figure }) => {
    const { sprite, remaining } = figure
    const { name, health } = figure.attributes

    return html`
    <div class="row">
        <div>
            <p>${name}</p>
            <p>${remaining.health} / ${health} health</p>
        </div>
        <img src=${sprite.frontImage[0]} height=50 />
    </div>
    `
}
