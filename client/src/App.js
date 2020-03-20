import React, {Component} from "react";
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import LogSignform from "./components/body/loginsignup/LogSignform";
import AccountPage from "./components/body/account/accountpage";
import Settings from "./components/body/account/settings";
import AccountEdit from "./components/body/account/accountEdit";

class App extends Component {
  constructor(props){
    super(props)
    this.state = { loggedin: false, displayName: "John Smith" };
  }

  render(){
    var {loggedin, displayName} = this.state;
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={() => <LogSignform message={"Have an account? "} link={"/login"} LinkAction={"Login"} action={"Sign up"} />} />
          <Route exact path="/login" component={() => <LogSignform message={"Don't have an account? "} link={"/"} LinkAction={"Sign up"} action={"Login"} />} />
          <Route exact path="/profile/:username" component={() => <AccountPage loggedin={loggedin} displayName={displayName} />} />
          <Route exact path="/profile/:username/settings" component={() => <Settings loggedin={loggedin} displayName={displayName} />} />
          <Route exact path="/profile/:username/edit" component={() => <AccountEdit loggedin={loggedin} displayName={displayName}/>} />
        </div>
      </Router>
    );
  }
}

export default App;