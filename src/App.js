import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import Drawer from './components/Layout/Drawer'
import Dashboard from './views/Dashboard'
import MyObjectives from './views/MyObjectives'
import NewObjective from './views/NewObjective'
import EditObjective from './views/EditObjectives'

class App extends Component {
  
  render() {

    return (   
        <Router>
          <Drawer>          
            <Switch>
              <Route exact path="/" component={Dashboard}/>
              <Route path="/myobjectives" component={MyObjectives}/>
              <Route path="/newobjectives" component={NewObjective}/>
              <Route path="/editobjectives" component={EditObjective}/>
            </Switch>    
          </Drawer>
        </Router>
    )
  }
}

export default App;
