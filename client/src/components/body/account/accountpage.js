import React, { Component } from "react";
import "../../css/accountpage.css";
import LoginContext from "../../../loginContext";
import Navbar from "../nav/navbar";
import Accountinfo from "../account/accountInfo";

class accountpage extends Component {
  constructor(props) {
    super(props);
    this.state = {favoritesClicked: false};
  }

  componentDidMount(){
    if(this.context.prevURL === `/profile/${this.context.loginUser.user}/settings` || this.context.prevURL === `/profile/${this.context.loginUser.user}/edit`){
      if(sessionStorage.getItem("userMenuClicked") !== "true"){
        this.setState({favoritesClicked: true});
      }
    }
  };

  render() {
    return (
      <>
        <Navbar favClick={(favValue) => {this.setState({favoritesClicked: favValue})}} favClickReturn={this.state.favoritesClicked}/>
        <Accountinfo favClick={(favValue) => {this.setState({favoritesClicked: favValue})}} favClickReturn={this.state.favoritesClicked}/>
       </>
    )
  }
}
accountpage.contextType = LoginContext;
export default accountpage;