import React, { Component } from "react";
import "../../css/settings.css";
import Navbar from "../nav/navbar";
import Bottomnav from "../nav/accountNavbar";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";

var url = window.location.pathname.replace(/%20/g, " ");
class settingsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {newPassword: ""};
  }

  NewpasswordInput = (event) => {
    this.setState({newPassword: event.target.value});
}

  render() {
    sessionStorage.setItem("prevURL", url);
    sessionStorage.removeItem("userMenuClicked");
    var viewportSize = window.screen.width, mobileNavBottom,
      textboxAddonStyle;

    if(viewportSize > 768){
      textboxAddonStyle = "Change Password";
    }
    else{
      textboxAddonStyle = "Change\nPassword";
      mobileNavBottom = this.props.loggedin ? <Bottomnav displayName={this.props.displayName} favoritesLink={this.handlefavoritesClicked}/> : null;
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
