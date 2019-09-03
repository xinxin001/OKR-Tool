import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';

// Save button component on MyObjectives, New Objective and EditObjectives pages

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: 30,
	  right: 30,
	  top: 'auto',
	  left: 'auto',
	  margin: 0,

  }
}))

export default function FloatingActionButtonZoom(props) {
  const classes = useStyles();

  return (
	<>
	<Fab variant="extended" size="small" type={props.type} color="primary" className={classes.fab} onClick={props.clicked}>
        <SaveIcon fontSize="large" />
        {props.text}
  </Fab>
	</>
  );
}