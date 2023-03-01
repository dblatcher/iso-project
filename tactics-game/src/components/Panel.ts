import { FunctionalComponent, Fragment } from 'preact';
import { html } from 'htm/preact'
import {CharacterView} from './CharacterView'
import { CharacterFigure } from '../CharacterFigure';
import { CommandType, Team } from '../types';
import { CommandMenu } from './CommandMenu';
import { Action } from '../Action';

interface Props {
    team: Team;
    selectedFigure?: CharacterFigure;
    allFiguresMoved: boolean
    commandType: CommandType
    endTurn: { (): void }
    nextFigure: { (reverse?:boolean): void }
    setCommandType: { (commandType:CommandType):void}
    setFigureAction: {(action:Action):void}
}

const buttonStyle = (highlight: boolean) => ({
    fontWeight: highlight ? 'bold' : 'normal',
})

export const Panel: FunctionalComponent<Props> = ({ 
    team, 
    selectedFigure, 
    endTurn,    
    nextFigure, 
    setCommandType,
    setFigureAction,
    allFiguresMoved,
    commandType
}) => {

    return html`
    <div style=${{
        borderColor:team.color,
        borderWidth: ".25rem",
        borderStyle: "ridge",
        padding: ".25rem",
        flex:1,
    }}>
        <div class="row" style=${{
            borderBottomColor: team.color,
            borderBottomWidth: ".25rem",
            borderBottomStyle: "double",
        }}>
            <span>${team.name}</span>
        </div>

        <div class="row">
            <button style=${buttonStyle(false)} onclick=${() =>{nextFigure(false)}}>NEXT</button>
            <button style=${buttonStyle(false)} onclick=${()=>{nextFigure(true)}}>PREV</button>
        </div>

        ${selectedFigure && html`
            <${Fragment}>
                <${CharacterView} 
                    figure=${selectedFigure} />
                <${CommandMenu} 
                    figure=${selectedFigure} 
                    setCommandType=${setCommandType}
                    commandType=${commandType}
                    setFigureAction=${setFigureAction}/>
            </${Fragment}>
        `}

        <div class="row">
            <button style=${buttonStyle(allFiguresMoved)} onclick=${endTurn}>END OF TURN</button>
        </div>
    </div>
    `
}