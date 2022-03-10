import Engine from 'publicodes'
import { Documentation } from 'publicodes-react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import RuleInput from 'Components/conversation/RuleInput'
import Emoji from '../../../components/Emoji'
import { DocumentationStyle } from '../pages/Documentation'

const req = require.context('./', true, /\.(yaml)$/)
const rules = req.keys().reduce((memo, key) => {
	const jsonRuleSet = req(key) || {}
	const splitName = key.replace('./', '').split('>.yaml')
	const prefixedRuleSet =
		splitName.length > 1
			? Object.fromEntries(
					Object.entries(jsonRuleSet).map(([k, v]) => [
						k === 'index' ? splitName[0] : splitName[0] + ' . ' + k,
						v,
					])
			  )
			: jsonRuleSet
	return { ...memo, ...prefixedRuleSet }
}, {})

console.log(rules)

const engine = new Engine(rules)
const SituationContext = createContext({})
export default ({}) => {
	const [situation, setSituation] = useState({})
	return (
		<SituationContext.Provider value={[situation, setSituation]}>
			<Main />
			<br />
			<br />
			<br />
			<DocumentationStyle>
				<h2>Explications</h2>
				<Documentation engine={engine} documentationPath={'/carburants'} />
			</DocumentationStyle>
		</SituationContext.Provider>
	)
}
const Main = ({}) => (
	<div className="ui__ container">
		<p
			css={`
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				img {
					font-size: 400%;
				}
				h1 {
					margin-top: 1rem;
					max-width: 80%;
				}
			`}
		>
			<Emoji e="⛽️" />
			<h1 css="">Prix à la pompe 2022</h1>
		</p>
		<p>
			Comprendre comment le prix de l'essence et du gazole à la pompe est
			calculé.
		</p>
		<Questions />
	</div>
)

const Questions = ({}) => {
	const questions = ['groupe', 'voiture', 'consommation de services', 'cabine']
	const [situation, setSituation] = useContext(SituationContext)
	engine.setSituation(situation) // I don't understand why putting this in a useeffect produces a loop when the input components, due to Input's debounce function I guess.
	const onChange = (dottedName) => (raw) => {
			console.log(raw, situation, dottedName)
			const value = raw.valeur || raw
			const newSituation = (situation) => ({
				...situation,
				[dottedName]: value,
			})
			setSituation((situation) => newSituation(situation))
		},
		onSubmit = () => null
	const evaluation = engine.evaluate('prix à la pompe')

	if (!evaluation.nodeValue) return <p>Problème de calcul.</p>

	return (
		<div
			css={`
				@media (min-width: 800px) {
					display: flex;
					align-items: center;
				}
			`}
		>
			<div>
				<div className="ui__ card box">
					<h2 css="margin: .4rem; font-size: 125%">{evaluation.title}</h2>
					<strong>
						{evaluation.nodeValue.toLocaleString('fr-FR')} € / litre
					</strong>
				</div>

				<details css="text-align: center">
					<summary>Ma situation</summary>

					<ul>
						{Object.entries(situation).map(([k, v]) => (
							<li>{`${k} : ${v?.nodeValue || v}`}</li>
						))}
					</ul>
				</details>
			</div>
		</div>
	)
}
