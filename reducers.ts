import { defaultTo, omit } from 'Components/utils/utils'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'

type DottedName = string

function explainedVariable(
	state: DottedName | null = null,
	action: Action
): DottedName | null {
	switch (action.type) {
		case 'EXPLAIN_VARIABLE':
			return action.variableName || null
		default:
			return state
	}
}

type QuestionsKind =
	| "à l'affiche"
	| 'non prioritaires'
	| 'liste'
	| 'liste noire'

export type SimulationConfig = {
	situation: Simulation['situation']
	bloquant?: Array<DottedName>
	questions?: Partial<Record<QuestionsKind, Array<DottedName>>>
	branches?: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unité par défaut': string
}

type Situation = Partial<Record<DottedName, any>>
export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenNotifications: Array<string>
	situation: Situation
	initialSituation: Situation
	foldedSteps: Array<DottedName>
	unfoldedStep?: DottedName | null
	messages: Object
}

function simulation(
	stateRaw: Simulation | null = {},
	action: Action
): Simulation | null {
	const state = stateRaw || {}
	if (action.type === 'SET_MESSAGE_READ') {
		return {
			...state,
			messages: { ...state.messages, [action.message]: true },
		}
	}

	switch (action.type) {
		case 'HIDE_NOTIFICATION':
			return {
				...state,
				hiddenNotifications: [...state.hiddenNotifications, action.id],
			}
		case 'RESET_SIMULATION':
			return {
				...state,
				hiddenNotifications: [],
				situation: state.initialSituation,
				messages: {},
			}
		case 'UPDATE_SITUATION': {
			console.log('SALUTOI', action)
			const situation = state.situation
			const { fieldName: dottedName, value } = action
			return {
				...state,
				situation:
					value === undefined
						? omit([dottedName], situation)
						: {
								...situation,
								[dottedName]: value,
						  },
			}
		}
	}
	return state
}
function rules(state = null, { type, rules }) {
	if (type === 'SET_RULES') {
		return rules
	} else return state
}

function tutorials(state = {}, { type, id }) {
	if (type === 'SKIP_TUTORIAL') {
		return { ...state, [id]: 'skip' }
	} else if (type === 'RESET_TUTORIALS') {
		return {}
	} else return state
}

function scenario(state = 'B', action) {
	if (action.type === 'SET_SCENARIO') {
		return action.scenario
	} else return state
}

function batchUpdateSituationReducer(state: RootState, action: Action) {
	if (action.type !== 'BATCH_UPDATE_SITUATION') {
		return state
	}
	return Object.entries(action.situation).reduce<RootState | null>(
		(newState, [fieldName, value]) => {
			return mainReducer(newState ?? undefined, {
				type: 'UPDATE_SITUATION',
				fieldName,
				value,
			})
		},
		state
	)
}

function exemple(state = null, action) {
	if (action.type !== 'SET_EXEMPLE') return state
	return action.exemple
}

const mainReducer = (state: any, action: Action) =>
	combineReducers({
		explainedVariable,
		// We need to access the `rules` in the simulation reducer
		simulation: (a: Simulation | null = null, b: Action): Simulation | null =>
			simulation(a, b),
		previousSimulation: defaultTo(null),
		rules,
		iframeOptions: defaultTo(null),
		tutorials,
		scenario,
		exemple,
	})(state, action)

export default reduceReducers<RootState>(
	mainReducer as any,
	batchUpdateSituationReducer as Reducer<RootState>
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
