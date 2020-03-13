import React from "react";
import "../../css/accountpage.css";
import Navbar from "../nav/navbar";
import Accountinfo from "../account/accountInfo";

 function accountPage(props) {
    return (
      <>
        <Navbar loggedin={props.loggedin} displayName={props.displayName}/>
        <Accountinfo loggedin={props.loggedin} displayName={props.displayName}/>
      </>
    );
  }

export default accountPage;
