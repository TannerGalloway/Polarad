import React, { Component } from "react";
import "../../css/accountEdit.css";
import Navbar from "../nav/navbar";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";

class accountEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {displayName: "", bio: ""};
  }

  displayNamechange = (event) => {
      this.setState({displayName: event.target.value});
  }

  bioChange = (event) => {
      this.setState({bio: event.target.value});
  }

  render() {
    var viewportSize = window.screen.width,
    textboxAddonStyle;
  viewportSize > 768
    ? (textboxAddonStyle = "Change Display Name")
    : (textboxAddonStyle = "Change\nDisplay\nName");
    return (
      <>
        <Navbar />
        <Container>
          <InputGroup className="inputSettings">
            <InputGroup.Prepend>
              <InputGroup.Text className="textaddon">{textboxAddonStyle}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl className="profileEdit" onChange={this.displayNamechange}/>
          </InputGroup>
          <InputGroup className="inputSettings">
            <InputGroup.Prepend>
              <InputGroup.Text>Edit Bio</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl as="textarea" onChange={this.bioChange}/>
          </InputGroup>
          <Button className="saveChanges" variant="primary" type="submit">
            Save Changes
          </Button>
        </Container>
      </>
    );
  }
}

export default accountEdit;
