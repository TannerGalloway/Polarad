import React, { Component } from "react";
import "../../css/settings.css";
import Navbar from "../nav/navbar";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";

class settingsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {password: ""};
  }

  NewpasswordInput = (event) => {
    this.setState({password: event.target.value});
}

  render() {
    var viewportSize = window.screen.width,
      textboxAddonStyle;
    viewportSize > 768
      ? (textboxAddonStyle = "Change Password")
      : (textboxAddonStyle = "Change\nPassword");
    return (
      <>
        <Navbar />
        <Container>
          <InputGroup className="mb-3 inputSettings">
            <InputGroup.Prepend>
              <InputGroup.Text className="textaddon">
                {textboxAddonStyle}
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl  type="password"  placeholder="New Password" className="settingsEdit" onChange={this.NewpasswordInput}/>
          </InputGroup>
          <Button className="saveChanges" variant="primary" type="submit">
            Save Changes
          </Button>
        </Container>
      </>
    );
  }
}

export default settingsEdit;
