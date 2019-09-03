import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

// Attempt at splitting the code in Objective.js, no time for now, you can continue working on this Simon
// Not currently in use

export default class KeyObjective extends Component {
	constructor(props) {
		super(props)
	}
	
	makeKeyObjectives = () => {
		return this.props.keyobjectives.map((keyobjective) => {
			if(keyobjective.valuetype == 'boolean' || keyobjective.valuetype == 'percentage'){
				return(
				<>
					<Card style={{margin: 10, maxWidth: 400, position: 'relative'}}>
						<CardContent>
							<Typography>
								Name: {keyobjective.name}
							</Typography>
							<Typography>
								Owner: {keyobjective.owner}
							</Typography>
							<Typography>
								Target Value Type: {keyobjective.valuetype}
							</Typography>
							<Typography>
								Description: {keyobjective.description}
							</Typography>
						</CardContent>
						<Button
						style={buttonStyle}
						size="small" 
						variant="contained" 
						color="primary" 
						onClick={this.props.delKeyObjective.bind(this, keyobjective.keyid)}
						>
							<DeleteIcon/>
						</Button>
					</Card>
				</>)
			}
			else{
				return(
				<>
					<Card style={{margin: 10, maxWidth: 400, position: 'relative'}}>
						<CardContent>
							<Typography>
								Name: {keyobjective.name}
							</Typography>
							<Typography>
								Owner: {keyobjective.owner}
							</Typography>
							<Typography>
								Custom Target Value: {keyobjective.goalnumber}
							</Typography>
							<Typography>
								Description: {keyobjective.description}
							</Typography>
						</CardContent>
						<Button
						style={buttonStyle}
						size="small" 
						variant="contained" 
						color="primary" 
						onClick={this.props.delKeyObjective.bind(this, keyobjective.keyid)}
						>
							<DeleteIcon/>
						</Button>
					</Card>
				</>
				)
			}
		}
		)
	}

	render() {
		return (
			<>
			{this.makeKeyObjectives()}
			</>
		)
	}
}

const buttonStyle = {
	position: 'absolute',
	bottom: 50,
	left: 300,
}