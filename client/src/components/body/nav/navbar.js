import React, { Component } from "react";
import "../../css/navbar.css";
import { Navbar, Nav, Button, Form, FormControl, Container, Row, Col } from "react-bootstrap";
import Icon from "../../../Images/Polarad.png";

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
    // var logo;
    // viewportSize > 0 ? logo = 
    //   <img
    //     alt="Polarad"
    //     src={Icon}
    //     width="60"
    //     height="60"
    //     className="d-inline-block align-top"
    //   />
    // : logo = null;

    viewportSize > 768 ? searchbar = 
    <Col>
      <Form inline> 
        <FormControl type="text" placeholder="Search" onChange={this.onChange} className="mr-sm-2" />
      </Form>
    </Col> 
    : searchbar = null;

    return (
          <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Row id="row">
            <Col>
              <Navbar.Brand id="NavbarTitle">
              <img
                alt="Polarad"
                src={Icon}
                width="60"
                height="60"
                className="d-inline-block align-top"
              />
                 Polarad
              </Navbar.Brand>
            </Col>
            {searchbar}
            <Col id="hamburgermenu">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                  <Button variant="primary" href="/Login" className="style">
                    Login
                  </Button>
                  <Button variant="link" href="/">
                    Sign Up
                  </Button>
                </Nav>
              </Navbar.Collapse>
            </Col>
        </Row>
          </Navbar>
    );
  }
}

export default navbar;
