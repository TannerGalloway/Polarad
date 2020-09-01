import React, { Component } from "react";
import "../../css/settings.css";
import LoginContext from "../../../loginContext";
import Navbar from "../nav/navbar";
import Bottomnav from "../nav/mobileNavbar";
import { Container, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import Axios from "axios";

class settingsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {newPassword: ""};
  }

  NewpasswordInput = (event) => {
    this.setState({newPassword: event.target.value});
};

componentDidMount(){
  Axios.get("/SetPrevURL");
};

  // update password
  passwordUpdate = () => {
    if(this.state.newPassword === ""){
      this.msgStyle("error");
      document.querySelector(".passwordError").innerHTML = "Please Enter a Password";

    }
    else{
      Axios.post("/updatePassword", {
        username: this.context.loginUser.user,
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

  render() {
    sessionStorage.removeItem("userMenuClicked");
    var viewportSize = window.screen.width, mobileNavBottom,
      textboxAddonStyle;
    
    if(viewportSize > 768){
      textboxAddonStyle = "Change Password";
    }
    else{
      textboxAddonStyle = "Change\nPassword";
      mobileNavBottom = this.context.loginUser.status ? <Bottomnav favoritesLink={(favoriteValue) => {this.props.favhandle(favoriteValue)}}/> : null;
    }

    return (
      <>
        <Navbar favClick={this.props.favhandle}/>
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
settingsEdit.contextType = LoginContext;
export default settingsEdit;