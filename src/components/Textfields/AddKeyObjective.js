import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import FormControl from '@material-ui/core/FormControl';
import SelectMat from '@material-ui/core/Select';
import Select from 'react-select'
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from '@material-ui/core/MenuItem';

//Adds Keyobjective card in the New Objective tab

export class AddKeyObjective extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      owner: '',
      valuetype: '',
      goalnumber: '',
      description: '',
      valueHasError: false,
      ownerHasError: false,
      users: this.props.users
    }
  }
  

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ valueHasError: false })
    this.setState({ ownerHasError: false })
    if (!this.state.valuetype) {
      this.setState({ valueHasError: true })
    }
    else if (!this.state.owner) {
      this.setState({ ownerHasError: true })
    }
	  else {
      this.props.addKeyObjective(this.state.name, this.state.owner, this.state.valuetype, this.state.goalnumber, this.state.description);
      this.setState({ 
      name: '',
      owner: '',
      valuetype: '',
      goalnumber: '',
      description: ''})
    }
  }

  onChangeName = (e) => this.setState({ name: e.target.value })
  onChangeOwner = (e) => this.setState({ owner: e.target.value })
  onChangeValueType = (e) => {
    if(e.target.value == 'boolean'){
      this.setState({ goalnumber: 1 })
    }
    else if(e.target.value == 'percentage'){
      this.setState({ goalnumber: '100' })
    }
    this.setState({ valuetype: e.target.value})
  }
  onChangeGoalnumber = (e) => {
    //allows only numbers
    const onlyNums = e.target.value.replace(/[^0-9]/g, '')
    this.setState({ goalnumber: onlyNums })
  }
  onChangeDescription= (e) => this.setState({ description: e.target.value })

  renderSelectOptions = () => {
    let options = this.props.users.map((user) => {
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

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
        <TextField
        required
        multiline
        id="standard-name"
        label="Name"
        margin="normal"
        value={this.state.name}
        onChange={this.onChangeName}
        />
        <FormControl required margin="normal" style={{minWidth: 150}}>
          <InputLabel required>Owner</InputLabel>
          <SelectMat 
          value={this.state.owner}
          onChange={this.onChangeOwner}
          >
            {this.renderSelectOptions()}
          </SelectMat>
          {this.state.ownerHasError && <FormHelperText>This is required!</FormHelperText>}
        </FormControl>
        <FormControl required margin="normal" style={{minWidth: 150}}>
          <InputLabel required>Target Value Type</InputLabel>
          <SelectMat 
          value={this.state.valuetype}
          onChange={this.onChangeValueType}
          >
            <MenuItem value={'boolean'}>Boolean</MenuItem>
            <MenuItem value={'percentage'}>Percentage</MenuItem>
            <MenuItem value={'custom'}>Custom value</MenuItem>
          </SelectMat>
          {this.state.valueHasError && <FormHelperText>This is required!</FormHelperText>}
        </FormControl>
        <TextField
        required
        id="standard-name"
        label="Custom Value"
        margin="normal"
        value={this.state.goalnumber}
        onChange={this.onChangeGoalnumber}
        disabled={!(this.state.valuetype == 'custom')}
        />
        <TextField
        multiline
        id="standard-name"
        label="Description"
        margin="normal"
        value={this.state.description}
        onChange={this.onChangeDescription}
        />
        <Button size="medium" color="primary" type="submit">
          <AddIcon />
          Add
        </Button>
      </form>
    )
  }
}

export default AddKeyObjective