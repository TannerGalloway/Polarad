import React, { Component } from "react";
import "../../css/desktopMobileView.css";
import { Row, Col, Button } from "react-bootstrap";

function mobileView(props){
    const {displayName, posts, followers, following, bio} = props;
    return(
      <>
      <Col>
        <div id="nameBtnCol">
          <p id="displayname">{`${displayName}`}</p>
          <Button id="nameBtn" variant="primary">
            Follow
          </Button>
        </div>
        </Col>
        <Row>
          <h6 id="biotext">{`${bio}`}</h6>
          <hr className="line"/>
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
          <hr className="line"/>
        </Row>
        </>
    )
}

export default mobileView;