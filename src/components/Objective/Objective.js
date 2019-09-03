import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Progress } from 'semantic-ui-react'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import 'semantic-ui-css/semantic.min.css';


// Displays the objective cards with the OKR data
// Can be toggled to modify Key Result progress with modify=true prop
/*
PROPS LIST: 
objectivename={objective.name} 
supervisor={objective.supervisor} 
keyobjectiveowner={this.state.fullname} 
progress={objective.progress}
keyobjectives={this.findKeyObjectives(objective.id)}
lastupdate={objective.lastupdate}
quarter={objective.quarter}
onChange={this.handleSliderChange}
onChangeConfidence={this.handleConfidenceSliderChange}
keyobjectiveowner (will only display key results with the selected owner)
*/

const useStyles = makeStyles({
	maincard: {
		margin: 10,
		minWidth: 300
	},
	secondarycard: {
		margin: 5,
	},
	owner: {
		textAlign: "right"
	}
});

function isThereNonNull(array) {
	for(let i=0;i<array.length;i++){
		if(array[i] !== null) {
			return true
		}
	}
	return false
}

export default function Objective(props) {
	const classes = useStyles();

	const makeDescription = (description) => {
		if(description == "" || description == null) {
			return null
		}
		else{
			return (
				<Typography  color="textSecondary">
						Description: {description}
				</Typography>
			)
		}
	}

	//return Key Results Cards, it can probably be (should be) made into another Component if you have time
	const makeKeyObjectives = props.keyobjectives.map((keyobjective) => {
		let color = ""
			if(keyobjective.progress/keyobjective.goalnumber < .35){
				color = 'red'
			}
			else if(keyobjective.progress/keyobjective.goalnumber < .7){
				color = 'yellow'
			}
			else{
				color = 'green'
			}
		const editObjectives = props.edit == true && (props.keyobjectiveowner == keyobjective.owner || props.supervisor == props.keyobjectiveowner)
		const dashboard = props.keyobjectiveowner == null
		const myObjectives = props.keyobjectiveowner == keyobjective.owner || props.supervisor == props.keyobjectiveowner
		
		if(editObjectives) {
			return(
			<Card className={classes.secondarycard}>
				<CardContent>
					<Progress value={keyobjective.progress} color={color} total={keyobjective.goalnumber} indicating size='small'>
						{keyobjective.name}
					</Progress>
					<Typography  color="textSecondary">
						Owner: {keyobjective.owner} 
					</Typography>
					<Typography  color="textSecondary">
						Last Update: {keyobjective.lastupdate}
					</Typography>
					<Button 
					variant="contained" 
					color="primary"
					onClick={(e) => props.onClickKeyResult(e, keyobjective.keyid, keyobjective.id)}
					>
						<DeleteIcon/>
					</Button>
				</CardContent>
			</Card>
			)
		}
		else if(dashboard){
			if(keyobjective.valuetype == 'boolean'){
				return(
				<Card className={classes.secondarycard}>
					<CardContent>
						<Progress value={keyobjective.progress} color={color} total={keyobjective.goalnumber} indicating size='small'>
							{keyobjective.name}
						</Progress>
						<Typography>
							Confidence Level: {keyobjective.confidence}%
						</Typography>
						<Typography  color="textSecondary">
							Owner: {keyobjective.owner}
						</Typography>
						<Typography  color="textSecondary">
							Last Update: {keyobjective.lastupdate}
						</Typography>
						{makeDescription(keyobjective.description)}
					</CardContent>
				</Card>
				)
			}
			else if(keyobjective.valuetype == 'percentage'){
				return(
				<Card className={classes.secondarycard}>
					<CardContent>
						<Progress value={keyobjective.progress} color={color} total={keyobjective.goalnumber} progress="percent" indicating size='small'>
							{keyobjective.name}
						</Progress>
						<Typography  color="textSecondary">
							Owner: {keyobjective.owner}
						</Typography>
						<Typography  color="textSecondary">
							Last Update: {keyobjective.lastupdate}
						</Typography>
						{makeDescription(keyobjective.description)}
					</CardContent>
				</Card>
				)
			}
			else{
				return(
				<Card className={classes.secondarycard}>
					<CardContent>
						<Progress value={keyobjective.progress} color={color} total={keyobjective.goalnumber} progress="value" indicating size='small'>
							{keyobjective.name}
						</Progress>
						<Typography  color="textSecondary">
							Owner: {keyobjective.owner}
						</Typography>
						<Typography  color="textSecondary">
							Last Update: {keyobjective.lastupdate}
						</Typography>
						{makeDescription(keyobjective.description)}
					</CardContent>
				</Card>
				)
			}		
		}
		else if(myObjectives){
			if(keyobjective.valuetype == 'boolean'){
				return(
					<Card className={classes.secondarycard}>
						<CardContent>
							<Progress value={keyobjective.progress} color={color} total={keyobjective.goalnumber} indicating size='small'>
								{keyobjective.name}
							</Progress>
							<Typography>
							Confidence Level: {keyobjective.confidence}%
							</Typography>
							<Typography  color="textSecondary">
							Owner: {keyobjective.owner}
							</Typography>
							<Typography  color="textSecondary">
								Last Update: {keyobjective.lastupdate}
							</Typography>
							<Typography id="discrete-sliderkey" gutterBottom>
								Edit Confidence Level:
							</Typography>
							<Slider
								defaultValue={keyobjective.confidence}
								aria-labelledby="KeyResults Confidence Slider"
								step={1}
								marks
								min={0}
								max={100}
								onChange={(e, value) => props.onChangeConfidence(e, value, keyobjective.keyid, keyobjective.id)}
							/>
							<Typography id="discrete-sliderkey" gutterBottom>
								Edit:
							</Typography>
							<Slider
								defaultValue={keyobjective.progress}
								aria-labelledby="KeyResults Slider"
								step={1}
								marks={[
									{
										value: 0,
										label: ''
									},
									{
										value: 1,
										label: 'Done'
									}
								]}
								min={0}
								max={keyobjective.goalnumber}
								onChange={(e, value) => props.onChange(e, value, keyobjective.keyid, keyobjective.id)}
							/>
						</CardContent>
					</Card>
				)
			}
			else if(keyobjective.valuetype == 'percentage'){
				return(
					<Card className={classes.secondarycard}>
						<CardContent>
							<Progress value={keyobjective.progress} color={color} total={keyobjective.goalnumber} progress="percent" indicating size='small'>
								{keyobjective.name}
							</Progress>
							<Typography  color="textSecondary">
							Owner: {keyobjective.owner}
							</Typography>
							<Typography  color="textSecondary">
								Last Update: {keyobjective.lastupdate}
							</Typography>
							<Typography id="discrete-sliderkey" gutterBottom>
								Edit:
							</Typography>
							<Slider
								defaultValue={keyobjective.progress}
								aria-labelledby="KeyResults Slider"
								valueLabelDisplay="auto"
								step={1}
								marks
								min={0}
								max={keyobjective.goalnumber}
								onChange={(e, value) => props.onChange(e, value, keyobjective.keyid, keyobjective.id)}
							/>
						</CardContent>
					</Card>
				)
			}
			else{
				return(
					<Card className={classes.secondarycard}>
						<CardContent>
							<Progress value={keyobjective.progress} color={color} total={keyobjective.goalnumber} progress="value" indicating size='small'>
								{keyobjective.name}
							</Progress>
							<Typography  color="textSecondary">
								Owner: {keyobjective.owner}
							</Typography>
							<Typography  color="textSecondary">
								Last Update: {keyobjective.lastupdate}
							</Typography>
							<Typography id="discrete-sliderkey" gutterBottom>
								Edit:
							</Typography>
							<Slider
								defaultValue={keyobjective.progress}
								aria-labelledby="KeyResults Slider"
								valueLabelDisplay="auto"
								step={1}
								marks
								min={0}
								max={keyobjective.goalnumber}
								onChange={(e, value) => props.onChange(e, value, keyobjective.keyid, keyobjective.id)}
							/>
						</CardContent>
					</Card>
				)
			}
		}
		return null
	})

	//Check if the Key Results array returned is null
	const isThereKeyResult = isThereNonNull(makeKeyObjectives)

	// return Objective Card
	if(isThereKeyResult == true){
		if(props.edit == true) {
			return(
			<>
				<Grid item md={6}>
					<Card className={classes.maincard}>
						<CardContent>
						<Typography gutterBottom variant="h5" color="textPrimary" component="h2">
						Objective: {props.objectivename}
						</Typography>
						<Typography  color="textSecondary">
							Quarter: {props.quarter}
						</Typography>
						<Typography  color="textSecondary">
							Owner: {props.supervisor}
						</Typography>
						<Typography  color="textSecondary">
							Last Update: {props.lastupdate}
						</Typography>
						<Progress percent={props.progress} progress indicating size='medium'>
							Overall Progress
						</Progress>
						<Button 
						variant="contained" 
						color="primary"
						onClick={(e) => props.onClickObjective(e, props.id)}
						>
							Delete Objective
							<DeleteIcon/>
						</Button>
						{makeKeyObjectives}
						</CardContent>
					</Card>
				</Grid>
			</>
			)
		}
		else {
			return (
				<>
					<Grid item md={6}>
						<Card className={classes.maincard}>
							<CardContent>
							<Typography gutterBottom variant="h5" color="textPrimary" component="h2">
							Objective: {props.objectivename}
							</Typography>
							<Typography  color="textSecondary">
								Quarter: {props.quarter}
							</Typography>
							<Typography  color="textSecondary">
								Owner: {props.supervisor}
							</Typography>
							<Typography  color="textSecondary">
								Last Update: {props.lastupdate}
							</Typography>
							{makeDescription(props.description)}
							<Progress percent={props.progress} progress indicating size='medium'>
								Overall Progress
							</Progress>
							{makeKeyObjectives}
							</CardContent>
						</Card>
					</Grid>
				</>
			)
		}
	}
	else{
		return(
			<>
			</>
		)
	}
}