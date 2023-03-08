import { FunctionalComponent, Fragment } from 'preact';
import { html } from 'htm/preact'
import { Battle } from '../Battle';
import { clockwise, antiClockwise } from '../../../src/CardinalDirection';

interface Props {
    battle: Battle
}

const buttonStyle = (highlight: boolean) => ({
    fontWeight: highlight ? 'bold' : 'normal',
})

export const TurnPanel: FunctionalComponent<Props> = ({
    battle
}) => {


    const rotateClockwise = () => {
        battle.canvas.render(clockwise(battle.canvas.renderOrientation))
    }
    const rotateAntiClockwise = () => {
        battle.canvas.render(antiClockwise(battle.canvas.renderOrientation))
    }


    return html`
    <div>
        <button onclick=${rotateClockwise}>↺</button>
        <button onclick=${rotateAntiClockwise}>↻</button>
    </div>
    `
}