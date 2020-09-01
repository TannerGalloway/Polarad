import React, { Component } from "react";
import "../../css/mobileNavbar.css";
import LoginContext from "../../../loginContext";
import SearchModal from "../nav/searchModal";
import HomeInactive from "../../../Images/home.png";
import HomeActive from "../../../Images/home_active.png";
import AddPhoto from "../../../Images/addphoto.png";
import HeartInactive from "../../../Images/heart.png";
import HeartActive from "../../../Images/heart_active.png";
import Logout from "../../../Images/logout.png";
import Axios from "axios";

class mobileNavbar extends Component {
  constructor(props) {
    super(props);
    this.clickFavorites = false;
    this.homeActive = false;
    this.url = window.location.pathname.replace(/%20/g, " ");
  }

  toggleIcon = (event) => {
    switch(event.target.id){
      case "homeIcon":
        if(!this.homeActive){
          this.homeActive = !this.homeActive;
          sessionStorage.setItem("userMenuClicked", true);
          window.location.pathname = `/profile/${this.context.loginUser.user}`;
        }
      break;

      case "heartIconBottom":
          if(this.clickFavorites){
            this.homeActive = true;
              this.clickFavorites = !this.clickFavorites;
              this.props.favoritesLink(this.clickFavorites);
          }
          else{
            this.homeActive = false;
            this.clickFavorites = !this.clickFavorites;
            this.props.favoritesLink(this.clickFavorites);
            if(this.url === `/profile/${this.context.loginUser.user}/settings` || this.url === `/profile/${this.context.loginUser.user}/edit`){
              window.location.pathname = `/profile/${this.context.loginUser.user}`;
            }
          }
       break;
      
      case "logoutIcon":
        Axios.get("/logout").then((logoutRes) => {
          sessionStorage.removeItem("userMenuClicked");
          window.location.pathname = logoutRes.data.redirect;
        }).catch((err) => {console.log(err.response)});
        break;

      default:
      break;
    }
  }

  render() {
    if(this.url !== `/profile/${this.context.loginUser.user}`){
      this.homeActive = false;
    
    }
    else if(this.props.favoritesLinkReturn){
      this.clickFavorites = true;
      this.homeActive = false;
    }
    else{
      this.homeActive = true;
    }
    var Home = this.homeActive ? HomeActive : HomeInactive;
    var Heart = this.clickFavorites ? HeartActive : HeartInactive;

    return (
      <>
        <div id="accountlinks">
          <img
            id="homeIcon"
            alt="Home"
            src={Home}
            width="60"
            height="60"
            onClick={this.toggleIcon}
          />

          <SearchModal/>

          <img
            id="addPhotoIcon"
            alt="AddPhoto"
            src={AddPhoto}
            width="60"
            height="60"
          />

          <img
            id="heartIconBottom"
            alt="Favorite"
            src={Heart}
            width="60"
            height="60"
            onClick={this.toggleIcon}
          />

          <img
            id="logoutIcon"
            alt="Logout"
            src={Logout}
            width="60"
            height="60"
            onClick={this.toggleIcon}
          />
        </div>
      </>
    );
  }
}
mobileNavbar.contextType = LoginContext;

export default mobileNavbar;