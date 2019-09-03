import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import SelectMat from '@material-ui/core/Select';


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

export default function ObjectiveForm(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    quarter: '',
    owner: '',
  });

  const renderSelectOptions = () => {
    let options = props.users.map((user) => {
      return {value: user.firstname + ' ' + user.lastname, label: user.firstname + ' ' + user.lastname}
    })

    options = options.sort((a,b) => {
      var x = a.value.toLowerCase()
      var y = b.value.toLowerCase()
      if (x < y) {return -1}
      if (x > y) {return 1}
      return 0
    })

    return(
      options.map((option) => {
        return <MenuItem value={option.value}>{option.label}</MenuItem>
      })
    )
  }

  const handleQuarterChange = (e, value) => {
    props.onChangeQuarter(e, value)
    handleChange(e, value)
  }

  const handleOwnerChange = (e, value) => {
    props.onChangeSupervisor(e, value)
    handleChange(e, value)
  }
  
  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }


  //At the moment, the quarter selector is hardcoded, change in the future
  return (
    <>
      <FormControl className={classes.textField} required margin="normal" style={{minWidth: 150}}>
          <InputLabel required>Quarter</InputLabel>
          <SelectMat
          value={values.quarter} 
          onChange={handleQuarterChange}
          inputProps={{
            name: 'quarter',
          }}
          >
            <MenuItem value={"Q2 2020"}>Q2 2020</MenuItem>
            <MenuItem value={"Q3 2020"}>Q3 2020</MenuItem>
            <MenuItem value={"Q4 2020"}>Q4 2020</MenuItem>
            <MenuItem value={"Q1 2021"}>Q1 2021</MenuItem>
            <MenuItem value={"Q2 2021"}>Q2 2021</MenuItem>
            <MenuItem value={"Q3 2021"}>Q3 2021</MenuItem>
          </SelectMat>
          {props.hasErrorQuarter && <FormHelperText>This is required!</FormHelperText>}
      </FormControl>
      <TextField
        required
        id="standard-name"
        label="Objective Name"
        name="objname"
        className={classes.textField}
        margin="normal"
        onChange={props.onChangeName}
      />
      <FormControl className={classes.textField} required margin="normal" style={{minWidth: 150}}>
          <InputLabel required>Owner</InputLabel>
          <SelectMat
          value={values.owner} 
          onChange={handleOwnerChange}
          inputProps={{
            name: 'owner',
          }}
          >
            {renderSelectOptions()}
          </SelectMat>
          {props.hasErrorOwner && <FormHelperText>This is required!</FormHelperText>}
      </FormControl>
      <TextField
        id="standard-required"
        label="Description"
        name="description"
        className={classes.textField}
        margin="normal"
        multiline
        onChange={props.onChangeDescription}
      />
    </>
  );
}