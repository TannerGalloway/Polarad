import React, { Component } from "react";
import "../../css/settings.css";
import Navbar from "../nav/navbar";
import Bottomnav from "../nav/accountNavbar";
import { Container, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import Axios from "axios";

class settingsEdit extends Component {
  constructor(props) {
    super(props);
    this.url = window.location.pathname.replace(/%20/g, " ");
    this.state = {newPassword: ""};
  }

  NewpasswordInput = (event) => {
    this.setState({newPassword: event.target.value});
};

  // update password
  passwordUpdate = () => {
    if(this.state.newPassword === ""){
      this.msgStyle("error");
      document.querySelector(".passwordError").innerHTML = "Please Enter a Password";

    }else{
      Axios.post("/updatePassword", {
        username: this.lowercase_letter(this.props.displayName),
        Password: this.state.newPassword
      }).then((res) => {
        this.msgStyle("success");
        document.querySelector(".passwordError").innerHTML = res.data;
        document.querySelector(".settingsEdit").value = "";

      }).catch((err) => {
        if(err.response.status === 401){
          this.msgStyle("error");
          document.querySelector(".passwordError").innerHTML = "Unable to Update Password";
          document.querySelector(".settingsEdit").value = "";
        }
      }); 
    }
  };

  // password message style
  msgStyle = (error) => {
    switch(error){
      case "error":
        this.displayMsg();
        document.querySelector(".passwordError").classList.remove("alert-success");
        document.querySelector(".passwordError").classList.add("alert-danger");
        break;

      case "success":
        this.displayMsg(); 
        document.querySelector(".passwordError").classList.remove("alert-danger");
        document.querySelector(".passwordError").classList.add("alert-success");
        break;

        default:
        break;
    }
  };

  displayMsg = () => {
    document.querySelector(".passwordError").style.display = "block";
    setTimeout(() => {this.resetError()}, 2300);
};

  resetError = () => {
    this.setState({error: ""})
    document.querySelector(".passwordError").style.display = "none";
}

// used to make the displayname equal the name in the db.
  lowercase_letter = (name) => {
    name = name.split(" ");

    for (var i = 0, nameLength = name.length; i < nameLength; i++) {
        name[i] = name[i][0].toLowerCase() + name[i].substr(1);
    }

    return name.join(" ");
}

  render() {
    sessionStorage.setItem("prevURL", this.url);
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
          <div>
          <Alert className="passwordError" variant="success">{this.state.error}</Alert>
          <InputGroup className="inputSettings">
            <InputGroup.Prepend>
              <InputGroup.Text className="textaddon">
                {textboxAddonStyle}
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl  type="password"  placeholder="New Password" className="settingsEdit" required onChange={this.NewpasswordInput}/>
          </InputGroup>
          </div>
          <Button className="saveChanges" variant="primary" onClick={this.passwordUpdate}>
            Save Changes
          </Button>
        </Container>
        {mobileNavBottom};
      </>
    );
  }
}

export default settingsEdit;
