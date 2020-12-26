import React, { useEffect } from "react";
import "../../css/desktopMobileView.css";
import LoginContext from "../../../loginContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";

function DesktopView(props) {
  var {
    posts,
    followers,
    following,
    bio,
    accountpageView,
    displayName
  } = props;
  var profileBtn,  
  followClicked = React.createRef(),
  loggedUser = "",
  loggedStatus = false;

  // check if user is being followed
  useEffect(() => {
    if(loggedStatus){
      var followButton = document.getElementsByClassName("nameBtn")[0];
      Axios.get(`/following/${loggedUser}`).then((res) => {
        for(var i = 0; i < res.data.following.length; i++){
          if(res.data.following[i].username === window.location.pathname.slice(9)){
           followClicked.current = true;
           followButton.classList.remove("btn-primary");
           followButton.classList.add("btn-light");
           followButton.innerHTML = "✓ Following";
         }
        }
       });
    }
  });
  
  // hover text following/unfollow
  function followHover() {
    var followBtn = document.getElementsByClassName("nameBtn")[0];
    switch(followBtn.innerHTML){
      case "✖ Unfollow":
        followBtn.innerHTML  = "✓ Following";
      break;

      case "✓ Following":
        followBtn.innerHTML  = "✖ Unfollow";
      break;

      default:
        followBtn.innerHTML  = "Follow";
      break;
    }
  };

  // handle follow buttom click
  function followclick(event) {
    var followButton = document.getElementsByClassName("nameBtn")[0];
    if(followButton.classList.contains("btn-primary")){
      followClicked.current = true;
    }else{
      followClicked.current = false;
    }
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
        loggedStatus = logininfo.loginUser.status;
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
          else if(!followClicked.current){
            profileBtn = (
                <Button className="nameBtn" variant="primary" onClick={followclick} onMouseEnter={followHover} onMouseLeave={followHover}>
                Follow
                </Button>
            );
          }
        }

        return (
          <>
            <div id="nameBtnCol">
              <p id="displayname">{`${displayName}`}</p>
              {profileBtn}
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
            <hr className="line" />
          </>
        );
      }}
    </LoginContext.Consumer>
  );
}
export default DesktopView;