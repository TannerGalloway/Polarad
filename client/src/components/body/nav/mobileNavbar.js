import React, { Component } from "react";
import "../../css/mobileNavbar.css";
import LoginContext from "../../../loginContext";
import SearchModal from "../nav/searchModal";
import NewPostModal from "../nav/newPostModal";
import HomeInactive from "../../../Images/home.png";
import HomeActive from "../../../Images/home_active.png";
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
        this.clickFavorites = !this.clickFavorites;
        sessionStorage.setItem("favbtnClicked", this.clickFavorites);
        if(this.url !== `/profile/${this.context.loginUser.user}`){
          window.location.pathname = `/profile/${this.context.loginUser.user}`;  
        }
        this.props.favoriteClicked(this.clickFavorites);
        this.forceUpdate();
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
    else if(sessionStorage.getItem("favbtnClicked") === "true"){
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
            <li className="dropdownContentMobile">
              <Link to={`/profile/${this.context.loginUser.user}/followers`} className="accountDropdownMobile">Followers</Link>
            </li>
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

          <NewPostModal/>

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