import { FunctionalComponent, Fragment } from 'preact';
import { html } from 'htm/preact'
import {CharacterView} from './CharacterView'
import { CharacterFigure } from '../../CharacterFigure';
import { CommandType, Team } from '../../types';
import { CommandMenu } from './CommandMenu';
import { Action } from '../../Action';

interface Props {
    team: Team;
    selectedFigure?: CharacterFigure;
    commandType: CommandType
    setCommandType: { (commandType:CommandType):void}
    setFigureAction: {(action:Action):void}
}


export const Panel: FunctionalComponent<Props> = ({
    team,
    selectedFigure,
    commandType,
    setCommandType,
    setFigureAction,
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
    </div>
    `
}
