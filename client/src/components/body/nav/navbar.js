import React, { Component } from "react";
import "../../css/navbar.css";
import {Navbar, Button, Form, FormControl, Row, Col, Image, OverlayTrigger, Popover} from "react-bootstrap";

import Logo from "../../../Images/Polarad.png";
import HeartInactive from "../../../Images/heart.png";
import HeartActive from "../../../Images/heart_active.png";
import User from "../../../Images/usericon.png";
import Gear from "../../../Images/settingsicon.png";
import Axios from "axios";

class navbar extends Component {
  constructor(props) {
    super(props);
    this.url = window.location.pathname.replace(/%20/g, " ");
    this.favoritesActive = false;
    this.dropdown = React.createRef();
    this.state = { open: false };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutsideUser);
    document.addEventListener("mousedown", this.handleClickOutsideSearch);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutsideUser);
    document.removeEventListener("mousedown", this.handleClickOutsideSearch);
  }

  // searchbar error
  userSearchError = () => {
    for(var e = 0; e<document.getElementsByClassName("popover-body")[0].childNodes.length; e++){
      document.getElementsByClassName("popover-body")[0].removeChild(document.getElementsByClassName("popover-body")[0].childNodes[e]);
    }
      var searchError = document.createElement("div");
      searchError.className = "row resultsRow";

      var errorMessage = document.createElement("p");
      errorMessage.setAttribute("id", "userError");
      errorMessage.innerHTML = "No results found.";

      searchError.appendChild(errorMessage);
      document.getElementsByClassName("popover-body")[0].appendChild(searchError);

  };

  // searchbar search/results function
  userSearch = (searchTerm) => {
    if(searchTerm.target.value === ""){
      this.userSearchError();
    }
   else if (searchTerm.target.value !== "") {
      Axios.get(`/userSearch/${searchTerm.target.value}`).then((user) => {
        if(user.data.length === 0){
          this.userSearchError();
        }
        else{
          var rowContainer = document.createElement("div");
          rowContainer.setAttribute("class", "resultsContainer");
          
          for(var s = 0; s<document.getElementsByClassName("popover-body")[0].childNodes.length; s++){
            document.getElementsByClassName("popover-body")[0].removeChild(document.getElementsByClassName("popover-body")[0].childNodes[s]);
          }
  
          for( var i = 0; i < user.data.length; i++){
            var userLink = document.createElement("a");
            userLink.className = "row resultsRow";
            userLink.setAttribute("href", `/profile/${user.data[i]}`);
  
            var colDivImage = document.createElement("div");
            colDivImage.setAttribute("class", "col");
            
            var colDivUser = document.createElement("div");
            colDivUser.setAttribute("class", "col");
  
            var profileImg =  document.createElement("img");
            profileImg.setAttribute("id", "searchPic");
            profileImg.setAttribute("src", "https://via.placeholder.com/32");
            profileImg.setAttribute("class", "rounded-circle");
  
            var usernameText = document.createElement("p");
            usernameText.setAttribute("id", "user");
            usernameText.innerHTML = user.data[i];

            colDivImage.appendChild(profileImg);
            colDivUser.appendChild(usernameText);
            userLink.appendChild(colDivImage);
            userLink.appendChild(colDivUser);
            rowContainer.appendChild(userLink);

            if(i !== user.data.length -1){
              userLink.style.removeProperty("border-bottom");
            }

            document.getElementsByClassName("popover-body")[0].appendChild(rowContainer);
          }
        }
      });
    }
  };

  // logout function
  logout = () => {
    Axios.get("/logout")
      .then((redirect) => {
        var userAuth = { status: false };
        localStorage.setItem("userAuth", JSON.stringify(userAuth));
        window.location.pathname = redirect.data;
        sessionStorage.removeItem("userMenuClicked");
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // open/close account dropdown
  handleButtonClick = () => {
    this.setState((prevState) => {
      return { open: !prevState.open };
    });
  };

  // if user clicks outside of the account dropdown
  handleClickOutsideUser = (event) => {
    if (
      event.target.id === "userIcon" ||
      event.target.className === "accountDropdown" ||
      event.target.className === "dropdownContent"
    ) {
      sessionStorage.setItem("userMenuClicked", true);
      return;
    } else if (this.dropdown.current) {
      this.setState({ open: false });
      sessionStorage.removeItem("userMenuClicked");
    }
  };

  settingslink = () => {
    window.location.pathname = `/profile/${this.props.displayName}/settings`;
  };

  // user clicked on favorites button
  favoritesClick = () => {
    if (
      this.url === `/profile/${this.props.displayName}` &&
      sessionStorage.getItem("prevURL") === null
    ) {
      this.favoritesActive = !this.favoritesActive;
      this.props.favClick(this.favoritesActive);
    } else {
      window.location.pathname = `/profile/${this.props.displayName}`;
    }
  };

  render() {
    var navmenu,
      searchbar,
      webpageName = "Polarad",
      displayNameStyle,
      settingsicon,
      viewportSize = window.screen.width,
      logo;

    var { loggedin, displayName, favClickReturn } = this.props;
    this.favoritesActive = favClickReturn;
    var Heart = this.favoritesActive ? HeartActive : HeartInactive;

    if (viewportSize > 768) {
      logo = (
        <img
          alt="Polarad"
          src={Logo}
          width="60"
          height="60"
          className="d-inline-block align-top"
        />
      );

      searchbar = (
        <Col>
          <OverlayTrigger
            trigger="focus"
            key={"bottom"}
            placement={"bottom"}
            overlay={
              <Popover id={"popover-positioned-bottom"}>
                <Popover.Content>
                 <div className="row resultsRow">
                   <p id="userError">No results found.</p>
                 </div>
                </Popover.Content>
              </Popover>
            }
          >
            <Form inline>
              <FormControl
                id="search"
                type="text"
                placeholder="Search"
                onChange={this.userSearch}
                className="mr-sm-2, searchbar"
              />
            </Form>
          </OverlayTrigger>
        </Col>
      );
    }

    if (loggedin && viewportSize > 768) {
      navmenu = (
        <Col className="logmenu">
          <Image id="heartIconTop" src={Heart} onClick={this.favoritesClick} />
          <Image id="userIcon" src={User} onClick={this.handleButtonClick} />
          {this.state.open && (
            <div className="dropdown" ref={this.dropdown}>
              <ul id="ContentContainer">
                <li className="dropdownContent">
                  <a className="accountDropdown" href={`/profile/${displayName}`}>
                    My Profile
                  </a>
                </li>
                <li className="dropdownContent">
                  <a className="accountDropdown" href={`/profile/${displayName}/settings`}>
                    Settings
                  </a>
                </li>
                <li onClick={this.logout} className="dropdownContent">
                  logout
                </li>
              </ul>
            </div>
          )}
        </Col>
      );
    } else if (loggedin && viewportSize < 768) {
      webpageName = "";
      logo = (
        <img
          alt="Polarad"
          src={Logo}
          width="60"
          height="60"
          className="d-inline-block align-top"
        />
      );
      displayNameStyle = (
        <Col>
          <h4 id="navdisplayName">{displayName}</h4>
        </Col>
      );
      settingsicon = (
        <img
          id="settingsGear"
          alt="settings"
          src={Gear}
          width="42"
          height="42"
          onClick={this.settingslink}
        />
      );
    } else if (!loggedin) {
      navmenu = (
        <Col className="btnmenu">
          <Button variant="primary" href="/Login" className="btnSize">
            Login
          </Button>
          <Button variant="link" href="/" className="btnSize">
            Sign Up
          </Button>
        </Col>
      );
    }

    return (
      <Navbar expand="lg" bg="light" variant="light">
        <Row id="row">
          <Col xs={4}>
            <Navbar.Brand id="NavbarTitle">
              {logo}
              {webpageName}
            </Navbar.Brand>
          </Col>
          {displayNameStyle}
          {settingsicon}
          {searchbar}
          {navmenu}
        </Row>
      </Navbar>
    );
  }
}

export default navbar;