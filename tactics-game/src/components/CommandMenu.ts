import { FunctionalComponent } from 'preact';
import { html } from 'htm/preact'
import { CharacterFigure } from '../CharacterFigure';
import { CommandType } from '../types';

interface Props {
    figure?: CharacterFigure;
    commandType: CommandType;
    setCommandType: { (commandType:CommandType):void};
}

const buttonStyle = (highlight: boolean) => ({
    fontWeight: highlight ? 'bold' : 'normal',
})


export const CommandMenu: FunctionalComponent<Props> = ({ figure, commandType, setCommandType }) => {
    const { remaining } = figure
    const { move, action } = figure.attributes

    return html`
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
    `
}