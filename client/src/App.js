import React, { Component } from "react";
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import LogSignform from "./components/body/loginsignup/LogSignform";
import AccountPage from "./components/body/account/accountpage";
import Settings from "./components/body/account/settings";
import AccountEdit from "./components/body/account/accountEdit";
import NotFound from "./components/body/NotFound/PageNotFound";
import ProtectedRoute from "./components/body/ProtectedRoute";
import Axios from "axios";

class App extends Component {
  constructor(props){
    super(props)
    this.state = { loggedin: false, displayName: ""};
  }

componentDidMount(){
  // delete session cookie when user logs out.
  if(!this.state.loggedin){
    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  // check user's login session
  Axios.get("/userSession").then((user) => {
    this.setState({loggedin: user.data});
    var userAuth = {"status": user.data, "user": this.state.displayName};
    localStorage.setItem("userAuth", JSON.stringify(userAuth));
  }).catch((err) => {console.log(err.response)});

  // get username from url
  if(window.location.pathname !== "/" || window.location.pathname !== "/login" || window.location.pathname !== "/profile/"){
    var urlArr = window.location.pathname.split(""), slashCount = 0, namepostion, userpagename;
      urlArr.map((index) => {if(index === "/"){slashCount++} return slashCount});
      if(slashCount === 2){
        namepostion = window.location.pathname.indexOf("/", window.location.pathname.indexOf("/") + 1) + 1;
        userpagename = window.location.pathname.slice(namepostion, window.location.pathname.length).replace(/%20/g, " ");
        this.setState({displayName: this.capital_letter(userpagename)});

      }else if(slashCount === 3){
        namepostion = window.location.pathname.indexOf("/", window.location.pathname.indexOf("/") + 1) + 1;
        userpagename = window.location.pathname.slice(namepostion, window.location.pathname.lastIndexOf("/")).replace(/%20/g, " ");
        this.setState({displayName: this.capital_letter(userpagename)});
      };
      
  }else{
    return;
  }
}

    // set the first letter of each word in a sentence to a capital letter.
  capital_letter = (name) => {
    name = name.split(" ");

    for (var i = 0, nameLength = name.length; i < nameLength; i++) {
        name[i] = name[i][0].toUpperCase() + name[i].substr(1);
    }

    return name.join(" ");
}

  render(){
    var {loggedin, displayName} = this.state;
    return (  
      <>
      <Router>
        <Switch>
          <ProtectedRoute exact path="/" component={() => <LogSignform message={"Have an account? "} link={"/login"} LinkAction={"Login"} action={"Sign up"} />}/>
          <ProtectedRoute exact path="/login" component={() => <LogSignform message={"Don't have an account? "} link={"/"} LinkAction={"Sign up"} action={"Login"} capitalL={this.capital_letter}/>}/>
          <Route exact path="/profile/:username" component={() => <AccountPage loggedin={loggedin} displayName={displayName}/>}/>
          <ProtectedRoute exact path="/profile/:username/settings" component={() => <Settings loggedin={loggedin} displayName={displayName} />}/>
          <ProtectedRoute exact path="/profile/:username/edit" component={() => <AccountEdit loggedin={loggedin} displayName={displayName}/>}/>
          <Route path="*" component={() => <NotFound loggedin={loggedin} displayName={displayName}/>}/>
        </Switch>
      </Router>
      </>
    );
  }
}

export default App;