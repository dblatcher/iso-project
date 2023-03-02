import { Action, ActionRange } from "../Action";

const wait = new Action('wait', ActionRange.Self)
const jump = new Action('jump', ActionRange.Close)

export const ACTIONS = { wait, jump }
