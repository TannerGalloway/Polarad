import React, { Component } from "react";
import "../../css/accountNavbar.css";
import SearchModal from "../nav/searchModal";

import HomeInactive from "../../../Images/home.png";
import HomeActive from "../../../Images/home_active.png";
import AddPhoto from "../../../Images/addphoto.png";
import HeartInactive from "../../../Images/heart.png";
import HeartActive from "../../../Images/heart_active.png";
import Logout from "../../../Images/logout.png";

var url = window.location.pathname.replace(/%20/g, " ");
var clickFavorites = false;
class accountnavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { homeActive: true };
  }

  componentDidMount(){
    if(url !== `/profile/${this.props.displayName}`){
      this.setState({homeActive: false});
    }
    else if(sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/settings` && sessionStorage.getItem("homeClicked")){
      sessionStorage.removeItem("prevURL");
      sessionStorage.removeItem("homeClicked");
    }
    else if(sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/edit` && sessionStorage.getItem("homeClicked")){
      sessionStorage.removeItem("prevURL");
      sessionStorage.removeItem("homeClicked");
    }
    else if(sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/settings` || sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/edit`){
      clickFavorites = true;
      sessionStorage.removeItem("prevURL");
      this.props.favoritesLink(clickFavorites);
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
          sessionStorage.setItem("homeClicked", true);
          window.location.pathname = `/profile/${this.props.displayName}`;
        }
      break;

      case "heartIconBottom":
          if(!clickFavorites){
            this.setState({homeActive: false});
            if(url === `/profile/${this.props.displayName}`){
              clickFavorites = !clickFavorites;
              this.props.favoritesLink(clickFavorites);
            }
            else{
              window.location.pathname = `/profile/${this.props.displayName}`;
            }
          }
          else{
            this.setState({homeActive: true});
            clickFavorites = !clickFavorites;
            this.props.favoritesLink(clickFavorites);
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
    var Heart = clickFavorites ? HeartActive : HeartInactive;

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

export default accountnavbar;
