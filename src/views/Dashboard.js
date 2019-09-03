import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SelectMat from '@material-ui/core/Select';
import Objective from '../components/Objective/Objective'

export default class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state={
		  objectives:[],
		  keyobjectives:[],
		  quarter:'Q2 2020',
		  sorting: "Most Recent"
		}
	}

	componentDidMount() {
		this.getData()
		setInterval(this.getData, 5000)
	}

	getData = () => {
		axios.get('/obj')
		.then(response => {
			this.setState({objectives: response.data.recordset})
		})

		axios.get('/keyobj')
		.then(res => {
			this.setState({keyobjectives: res.data.recordset})
		})

	}

	findKeyObjectives(id) {
		return this.state.keyobjectives.filter((keyobjective) => {
			return keyobjective.id == id
		})
	} 

	makeObjective() {
		return this.state.objectives.map(function(objective) {
			if(this.state.quarter == objective.quarter){
				return (
				<Objective 
				objectivename={objective.name} 
				supervisor={objective.supervisor} 
				progress={objective.progress}
				description={objective.description} 
				keyobjectives={this.findKeyObjectives(objective.id)}
				lastupdate={objective.lastupdate}
				quarter={objective.quarter}
				/>
				)
			}
			else{
				return null
			}
		}.bind(this))
	}

	handleQuarterChange = (e) => this.setState({ quarter: e.target.value })

	handleSortingChange = (e) => this.setState({ sorting: e.target.value }, () => {
		if(this.state.sorting == "Alphabetical"){
			let keyobjectives = this.state.objectives.slice()
		}
		else if(this.state.sorting == "Completion"){
			
		}
		else if(this.state.sorting == "Most Recent"){

		}
		else{

		}
	})

	render() {
		return(
			<>
				<div>
					<FormControl margin="normal" style={{minWidth: 150}}>
						<InputLabel>Quarter</InputLabel>
						<SelectMat 
						value={this.state.quarter}
						onChange={this.handleQuarterChange}
						>
							<MenuItem value={"Q2 2020"}>Q2 2020</MenuItem>
							<MenuItem value={"Q3 2020"}>Q3 2020</MenuItem>
							<MenuItem value={"Q4 2020"}>Q4 2020</MenuItem>
							<MenuItem value={"Q1 2021"}>Q1 2021</MenuItem>
							<MenuItem value={"Q2 2021"}>Q2 2021</MenuItem>
							<MenuItem value={"Q3 2021"}>Q3 2021</MenuItem>
						</SelectMat>
					</FormControl>
					<FormControl margin="normal" style={{minWidth: 150}}>
						<InputLabel>Sort By</InputLabel>
						<SelectMat 
						value={this.state.sorting}
						onChange={this.handleSortingChange}
						>
							<MenuItem value={"Alphabetical"}>Alphabetical</MenuItem>
							<MenuItem value={"Completion"}>Completion</MenuItem>
							<MenuItem value={"Most Recent"}>Most Recent</MenuItem>
							<MenuItem value={"Oldest"}>Oldest</MenuItem>
						</SelectMat>
					</FormControl>
					<Grid 
					container 
					direction="row" 
					justify="space-evenly"
					alignItems="flex-start"
					spacing={24}
					>
						{this.makeObjective()}
					</Grid>
				</div>
			</>
		)
	}
}
