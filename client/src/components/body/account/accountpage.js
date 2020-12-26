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
    this.pathNamePostion = "";
    this.PrevPathName = "";
    this.viewotherProfile = false;
    this.state = {
      favoritesClicked: false,
      loading: true
    };

    // loading css
    this.loadingCss = css`
      display: block;
      position: fixed;
      top: 25%;
      left: 47%;
      margin-top: -50px;
      margin-left: -50px;
    `;
  }

  componentDidMount() {
    this._isMounted = true;
    var prevURLArr = document.referrer.split(""),
      slashCount = 0,
      slashindexStart = 0,
      currentUrl = this.getPathName(7, window.location.pathname);

      // get prevUrl
      prevURLArr.forEach((item, index) => {
        if (item === "/") {
          slashCount++;
          slashindexStart = index
        if(slashCount >= 3 ){
         this.PrevPathName = this.getPathName(slashindexStart, document.referrer);
        }
      }});

      // get current Url
      if((currentUrl !== "/Jake") && (currentUrl !== this.PrevPathName)){
        this.viewotherProfile = !this.viewotherProfile;
      }

      // check what url user is at and display active favorites button properly.
      if(!this.viewotherProfile){
        if(this.PrevPathName.search(/(Jake|\/login)/g) === -1){
          if(this.context.loginUser.status){
          if (sessionStorage.getItem("userMenuClicked") !== "true") {
              this.setState({ favoritesClicked: true });
            }
          }
        }
      }else{
        this.setState({ favoritesClicked: false });
      }

    // loading page state update
    setTimeout(() => {
      this._isMounted && this.setState({ loading: false })}, 1000);
  }

  getPathName = (urlSlashindexStart, URL) => {
    this.pathNamePostion = URL.indexOf("/", urlSlashindexStart);
    this.PrevPathName = URL.slice(this.pathNamePostion);
    return this.PrevPathName;
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
      return (
        <>
        {this.state.loading?<>
          <MoonLoader
            css={this.loadingCss}
            size={65}
            color={"#007bff"}
            loading={this.state.loading}
          />
          <h1 className="loadingMessage">Loading...</h1>
        </>:
        <>
          <Navbar favClick={(favValue) => {this.setState({ favoritesClicked: favValue });}}favClickReturn={this.state.favoritesClicked}/>
          <Accountinfo favClick={(favValue) => {this.setState({ favoritesClicked: favValue });}}favClickReturn={this.state.favoritesClicked}/>
        </>}
        </>
      );
  }
}
accountpage.contextType = LoginContext;
export default accountpage;