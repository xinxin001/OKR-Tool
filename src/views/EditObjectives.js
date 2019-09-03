import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import Objective from '../components/Objective/Objective'
import SaveButton from '../components/Buttons/SaveButton'


export default class EditObjectives extends Component {
	constructor(props) {
		super(props)
		this.state={
		  objectives:[],
		  keyobjectives:[],
		  deletedobjectives:[],
		  deletedkeyobjectives:[],
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
		newKeyObjectives[index].progress = value
		
		this.setState( {keyobjectives: newKeyObjectives }, this.updateOverallProgress(id))
	}
	
	deleteObjective = (id) => {
		let objective = this.state.objectives.filter((objective) => objective.id == id)
		let foundKeyResults = this.state.keyobjectives.filter((keyobjective) => keyobjective.id == objective[0].id)
		if(foundKeyResults.length == 0) {
			let deletedobjectives = this.state.deletedobjectives.concat(objective[0])
			this.setState({
				deletedobjectives: deletedobjectives,
				objectives: [...this.state.objectives.filter((objective) => objective.id !== id)]
			})
		}
	}

	onClickDeleteKeyResult = (e, keyid, id) => {
		let deletedkeyobjectives = this.state.deletedkeyobjectives.concat(this.state.keyobjectives.filter((keyobjectives) => keyobjectives.keyid == keyid))
		this.setState({
			deletedkeyobjectives: deletedkeyobjectives,
			keyobjectives: [...this.state.keyobjectives.filter((keyobjectives) => keyobjectives.keyid !== keyid)]
		}, () => this.deleteObjective(id))	
	}

	onClickDeleteObjective = (e, id) => {
		let deletedobjectives = this.state.deletedobjectives.concat(this.state.objectives.filter((objective) => objective.id == id))
		let deletedkeyobjectives = this.state.deletedkeyobjectives.concat(this.state.keyobjectives.filter((keyobjectives) => keyobjectives.id == id))
		this.setState({
			deletedobjectives: deletedobjectives,
			deletedkeyobjectives: deletedkeyobjectives,
			objectives: [...this.state.objectives.filter((objective) => objective.id !== id)],
			keyobjectives: [...this.state.keyobjectives.filter((keyobjectives) => keyobjectives.id !== id)]
		})	
	}

	makeObjective() {
		return this.state.objectives.map((objective) => (
			<Objective
			id={objective.id} 
			objectivename={objective.name} 
			supervisor={objective.supervisor} 
			progress={objective.progress} 
			keyobjectives={this.findKeyObjectives(objective.id)}
			quarter={objective.quarter}
			lastupdate={objective.lastupdate}
			keyobjectiveowner={this.state.fullname}
			onClickObjective={this.onClickDeleteObjective}
			onClickKeyResult={this.onClickDeleteKeyResult}
			edit={true}
			/>
		))
	}

	handleSubmit(e) {
		e.preventDefault()
		alert("Saved Successfully")

		axios.post('/deleteobj', {
			deletedobjectives: this.state.deletedobjectives,
			deletedkeyobjectives: this.state.deletedkeyobjectives
		})
		.then(res => console.log(res))
	}


	render() {
		return(
			<>
				<h1>Edit Objectives (for {this.state.fullname}):</h1>
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