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
import FollowingFollowers from "./components/body/followingFollowers";
import SessionModal from "./components/body/expiredSessionModal";
import Axios from "axios";

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loginUser: {
        status: null,
        user: ""
      },
    };
  }

componentDidMount(){
  // updates state based on user login and  deletes cookies when user logs out.
  Axios.get("/userSession").then((session) => {
    if(!session.data.userSession.status){
        document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "userSession=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
        this.setState({loginUser: session.data.userSession});
  }).catch((err) => {console.log(err.response)});
}


  render(){
    return (
      <LoginContext.Provider value={this.state}>
        <>
        <SessionModal/>
        <Router>
          <Switch>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/" component={() => <LogSignform message={"Have an account? "} link={"/login"} LinkAction={"Login"} action={"Sign up"}/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/login" component={() => <LogSignform message={"Don't have an account? "} link={"/"} LinkAction={"Sign up"} action={"Login"}/>}/>
            <Route exact path="/profile/:username" component={() => <AccountPage/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/profile/:username/settings" component={() => <Settings/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/profile/:username/edit" component={() => <Edit/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/profile/:username/following" component={() => <FollowingFollowers title={"Following"} message={"You have not followed anyone yet!"}/>}/>
            <ProtectedRoute logininfo={this.state.loginUser} exact path="/profile/:username/followers" component={() => <FollowingFollowers title={"Followers"} message={"You have no followers yet!"}/>}/>
            <Route path="*" component={() => <NotFound/>}/>
          </Switch>
        </Router>
        </>
      </LoginContext.Provider>
    );
  }
}
export default App;