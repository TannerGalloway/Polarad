import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import Navbar from "./nav/navbar";
import Bottomnav from "../body/nav/mobileNavbar";
import LoginContext from "../../loginContext";
import "../css/followingFollowers.css";
import Axios from "axios";

function Followingfollowers(props) {
  var loggedUser = "",
  mobileNavBottom,
  viewportSize = window.screen.width,
  UserDataArray;
  var [favoritesClicked, setFavoritesClicked] = useState(false);

  useEffect(() => {
    Axios.get("/SetPrevURL");
    if(window.location.pathname === `/profile/${loggedUser}/following`){
      Axios.get(`/following/${loggedUser}`).then((followingUserRes) => {
        followDesign(followingUserRes.data.following);
      });
    }
    else if(window.location.pathname === `/profile/${loggedUser}/followers`){
      Axios.get(`/followers/${loggedUser}`).then((userFollowersRes) => {
        Axios.get(`/following/${loggedUser}`).then((userfollowingRes) => {
          followDesign(userfollowingRes.data.following, userFollowersRes.data);
         });
       });
    }
  });

  function followDesign(followingArray, followersArray){
    var UrlDataArray = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1) + "Array";
    if(UrlDataArray === "followingArray"){
      UserDataArray = followingArray;
    }
    else if(UrlDataArray === "followersArray"){
      UserDataArray = followersArray;
    }
    if (UserDataArray.length > 0) {
      document.getElementById("followMessage").remove();
      for (var i = 0; i < UserDataArray.length; i++) {

        // dynamicaly create the following/followers elements.
        var followingUserRow = document.createElement("div");
        var followingUserCol = document.createElement("div");
        var usernameCol = document.createElement("a");
        var followBtnCol = document.createElement("div");
        var followingProfileImgCol = document.createElement("div");
        var followingProfileImg = document.createElement("img");
        var followBtn = document.createElement("button");

        followingUserRow.classList = "row userRow";
        followBtnCol.classList = "followBtnCol";
        usernameCol.classList = "bold card-body";

        followingProfileImg.classList = "rounded-circle profileImgFollow";
        followingProfileImg.setAttribute("src", "https://via.placeholder.com/48");
        usernameCol.classList = "usernameLink";
        followBtn.setAttribute("id", i);
        followingUserRow.setAttribute("id", `user${i}`);

        if(window.location.pathname === `/profile/${loggedUser}/following`){
          followBtn.classList = "followingBtn btn btn-light";
          usernameCol.setAttribute("href", `/profile/${UserDataArray[i]}`);
          usernameCol.innerHTML = UserDataArray[i];
          followBtn.addEventListener("mouseenter", followHover);
          followBtn.addEventListener("mouseleave", followHover);
          followBtn.addEventListener("click", unfollowClick);

          if(viewportSize < 768){
            followBtn.innerHTML = "Unfollow";
          }
          else{
            followBtn.innerHTML = "Following";
          }
        }
        else if(window.location.pathname === `/profile/${loggedUser}/followers`){
          for (var j = 0; j < followingArray.length; j++){
            if(followersArray[i].username === followingArray[j]){
              followBtn.classList = "followingBtn btn btn-light";
              followBtn.innerHTML = "Following";
              followBtn.addEventListener("mouseenter", followHover);
              followBtn.addEventListener("mouseleave", followHover);
              followBtn.addEventListener("click", unfollowClick);
            }
            else{
              followBtn.classList = "followersBtn btn btn-primary";
              followBtn.innerHTML = "Follow";
              followBtn.addEventListener("click", followclick);
            }
          }
          if(followingArray.length === 0){
            followBtn.classList = "followersBtn btn btn-primary";
            followBtn.innerHTML = "Follow";
            followBtn.addEventListener("click", followclick);
          }
          usernameCol.setAttribute("href", `/profile/${UserDataArray[i].username}`);
          usernameCol.innerHTML = UserDataArray[i].username;
        }

        followBtnCol.appendChild(followBtn);
        followingUserCol.appendChild(usernameCol);
        followingProfileImgCol.appendChild(followingProfileImg);

        followingUserRow.appendChild(followingProfileImgCol);
        followingUserRow.appendChild(followingUserCol);
        followingUserRow.appendChild(followBtnCol);

        document.getElementsByClassName("card")[0].appendChild(followingUserRow);
      }
    }
  };

  // hover text following/unfollow
  function followHover(event) {
    var followBtn = document.getElementById(event.target.id);
    if(followBtn !== undefined){
      switch (followBtn.innerHTML) {
        case "Unfollow":
          followBtn.innerHTML = "Following";
          break;
  
        case "Following":
          followBtn.innerHTML = "Unfollow";
          break;
  
        default:
          followBtn.innerHTML = "Follow";
          break;
      }
    }
  }

  // handle unfollow button click
  function unfollowClick(event) {
    var followedUser = event.path[2].children[1].children[0].innerText;
    Axios.post("/RemoveFollowing", {
      username: loggedUser,
      UpdateFollowing: followedUser,
    });
    
    if(window.location.pathname === `/profile/${loggedUser}/following`){
      document.getElementById(`user${event.target.id}`).remove();
    }
    else if(window.location.pathname === `/profile/${loggedUser}/followers`){
      var unfollowBtn = document.getElementById(`${event.target.id}`);
      unfollowBtn.classList.remove("followingBtn", "btn-light");
      unfollowBtn.classList.add("followersBtn", "btn-primary");
      unfollowBtn.removeEventListener("mouseenter", followHover);
      unfollowBtn.removeEventListener("mouseleave", followHover);
      unfollowBtn.removeEventListener("click", unfollowClick);
      unfollowBtn.innerHTML = "Follow";
    }
    if(document.getElementsByClassName("userRow").length === 0){
      var followCard = document.getElementsByClassName("card")[0];
      var followingMessageDiv = document.createElement("div");

      followingMessageDiv.className = "card-body";
      followingMessageDiv.setAttribute("id", "followMessage");
      followingMessageDiv.innerHTML = "You have not followed anyone yet!";

      followCard.appendChild(followingMessageDiv);
    }
  }

  // handle follow buttom click
  function followclick(event) {
    var followBtn = document.getElementById(`${event.target.id}`);
    var followedUser = event.path[2].children[1].children[0].innerText;
    followBtn.classList.add("followingBtn", "btn-light");
    followBtn.classList.remove("followersBtn", "btn-primary");
    followBtn.innerHTML  = "Unfollow";
    followBtn.addEventListener("mouseenter", followHover);
    followBtn.addEventListener("mouseleave", followHover);
    followBtn.addEventListener("click", unfollowClick);
    Axios.post("/AddFollowing", {
      username: loggedUser,
      newFollowing: followedUser
  });
  };
  
  return (
    <LoginContext.Consumer>
      {(logininfo) => {
        loggedUser = logininfo.loginUser.user;
        if(viewportSize < 768){
          mobileNavBottom = <Bottomnav favoritesLink={(favoriteValue) => {props.favhandle(favoriteValue)}}/>;
        }
        return (
          <>
            <Navbar favClick={(favValue) => {setFavoritesClicked({favoritesClicked: favValue})}} favClickReturn={favoritesClicked}/>
            <Container>
              <Card>
                <Card.Header>{props.title}</Card.Header>
                <Card.Body id="followMessage">{props.message}</Card.Body>
              </Card>
            </Container>
            {mobileNavBottom}
          </>
        );
      }}
    </LoginContext.Consumer>
  );
}
export default Followingfollowers;