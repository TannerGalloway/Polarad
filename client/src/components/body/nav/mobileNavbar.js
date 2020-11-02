import React, { Component } from "react";
import "../../css/mobileNavbar.css";
import LoginContext from "../../../loginContext";
import SearchModal from "../nav/searchModal";
import HomeInactive from "../../../Images/home.png";
import HomeActive from "../../../Images/home_active.png";
import AddPhoto from "../../../Images/addphoto.png";
import HeartInactive from "../../../Images/heart.png";
import HeartActive from "../../../Images/heart_active.png";
import User from "../../../Images/usericon.png";
import Axios from "axios";
import {Link} from "react-router-dom";

class mobileNavbar extends Component {
  constructor(props) {
    super(props);
    this.clickFavorites = false;
    this.homeActive = false;
    this.url = window.location.pathname.replace(/%20/g, " ");
    this.dropdown = React.createRef();
    this.state = {dropdownOpen: false};
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutsideUser);
    setTimeout(() => {sessionStorage.setItem("userMenuClicked", false);}, 1000);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutsideUser);
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
            if(this.url === `/profile/${this.context.loginUser.user}/settings` || this.url === `/profile/${this.context.loginUser.user}/edit` || this.url === `/profile/${this.context.loginUser.user}/following` || this.url === `/profile/${this.context.loginUser.user}/followers`){
              window.location.pathname = `/profile/${this.context.loginUser.user}`;
            }
          }
       break;
      
      default:
      break;
    }
  }

  logout = () => {
    Axios.get("/logout").then((logoutRes) => {
      sessionStorage.removeItem("userMenuClicked");
      window.location.pathname = logoutRes.data.redirect;
    }).catch((err) => {console.log(err.response)});
  };

   // dropdown Open/close account dropdown
  handleButtonClick = () => {
    this.setState((prevState) => {
      return { dropdownOpen: !prevState.dropdownOpen };
    });
  };

   // if user clicks outside of the account dropdown
   handleClickOutsideUser = (event) => {
    if (
      event.target.id === "userIcon" ||
      event.target.className === "accountDropdownMobile" ||
      event.target.className === "dropdownContentMobile"
    ) {
      sessionStorage.setItem("userMenuClicked", true);
      return;
    } else if (this.dropdown.current) {
      this.setState({ dropdownOpen: false });
      sessionStorage.removeItem("userMenuClicked");
    }
  };

  render() {
    var navmenu;
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

    navmenu = (
      <>
      <img
            id="userIcon"
            alt="user"
            src={User}
            width="60"
            height="60"
            onClick={this.handleButtonClick}
          />
      {this.state.dropdownOpen && (
        <div className="dropdownMobile" ref={this.dropdown}>
          <ul id="ContentContainerMobile">
            <li className="dropdownContentMobile">
              <Link to={`/profile/${this.context.loginUser.user}/following`} className="accountDropdownMobile">Following</Link>
            </li>
            <hr className="lineMobile" />
            <li className="dropdownContentMobile">
              <Link to={`/profile/${this.context.loginUser.user}/followers`} className="accountDropdownMobile">Followers</Link>
            </li>
            <hr className="lineMobile" />
            <li className="dropdownContentMobile" onClick={this.logout}>Logout</li>
          </ul>
        </div>
      )}
      </>
    );

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

          {navmenu}
        </div>
      </>
    );
  }
}
mobileNavbar.contextType = LoginContext;
export default mobileNavbar;