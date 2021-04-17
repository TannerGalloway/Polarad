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
      left: 47%;
      margin-top: -50px;
      margin-left: -50px;
    `;
  }

  componentDidMount() {
    this._isMounted = true;

    // loading page state update
    setTimeout(() => {
      this._isMounted && this.setState({ loading: false })}, 1000);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
      return (
        <>
        {this.state.loading?
        <>
          <MoonLoader
            css={this.loadingCss}
            size={65}
            color={"#007bff"}
            loading={this.state.loading}
          />
          <h1 className="loadingMessage">Loading...</h1>
        </>:
        <>
          <Navbar favClick={(favValue) => {this.setState({ favoritesClicked: favValue });}}/>
          <Accountinfo favClickReturn={this.state.favoritesClicked}/>
        </>}
        </>
      );
  }
}
accountpage.contextType = LoginContext;
export default accountpage;