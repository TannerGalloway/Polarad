import React, { Component } from "react";
import "../../css/navbar.css";
import {
  Navbar,
  Button,
  Form,
  FormControl,
  Row,
  Col,
  Image
} from "react-bootstrap";

import Logo from "../../../Images/Polarad.png";
import Heart from "../../../Images/heart.png";
import User from "../../../Images/usericon.png";
import Gear from "../../../Images/settingsicon.png";

class navbar extends Component {
  constructor(props) {
    super(props);
    this.dropdown = React.createRef();
    this.state = { searchTerm: "", open: false };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  onChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  handleButtonClick = () => {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  };

  handleClickOutside = event => {
    if (event.target.id === "userIcon") {
      return;
    } else if (this.dropdown.current) {
      this.setState({ open: false });
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
    var { loggedin, displayName } = this.props;

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
          <Image id="heartIconTop" src={Heart} />
          <Image id="userIcon" src={User} onClick={this.handleButtonClick} />
          {this.state.open && (
            <div className="dropdown" ref={this.dropdown}>
              <ul id="ContentContainer">
                <li className="dropdownContent">Settings</li>
                <li className="dropdownContent">Logoff</li>
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
