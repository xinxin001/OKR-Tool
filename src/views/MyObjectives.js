import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import Objective from '../components/Objective/Objective'
import SaveButton from '../components/Buttons/SaveButton'


export default class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state={
		  objectives:[],
		  keyobjectives:[],
		  user: '',
		  fullname: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	
	componentDidMount() {
		axios.get('/obj')
		.then(res => {
			this.setState( {objectives: res.data.recordset} )
		})

		axios.get('/keyobj')
		.then(res => {
			this.setState( {keyobjectives: res.data.recordset} )
		})

		axios.get('http://localhost:5000/username', {withCredentials: true, headers: {
            'Content-Type' : 'application/json',    
            }})
		.then(res => {
			let user = res.data.slice()
			this.setState( {user: user} )
			console.log(this.state.user)
		})
		.then(() => {
			axios.post('/getusername', {
				user: this.state.user
			})
			.then(res => {
				console.log(res)
				this.setState( {
					fullname: res.data.recordset[0].firstname + ' ' + res.data.recordset[0].lastname 
				 } )
			})
		})
	}

	findKeyObjectives(id) {
		return this.state.keyobjectives.filter((keyobjective) => {
			return keyobjective.id == id
		})
	}

	handleSliderChange = (e, value, keyid, id) => {
		let newKeyObjectives = this.state.keyobjectives.slice()
		let index = newKeyObjectives.findIndex(element => element.keyid == keyid)
		let lastupdate = new Date().toLocaleString()
		newKeyObjectives[index].progress = value
		newKeyObjectives[index].lastupdate = lastupdate
		
		this.setState( {
			keyobjectives: newKeyObjectives,
		 }, () => {
			console.log(lastupdate)
			this.updateOverallProgress(id)
		 })
	}

	handleConfidenceSliderChange = (e, value, keyid, id) => {
		let newKeyObjectives = this.state.keyobjectives.slice()
		let index = newKeyObjectives.findIndex(element => element.keyid == keyid)
		let lastupdate = new Date().toLocaleString()
		newKeyObjectives[index].confidence = value
		newKeyObjectives[index].lastupdate = lastupdate
		
		this.setState( {
			keyobjectives: newKeyObjectives,
		 })
	}

	updateOverallProgress = (id) => {
		let newObjectives = this.state.objectives.slice()
		let index = newObjectives.findIndex(element => element.id == id)
		
		let keyobjectives = this.findKeyObjectives(id)

		let overallProgress = keyobjectives.reduce((a,b) => (a + b.progress/b.goalnumber), 0)
		let overallProgressRatio = Math.round((overallProgress/keyobjectives.length)*100)
		let lastupdate = new Date().toLocaleString()
		newObjectives[index].progress = overallProgressRatio
		newObjectives[index].lastupdate = lastupdate
		
		this.setState( {
			objectives: newObjectives
		} )
	}

	makeObjective() {
		return this.state.objectives.map((objective) => (
			<Objective 
			objectivename={objective.name} 
			supervisor={objective.supervisor} 
			keyobjectiveowner={this.state.fullname} 
			progress={objective.progress}
			keyobjectives={this.findKeyObjectives(objective.id)}
			lastupdate={objective.lastupdate}
			quarter={objective.quarter}
			onChange={this.handleSliderChange}
			onChangeConfidence={this.handleConfidenceSliderChange}
			/>
		))
	}

	handleSubmit(e) {
		e.preventDefault()
		alert("Saved Successfully")
		
		axios.post('/updateprog', {
			objectives: this.state.objectives,
			keyobjectives: this.state.keyobjectives
		})
	}


	render() {
		return(
			<>
				<h1>Hello {this.state.fullname}, here are your OKR Objectives:</h1>
				<Grid container justify="space-evenly">
					{this.makeObjective()}
				</Grid>
				<form onSubmit={this.handleSubmit}> 
				<SaveButton 
				text={"Save Changes"}
				type={"Submit"}
				/>
				</form>
			</>
		)
	}
}
