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
  viewportSize = window.screen.width;
  var [favoritesClicked, setFavoritesClicked] = useState(false);

  useEffect(() => {
    Axios.get("/SetPrevURL");
    Axios.get(`/following/${loggedUser}`).then((res) => {
      if (res.data.following.length > 0) {
        document.getElementById("followMessage").remove();
        for (var i = 0; i < res.data.following.length; i++) {

          // dynamicaly create the following elements.
          var followingUserRow = document.createElement("div");
          var followingUserCol = document.createElement("div");
          var usernameCol = document.createElement("a");
          var followBtnCol = document.createElement("div");
          var followingProfileImgCol = document.createElement("div");
          var followingProfileImg = document.createElement("img");
          var followBtn = document.createElement("button");

          followingUserRow.className = "row userRow";
          followBtnCol.className = "followBtnCol";
          usernameCol.className = "bold card-body";
          followBtn.className = "followingBtn btn btn-light";
          followingProfileImg.className = "rounded-circle profileImgFollow";

          followingProfileImg.setAttribute("src", "https://via.placeholder.com/48");
          usernameCol.setAttribute("href", `/profile/${res.data.following[i]}`);
          usernameCol.setAttribute("id", "usernameLink");
          followBtn.setAttribute("id", i);
          followingUserRow.setAttribute("id", `user${i}`);

          usernameCol.innerHTML = res.data.following[i];
          if(viewportSize < 768){
            followBtn.innerHTML = "Unfollow";
          }
          else{
            followBtn.innerHTML = "Following";
          }

          followBtn.addEventListener("mouseenter", followHover);
          followBtn.addEventListener("mouseleave", followHover);
          followBtn.addEventListener("click", unfollowClick);

          followBtnCol.appendChild(followBtn);
          followingUserCol.appendChild(usernameCol);
          followingProfileImgCol.appendChild(followingProfileImg);

          followingUserRow.appendChild(followingProfileImgCol);
          followingUserRow.appendChild(followingUserCol);
          followingUserRow.appendChild(followBtnCol);

          document.getElementsByClassName("card")[0].appendChild(followingUserRow);
        }
      }
    });
  });

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
    document.getElementById(`user${event.target.id}`).remove();
    if(document.getElementsByClassName("userRow").length === 0){
      var followCard = document.getElementsByClassName("card")[0];
      var followingMessageDiv = document.createElement("div");

      followingMessageDiv.className = "card-body";
      followingMessageDiv.setAttribute("id", "followMessage");
      followingMessageDiv.innerHTML = "You have not followed anyone yet!";

      followCard.appendChild(followingMessageDiv);
    }
  }


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