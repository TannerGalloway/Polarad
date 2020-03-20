import React, { Component } from "react";
import "../../css/navbar.css";
import {Navbar, Button, Form, FormControl, Row, Col, Image} from "react-bootstrap";

import Logo from "../../../Images/Polarad.png";
import HeartInactive from "../../../Images/heart.png";
import HeartActive from "../../../Images/heart_active.png";
import User from "../../../Images/usericon.png";
import Gear from "../../../Images/settingsicon.png";

var url = window.location.pathname.replace(/%20/g, " ");
var favoritesActive = false;
class navbar extends Component {
  constructor(props) {
    super(props);
    this.dropdown = React.createRef();
    this.state = { searchTerm: "", open: false};
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  onChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleButtonClick = () => {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  };

  handleClickOutside = event => {
    if (event.target.id === "userIcon" || event.target.className === "accountDropdown" || event.target.className === "dropdownContent") {
      sessionStorage.setItem("userMenuClicked", true);
      return;
    } else if (this.dropdown.current) {
      this.setState({ open: false });
      sessionStorage.removeItem("userMenuClicked");
    }
  };

  settingslink = () =>{
    window.location.pathname = `/profile/${this.props.displayName}/settings`;
  }

  favoritesClick = (event) => {
    if(url === `/profile/${this.props.displayName}` && sessionStorage.getItem("prevURL") === null){
      favoritesActive = !favoritesActive;
        this.props.favClick(favoritesActive);
    }
    else{
      window.location.pathname = `/profile/${this.props.displayName}`;
    }
  }

  render() {
    var navmenu,
      searchbar,
      webpageName = "Polarad",
      displayNameStyle,
      settingsicon,
      viewportSize = window.screen.width,
      logo;

    var { loggedin, displayName, favClickReturn} = this.props;
    favoritesActive = favClickReturn;
    var Heart = favoritesActive ? HeartActive : HeartInactive;

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
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search"
              onChange={this.onChange}
              className="mr-sm-2, searchbar"
            />
          </Form>
        </Col>
      );
    }

    if (loggedin && viewportSize > 768) {
      navmenu = (
        <Col className="logmenu">
          <Image id="heartIconTop" src={Heart} onClick={this.favoritesClick}/>
          <Image id="userIcon" src={User} onClick={this.handleButtonClick} />
          {this.state.open && (
            <div className="dropdown" ref={this.dropdown}>
              <ul id="ContentContainer">
                <li className="dropdownContent"><a  className="accountDropdown" href={`/profile/${displayName}`}>My Profile</a></li>
                <li className="dropdownContent"><a  className="accountDropdown" href={`/profile/${displayName}/settings`}>Settings</a></li>
                <li className="dropdownContent"><a  className="accountDropdown" href="/">Logoff</a></li>
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
