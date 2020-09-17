import React, { Component } from "react";
import "../../css/accountpage.css";
import LoginContext from "../../../loginContext";
import Navbar from "../nav/navbar";
import Accountinfo from "../account/accountInfo";
import { css } from "@emotion/core";
import { MoonLoader } from "react-spinners";

class accountpage extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      favoritesClicked: false,
      loading: true
    };

    // loading css
     this.loadingCss = css`
     display: block;
     position: fixed;
     top: 25%;
     left: 50%;
     margin-top: -50px;
     margin-left: -50px;
    `;
  }

  componentDidMount(){
    this._isMounted = true;
    var urlArr = window.location.pathname.split(""), slashCount = 0, namepostion, userpagename;
    urlArr.map((index) => {if(index === "/"){slashCount++} return slashCount});
    if(slashCount === 2){
      namepostion = window.location.pathname.indexOf("/", window.location.pathname.indexOf("/") + 1) + 1;
      userpagename = window.location.pathname.slice(namepostion, window.location.pathname.length).replace(/%20/g, " ");
    }

    if((this.context.prevURL === `/profile/${this.context.loginUser.user}/settings` && this.context.loginUser.user === userpagename) || (this.context.prevURL === `/profile/${this.context.loginUser.user}/edit` && this.context.loginUser.user === userpagename)){
      if(sessionStorage.getItem("userMenuClicked") !== "true"){
        this.setState({favoritesClicked: true});
      }
    }
    // loading page state update
    setTimeout(() => {this._isMounted && this.setState({loading: false})}, 3000);
  };

  componentWillUnmount() {
    this._isMounted = false;
 }

  render() {
    if(this.state.loading){
      return (
        <>
          <MoonLoader
            css={this.loadingCss}
            size={65}
            color={"#007bff"}
            loading={this.state.loading}
          />
          <h1 className="loadingMessage">Loading...</h1>
        </>
      )
    }
    else{
      return (
        <>
          <Navbar favClick={(favValue) => {this.setState({favoritesClicked: favValue})}} favClickReturn={this.state.favoritesClicked}/>
          <Accountinfo favClick={(favValue) => {this.setState({favoritesClicked: favValue})}} favClickReturn={this.state.favoritesClicked}/>
         </>
      )
    }
  }
}
accountpage.contextType = LoginContext;
export default accountpage;