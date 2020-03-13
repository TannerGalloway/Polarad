import React, { Component } from "react";
import "../../css/settings.css";
import Navbar from "../nav/navbar";
import Bottomnav from "../account/accountNavbar";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";

class settingsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {newPassword: ""};
  }

  NewpasswordInput = (event) => {
    this.setState({newPassword: event.target.value});
}

  render() {
    var viewportSize = window.screen.width, mobileNavBottom,
      textboxAddonStyle;

    if(viewportSize > 768){
      textboxAddonStyle = "Change Password";
    }
    else{
      textboxAddonStyle = "Change\nPassword";
      mobileNavBottom = (<Bottomnav/>);
    }

    return (
      <>
        <Navbar loggedin={this.props.loggedin} displayName={this.props.displayName}/>
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
        {mobileNavBottom};
      </>
    );
  }
}

export default settingsEdit;
