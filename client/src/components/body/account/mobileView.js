import React, { useEffect } from "react";
import "../../css/desktopMobileView.css";
import LoginContext from "../../../loginContext";
import { Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";

function MobileView(props) {
  var { displayName, posts, followers, following, bio, accountpageView } = props;
  var profileBtn,  followClicked = React.createRef(),  loggedUser = "";

  useEffect(() => {
    var followButton = document.getElementsByClassName("nameBtn")[0];
      Axios.get("/following").then((res) => {
       for(var i = 0; i < res.data.following.length; i++){
         if(res.data.following[i] === window.location.pathname.slice(9)){
          followClicked.current = true;
          followButton.classList.remove("btn-primary");
          followButton.classList.add("btn-light");
          followButton.innerHTML = "✖ Unfollow";
        }
       }
      });
  });

  // handle follow buttom click
  function followclick(event) {
    followClicked.current = !followClicked.current;
      if(followClicked.current){
        event.target.classList.remove("btn-primary");
        event.target.classList.add("btn-light");
        event.target.innerHTML  = "✖ Unfollow";
        Axios.post("/AddFollowing", {
          username: loggedUser,
          newFollowing: window.location.pathname.slice(9)
      });
      }
      else{
        event.target.classList.remove("btn-light");
        event.target.classList.add("btn-primary");
        event.target.innerHTML  = "Follow";
        Axios.post("/RemoveFollowing", {
          username: loggedUser,
          UpdateFollowing: window.location.pathname.slice(9)
      });
      }
  };
  
  return (
    <LoginContext.Consumer>
      {(logininfo) => {
        loggedUser = logininfo.loginUser.user;
        if (accountpageView) {
          profileBtn = (
            <Link to={`/profile/${logininfo.loginUser.user}/edit`}>
              <Button className="nameBtn" variant="light">
                Edit Profile
              </Button>
            </Link>
          );
        } else {
          if(!logininfo.loginUser.status){
            profileBtn = (
              <Link to={"/login"}>
                <Button className="nameBtn" variant="primary">
                Follow
                </Button>
              </Link>
            );
          }
          else{
            profileBtn = (
                <Button className="nameBtn" variant="primary" onClick={followclick}>
                Follow
                </Button>
            );
          }
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

export default MobileView;