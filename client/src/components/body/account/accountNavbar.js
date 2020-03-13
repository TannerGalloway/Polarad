import React, { Component } from "react";
import "../../css/accountNavbar.css";

import HomeInactive from "../../../Images/home.png";
import HomeActive from "../../../Images/home_active.png";
import Search from "../../../Images/search.png";
import AddPhoto from "../../../Images/addphoto.png";
import HeartInactive from "../../../Images/heart.png";
import HeartActive from "../../../Images/heart_active.png";
import Logout from "../../../Images/logout.png";

class accountnavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { homeActive: true, favorites: false };
  }

  componentDidMount(){
    var url = window.location.pathname.replace(/%20/g, " ");
    if(url !== `/profile/${this.props.displayName}`){
      this.setState({homeActive: false});
    }
    else{
      this.setState({homeActive: true});
    }
  }

  toggleIcon = (event) => {
    switch(event.target.id){
      case "homeIcon":
        if(!this.state.homeActive){
          this.setState((prevState)  => ({homeActive: !prevState.homeActive}));
          this.setState(({favorites: false}));
          var url = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
          window.location.pathname = url;
        }
      break;

      case "heartIconBottom":
        if(this.state.favorites){
          this.setState(({homeActive: false}));
        }
        else{
          this.setState((prevState)  => ({favorites: !prevState.favorites}));
          this.setState(({homeActive: false}));
        }
       break;
      
      case "logoutIcon":
        window.location.pathname = "/";
        break;

      default:
      break;
    }
  }

  render() {
    var Home = this.state.homeActive ? HomeActive : HomeInactive;
    var Heart = this.state.favorites ? HeartActive : HeartInactive;
    
    return (
      <div id="accountlinks">
        <img
          id="homeIcon"
          alt="Home"
          src={Home}
          width="60"
          height="60"
          onClick={this.toggleIcon}
        />
        <img
          id="searchIcon"
          alt="Search"
          src={Search}
          width="60"
          height="60"
        />

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
    );
  }
}

export default accountnavbar;
