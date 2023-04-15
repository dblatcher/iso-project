import { FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import { Battle } from '../../Battle';
import { clockwise, antiClockwise } from '@isogrid/map-canvas';

interface Props {
    battle: Battle
}

const buttonStyle = (highlight: boolean) => ({
    fontWeight: highlight ? 'bold' : 'normal',
})

export const TurnPanel: FunctionalComponent<Props> = ({
    battle
}) => {

    const { allFiguresMoved} = battle
    const nextFigure= (reverse = false) => { battle.selectNextFigureWithMoves(reverse) };


    const rotateClockwise = () => {
        battle.canvas.render(clockwise(battle.canvas.renderOrientation))
    }
    const rotateAntiClockwise = () => {
        battle.canvas.render(antiClockwise(battle.canvas.renderOrientation))
    }
    const endBattleTurn = () => {
        battle.endTurn.apply(battle,[])
    }


    return html`
    <div>
        <div class="row">
            <button onclick=${rotateClockwise}>↺</button>
            <button onclick=${rotateAntiClockwise}>↻</button>
        </div>

        <div class="row">
            <button style=${buttonStyle(false)} onclick=${() =>{nextFigure(false)}}>NEXT</button>
            <button style=${buttonStyle(false)} onclick=${()=>{nextFigure(true)}}>PREV</button>
        </div>

        <div class="row">
            <button style=${buttonStyle(allFiguresMoved)} onclick=${endBattleTurn}>END OF TURN</button>
        </div>
    </div>
    `
}
