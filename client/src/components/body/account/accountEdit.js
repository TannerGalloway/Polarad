import React, { Component } from "react";
import "../../css/accountEdit.css";
import Navbar from "../nav/navbar";
import Bottomnav from "../nav/accountNavbar";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";

var url = window.location.pathname.replace(/%20/g, " ");
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
    sessionStorage.setItem("prevURL", url);
    var viewportSize = window.screen.width, mobileNavBottom,
    textboxAddonStyle;

    if(viewportSize > 768){
      (textboxAddonStyle = "Change Display Name")
    }
    else{
      (textboxAddonStyle = "Change\nDisplay\nName");
      mobileNavBottom = this.props.loggedin ? <Bottomnav displayName={this.props.displayName}/> : null;
    }

    return (
      <>
        <Navbar loggedin={this.props.loggedin} displayName={this.props.displayName}/>
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
        {mobileNavBottom};
      </>
    );
  }
}

export default accountEdit;
