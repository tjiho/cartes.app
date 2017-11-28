import R from 'ramda'
import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'

import './Results.css'
import '../engine/mecanismViews/Somme.css'
import {clearDict} from 'Engine/traverse'
import {encodeRuleName} from 'Engine/rules'
import RuleValueVignette from './rule/RuleValueVignette'
import { humanFigure } from "./rule/RuleValueVignette"

import { capitalise0 } from '../utils'

// Filtered variables and rules can't be filtered in a uniform way, for now
let paidBy = which => R.pathEq(['explanation', 'cotisation','dû par'], which)
let filteredBy = which => R.pathEq(['cotisation','dû par'], which)

export let byName = branch => R.groupBy(R.prop('dottedName'), branch)

export let cell = (branch, payer, analysis) => {
	let row = byBranch(analysis)[branch],
		items = R.filter(item => paidBy(payer)(item) || filteredBy(payer)(item),row),
		values = R.map(R.prop('nodeValue'),items)

	return R.sum(values)
}

export let byBranch = (analysis) => {
	let sal = analysis.dict['contrat salarié . cotisations salariales']
	let pat = analysis.dict['contrat salarié . cotisations patronales']

	let l1 = sal ? sal.explanation.formule.explanation.explanation : [],
		l2 = pat ? pat.explanation.formule.explanation.explanation : [],
		explanations = R.concat(l1, l2),
		byBranch = R.groupBy(R.pathOr('autre',['explanation','cotisation','branche']), explanations)

	return byBranch
}

@withRouter
@connect(
	state => ({
		analysis: state.analysis,
		targetNames: state.targetNames,
		situationGate : state.situationGate
	})
)
export default class ResultsGrid extends Component {
	render() {
		let {
			analysis,
			targetNames,
			situationGate,
			location
		} = this.props

		if (!analysis) return null

		let extract = x => (x && x.nodeValue) || 0,
			fromSituation = name => situationGate(name),
			fromEval = name => R.find(R.propEq('dottedName',name),analysis.targets),
			get = name => extract(fromSituation(name) || fromEval(name))
		let results = byBranch(analysis),
			brut = get('contrat salarié . salaire brut'),
			net = get('contrat salarié . salaire net'),
			total = get('contrat salarié . salaire total')

		return (
			<div className="somme">
			<table>
				<thead>
				<tr>
					<td className="element"></td>
					<td colSpan="2" className="element">{humanFigure(2)(brut)} (salaire brut)</td>
					<td colSpan="2" className="element">{humanFigure(2)(brut)} (salaire brut)</td>
				</tr>
				</thead>
				<tbody>
				{R.keys(results).map(
					branch => {
						let props = {branch, analysis}
						return <Row key={branch} {...props} />
				})}
				<tr>
					<td className="element"></td>
				<td className="operator">=</td>
				<td className="element">{humanFigure(2)(net)} (salaire net)</td>
				<td className="operator">=</td>
				<td className="element">{humanFigure(2)(total)} (salaire total)</td>
				</tr>
				</tbody>
			</table>
			</div>
		)
	}
}

class Row extends Component {
	render() {
		let { branch, analysis } = this.props

		return (
			<tr>
				<td className="element">{capitalise0(branch)}</td>
				<td className="operator">-</td>
				<td className="element">{humanFigure(2)(cell(branch,"salarié",analysis))}</td>
				<td className="operator">+</td>
				<td className="element">{humanFigure(2)(cell(branch,"employeur",analysis))}</td>
			</tr>
		)
	}
}