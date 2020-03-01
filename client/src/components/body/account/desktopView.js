import React, { Component } from "react";
import "../../css/desktopMobileView.css";
import { Button } from "react-bootstrap";

function desktopView(props){
    const {displayName, posts, followers, following, bio} = props;
    return(
      <>
        <div id="nameBtnCol">
          <p id="displayname">{`${displayName}`}</p>
          <Button id="nameBtn" variant="primary">
            Follow
          </Button>
          <ul id="accountNumsList">
            <li className="accountNums">
              <span className="bold">{`${posts}`}</span> posts
            </li>
            <li className="accountNums">
              <span className="bold">{`${followers}`}</span> followers
            </li>
            <li className="accountNums">
              <span className="bold">{`${following}`}</span> following
            </li>
          </ul>
          <h6 id="biotext">{`${bio}`}</h6>
        </div>
        <hr className="line"/>
        </>
    )
}

export default desktopView;