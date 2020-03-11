import React, { Component } from "react";
import "../../css/accountpage.css";
import Navbar from "../nav/navbar";
import Accountinfo from "../account/accountInfo";

class accountPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedin: false, displayName: "John Smith" };
  }
  render() {
      var {loggedin, displayName} = this.state;
    return (
      <>
        <Navbar loggedin={loggedin} displayName={displayName}/>
        <Accountinfo loggedin={loggedin} displayName={displayName}/>
      </>
    );
  }
}

export default accountPage;
