import React, { Component } from "react";
import Navbar from "../nav/navbar";
import Bottomnav from "../nav/accountNavbar";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";

var url = window.location.pathname.replace(/%20/g, " ");
class accountEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {bio: ""};
  }

  bioChange = (event) => {
      this.setState({bio: event.target.value});
  }

  render() {
    sessionStorage.setItem("prevURL", url);
    var viewportSize = window.screen.width, mobileNavBottom;

    if(viewportSize < 768){
      mobileNavBottom = this.props.loggedin ? <Bottomnav displayName={this.props.displayName}/> : null;
    }

    return (
      <>
        <Navbar loggedin={this.props.loggedin} displayName={this.props.displayName}/>
        <Container>
          <InputGroup className="inputSettings">
            <InputGroup.Prepend>
              <InputGroup.Text>Edit Bio</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl as="textarea" onChange={this.bioChange}/>
          </InputGroup>
          <Button className="saveChanges" variant="primary" type="submit">Save Changes</Button>
        </Container>
        {mobileNavBottom};
      </>
    );
  }
}

export default accountEdit;
