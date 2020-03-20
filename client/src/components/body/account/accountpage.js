import React, { Component } from "react";
import "../../css/accountpage.css";
import Navbar from "../nav/navbar";
import Accountinfo from "../account/accountInfo";

class accountpage extends Component {
  constructor(props) {
    super(props);
    this.state = {favoritesClicked: false};
  }

  handleFavClick = (favValue) => {
    if(sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/settings` || sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/edit`){
      sessionStorage.removeItem("prevURL");
      this.setState({favoritesClicked: true});
    }
    else{
      this.setState({favoritesClicked: favValue});
    }
  }
  
  render() {
    return (
      <>
        <Navbar loggedin={this.props.loggedin} displayName={this.props.displayName} favClick={this.handleFavClick} favClickReturn={this.state.favoritesClicked}/>
        <Accountinfo loggedin={this.props.loggedin} displayName={this.props.displayName} favClickAccountInfo={this.handleFavClick} favoritesPage={this.state.favoritesClicked}/>
       </>
    )
  }
}

export default accountpage;
