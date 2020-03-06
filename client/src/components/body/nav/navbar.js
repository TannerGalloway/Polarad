import React, { Component } from "react";
import "../../css/navbar.css";
import {
  Navbar,
  Button,
  Form,
  FormControl,
  Row,
  Col
} from "react-bootstrap";
import Logo from "../../../Images/Polarad.png";

class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { searchTerm: "" };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    var viewportSize = window.screen.width;
    var searchbar;
    var logo;

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
          <Col id="hamburgermenu">
            <Button variant="primary" href="/Login" className="btnSize">
              Login
            </Button>
            <Button variant="link" href="/" className="btnSize">
              Sign Up
            </Button>
          </Col>
        </Row>
      </Navbar>
    );
  }
}

export default navbar;
