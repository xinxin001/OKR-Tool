import React, { Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MenuList, MenuItem} from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles';


//Layout of the app: Navigation tab and Header

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
	  flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
	padding: theme.spacing(3),
  },
  logo: {
	  flex: 1,
	  maxWidth: 199,
	  maxHeight: 64,
  }
}));

function ResponsiveDrawer(props) {
  const { container, children, location: { pathname } } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = (
    <div className={classes.toolbar}>
		<div style={{paddingTop: 45, paddingBottom: 45, textAlign: 'center', alignItems: 'center'}}>
			<img src={ require('../../cae-logo.png')} className={classes.logo}/>
	  	</div>
		<MenuList>
		<Divider/>
		<MenuItem component={Link} to="/" selected={'/' === pathname}>
			Dashboard
		</MenuItem>

		<Divider/>

		<MenuItem component={Link} to="/myobjectives" selected={'/myobjectives' === pathname}>
			My Objectives
		</MenuItem>

		<Divider/>

		<MenuItem component={Link} to="/newobjectives" selected={'/newobjectives' === pathname}>
			New Objective
		</MenuItem>

		<Divider/>

		<MenuItem component={Link} to="/editobjectives" selected={'/editobjectives' === pathname}>
			Edit Objectives
		</MenuItem>

		<Divider/>
		</MenuList>
    </div>
  );

  return (
	<Fragment>
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
				<IconButton
					color="inherit"
					aria-label="Open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					className={classes.menuButton}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap>
					OKR Tool
				</Typography>
				</Toolbar>
			</AppBar>
			
			<nav className={classes.drawer} aria-label="Mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					classes={{
					paper: classes.drawerPaper,
					}}
					ModalProps={{
					keepMounted: true, // Better open performance on mobile.
					}}
				>
					{drawer}
				</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
				<Drawer
					classes={{
					paper: classes.drawerPaper,
					}}
					variant="permanent"
					open
				>
					{drawer}
				</Drawer>
				</Hidden>
			</nav>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{children}
			</main>
		</div>
		
	</Fragment>
  );
}

export default withRouter(ResponsiveDrawer);