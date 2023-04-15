import { Fragment, FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import { CharacterFigure } from '../../CharacterFigure';
import { CommandType } from '../../types';
import { Action } from '../../Action';

interface Props {
    figure?: CharacterFigure;
    commandType: CommandType;
    setCommandType: { (commandType:CommandType):void};
    setFigureAction: {(action:Action):void};
}

const buttonStyle = (highlight: boolean) => ({
    fontWeight: highlight ? 'bold' : 'normal',
})


export const CommandMenu: FunctionalComponent<Props> = ({ figure, commandType, setCommandType, setFigureAction }) => {
    const { remaining, availableActions } = figure
    const { move, action } = figure.attributes

    return html`
    <${Fragment}>
    <div class="row">
        <button
            style="${buttonStyle(commandType === 'ACTION')}"
            onclick=${()=>{setCommandType('ACTION')}}
            >
            ${remaining.action} / ${action} action
        </button>
        <button
            style="${buttonStyle(commandType === 'MOVE')}"
            onclick=${()=>{setCommandType('MOVE')}}
        >
            ${remaining.move} / ${move} moves
        </button>

    </div>
    ${commandType==='ACTION' && html`
    <div class="row">
        <ul>
            ${availableActions.map(action => html`
            <li>
                <button
                    onclick=${()=>{setFigureAction(action)}}
                    style="${buttonStyle(figure.selectedAction?.name === action.name)}"
                >${action.name}</button>
            </li>
            `)}
        </ul>
    </div>
    `}
    </${Fragment}>
    `
}
