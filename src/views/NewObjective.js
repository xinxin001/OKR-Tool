import React, { Component } from 'react'
import ObjectiveForm from '../components/Textfields/ObjectiveForm'
import SaveButton from '../components/Buttons/SaveButton'
import AddKeyObjective from '../components/Textfields/AddKeyObjective'
import KeyObjective from '../components/Objective/KeyObjective'
import axios from 'axios';
import uuid from 'uuid';
import Grid from '@material-ui/core/Grid'

export default class NewObjective extends Component {
	constructor(props) {
		super(props)
		this.state = {
			objId: uuid.v4(),
			objQuarter: '',
			objName: '',
			objSupervisor: '',
			objProgress: '0',
			objDescription: '',
			keyobjectives: [],
			users: [],
			hasError: false
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
		axios.get('/getallusers')
		.then(res => {
			this.setState({
				users: res.data.recordset
			})
		})
	}

	handleSubmit(e) {
		this.setState({ hasErrorOwner: false })
		this.setState({ hasErrorQuarter: false })
		if (this.state.objSupervisor == '') {
			this.setState({ hasErrorOwner: true })
			e.preventDefault()
		}
		else if (this.state.objQuarter == '') {
			this.setState({ hasErrorQuarter: true })
			e.preventDefault()
		}
		else if(this.state.keyobjectives.length > 0 && !this.state.hasErrorOwner && !this.state.hasErrorQuarter){

			alert("Submitted Successfully")

			axios.post('/newobj', {
				id: this.state.objId,
				quarter: this.state.objQuarter,
				name: this.state.objName,
				supervisor: this.state.objSupervisor,
				progress: this.state.objProgress,
				description: this.state.objDescription,
				lastupdate: new Date().toLocaleString()
			})
			.then(
				axios.post('/newkeyobj', {
				keyobjectives: this.state.keyobjectives
				})
			)
		}
		else{
			e.preventDefault()
			alert("Please add at least one Key Result")
		}
	}

	handleChangeName = e => {
		this.setState({ objName: e.target.value }, function() {
		})
	}
	handleChangeSupervisor = e => {
		this.setState({ 
			objSupervisor: e.target.value,
			hasErrorOwner: false 
		}, function() {
		})
	}
	handleChangeQuarter = e => {
		this.setState({ 
			objQuarter: e.target.value,
			hasErrorQuarter: false 
		}, function() {
			console.log(this.state)
		})
	}
	handleChangeDescription = e => {
		this.setState({ objDescription: e.target.value }, function() {
		})
	}

	addKeyObjective = (name, owner, valuetype, goalnumber, description) => {
		let data = {
			progress: '0',
			confidence: '0',
			name: name,
			owner: owner,
			valuetype: valuetype,
			goalnumber: goalnumber,
			description: description,
			keyid: uuid.v4(),
			id: this.state.objId,
		}
		this.setState({ keyobjectives: [...this.state.keyobjectives, data] });
	}

	delKeyResult = (keyid) => {
		this.setState({
			keyobjectives: [...this.state.keyobjectives.filter((keyobjectives) => keyobjectives.keyid !== keyid)]
		})
	}


	render() {
		return (
			<div>

				<h1>Create New Objective:</h1>
				<form onSubmit={this.handleSubmit}>
				<ObjectiveForm 
				onChangeName={this.handleChangeName} 
				onChangeSupervisor={this.handleChangeSupervisor}
				onChangeQuarter={this.handleChangeQuarter}
				onChangeDescription={this.handleChangeDescription}
				users={this.state.users}
				hasErrorOwner={this.state.hasErrorOwner}
				hasErrorQuarter={this.state.hasErrorQuarter}
				/>
				
				<SaveButton
				text={"Submit Objective"}
				type={"submit"}
				/>
				</form>

				<h2>Add Key Results:</h2>
				<Grid>
				<AddKeyObjective addKeyObjective={this.addKeyObjective} users={this.state.users}/>
				<KeyObjective keyobjectives={this.state.keyobjectives} delKeyObjective={this.delKeyResult}/>
				</Grid>
			</div>
		)
	}
}
