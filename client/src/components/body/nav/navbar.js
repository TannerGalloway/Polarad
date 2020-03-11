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
    } else if (
      this.dropdown.current
    ) {
      this.setState({ open: false });
    }
  };

  render() {
    var navmenu,
      logo,
      searchbar,
      viewportSize = window.screen.width;
    var { loggedin } = this.props;

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
          <Image id="heartIcon" src={Heart} />
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
    } else {
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
              Polarad
            </Navbar.Brand>
          </Col>
          {searchbar}
          {navmenu}
        </Row>
      </Navbar>
    );
  }
}

export default navbar;
