import React, {Component} from "react";
import './App.css';
import LoginContext from "./loginContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import LogSignform from "./components/body/loginsignup/LogSignform";
import AccountPage from "./components/body/account/accountpage";
import Settings from "./components/body/account/accountSettings";
import Edit from "./components/body/account/accountEdit";
import NotFound from "./components/body/NotFound/PageNotFound";
import ProtectedRoute from "./components/body/ProtectedRoute";
import Axios from "axios";

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loginUser: {
        status: null,
        user: ""
      },
      favoritesClicked: false,
      prevURL: ""
    };
  }

componentDidMount(){
  // updates state based on user login and  deletes cookies when user logs out.
  Axios.get("/userSession").then((session) => {
    if(!session.data.userSession.status){
        document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "userSession=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "prevURL=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
        this.setState({loginUser: session.data.userSession});
  }).catch((err) => {console.log(err.response)});

  // sets the previous url the user was at in context.
  Axios.get("/prevURL").then((url) => {
    var prevUrlArr = url.data.prevURL.split(""), slashCount = 0, pathNamePostion, PrevPathName;
    prevUrlArr.map((index) => {if(index === "/"){slashCount++} return slashCount});
    pathNamePostion = url.data.prevURL.indexOf("/", 7);
    PrevPathName = url.data.prevURL.slice(pathNamePostion);
    this.setState({prevURL: PrevPathName});
  }).catch((err) => {console.log(err.response)});
}

handleFavClick = (favValue) => {
  this.setState({favoritesClicked: favValue});
  
};

  render(){
    return (
      <LoginContext.Provider value={this.state}>
        <>
        <Router>
          <Switch>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/" component={() => <LogSignform message={"Have an account? "} link={"/login"} LinkAction={"Login"} action={"Sign up"}/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/login" component={() => <LogSignform message={"Don't have an account? "} link={"/"} LinkAction={"Sign up"} action={"Login"}/>}/>
            <Route exact path="/profile/:username" component={() => <AccountPage returnfavclick={this.state.favoritesClicked} favhandle={this.handleFavClick}/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/profile/:username/settings" component={() => <Settings favhandle={this.handleFavClick}/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/profile/:username/edit" component={() => <Edit favhandle={this.handleFavClick}/>}/>
            <Route path="*" component={() => <NotFound/>}/>
          </Switch>
        </Router>
        </>
      </LoginContext.Provider>  
    );
  }
}

export default App;