import React from "react";
import "../../css/desktopMobileView.css";
import LoginContext from "../../../loginContext";
import { Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function mobileView(props) {
  var { displayName, posts, followers, following, bio, accountpageView } = props;
  var profileBtn;
  return (
    <LoginContext.Consumer>
      {(logininfo) => {
        if (accountpageView) {
          profileBtn = (
            <Link to={`/profile/${logininfo.loginUser.user}/edit`}>
              <Button className="nameBtn" variant="light">
                Edit Profile
              </Button>
            </Link>
          );
        } else {
          profileBtn = (
            <Button className="nameBtn" variant="primary">
              Follow
            </Button>
          );
        }
        return (
          <>
            <Col>
              <div id="nameBtnCol">
                <p id="displayname">{`${displayName}`}</p>
                {profileBtn}
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
            <hr className="line" />
          </>
        );
      }}
    </LoginContext.Consumer>
  );
}

export default mobileView;