import React from "react";
import "../../css/desktopMobileView.css";
import { Col, Button } from "react-bootstrap";

function mobileView(props) {
  var { displayName, posts, followers, following, bio, loggedin } = props;
  var loggedBtn;
  loggedin
    ? (loggedBtn = (
        <Button className="nameBtn" variant="light" href={`/profile/${displayName}/edit`}>
          Edit Profile
        </Button>
      ))
    : (loggedBtn = (
        <Button className="nameBtn" variant="primary">
          Follow
        </Button>
      ));
  return (
    <>
      <Col>
        <div id="nameBtnCol">
          <p id="displayname">{`${displayName}`}</p>
          {loggedBtn}
          <h6 id="biotext">{`${bio}`}</h6>
        </div>
      </Col>
        <hr className="line" />
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
    </>
  );
}

export default mobileView;