import React, { Component } from "react";
import "../../css/accountpage.css";
import Navbar from "../nav/navbar";
import Accountinfo from "../account/accountInfo";

class accountPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedin: false };
  }
  render() {
      var {loggedin} = this.state;
    return (
      <>
        <Navbar loggedin={loggedin}/>
        <Accountinfo loggedin={loggedin}/>
      </>
    );
  }
}

export default accountPage;
