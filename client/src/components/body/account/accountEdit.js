import React, { Component } from "react";
import Navbar from "../nav/navbar";
import Bottomnav from "../nav/accountNavbar";
import "../../css/accountEdit.css";
import { Container, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import Axios from "axios";

class accountEdit extends Component {
  constructor(props) {
    super(props);
    this.url = window.location.pathname.replace(/%20/g, " ");
    this.state = {newBio: ""};
  }
  

  componentDidMount(){
    Axios.get(`/bio/${this.getUser()}`).then((res) => {
       document.querySelector("#bioTextArea").value = res.data.bio;
    });
  }

  getUser = () => {
    // get user from url
    var urlArr = window.location.pathname.split(""), slashCount = 0, namepostion, userpagename;
    urlArr.map((index) => {if(index === "/"){slashCount++} return slashCount});
    namepostion = window.location.pathname.indexOf("/", window.location.pathname.indexOf("/") + 1) + 1;
    userpagename = window.location.pathname.slice(namepostion, window.location.pathname.lastIndexOf("/")).replace(/%20/g, " ");
    return userpagename;
  };

  // update user bio
  bioUpdate = () => {
    Axios.post("/updateBio", {
      username: this.getUser(),
      newBio: this.state.newBio
    }).then((res) => {
      this.msgStyle("success");
      document.querySelector(".bioError").innerHTML = res.data;

    }).catch((err) => {
      if(err.response.status === 401){
        this.msgStyle("error");
        document.querySelector(".bioError").innerHTML = "Unable to Update Bio";
      }
    });
  };

  // bio message style
  msgStyle = (error) => {
    switch(error){
      case "error":
        this.displayMsg();
        document.querySelector(".bioError").classList.remove("alert-success");
        document.querySelector(".bioError").classList.add("alert-danger");
        break;

      case "success":
        this.displayMsg(); 
        document.querySelector(".bioError").classList.remove("alert-danger");
        document.querySelector(".bioError").classList.add("alert-success");
        break;

        default:
        break;
    }
  };

  displayMsg = () => {
    document.querySelector(".bioError").style.display = "block";
    setTimeout(() => {this.resetError()}, 2300);
};

  resetError = () => {
    this.setState({error: ""})
    document.querySelector(".bioError").style.display = "none";
}

  bioChange = (event) => {
      this.setState({newBio: event.target.value});
  }

  render() {
    sessionStorage.setItem("prevURL", this.url);
    var viewportSize = window.screen.width, mobileNavBottom;

    if(viewportSize < 768){
      mobileNavBottom = this.props.loggedin ? <Bottomnav displayName={this.props.displayName}/> : null;
    }

    return (
      <>
        <Navbar loggedin={this.props.loggedin} displayName={this.props.displayName}/>
        <Container>
          <Alert className="bioError" variant="success">{this.state.error}</Alert>
          <InputGroup className="inputSettings">
            <InputGroup.Prepend>
              <InputGroup.Text>Edit Bio</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl as="textarea" id="bioTextArea" onChange={this.bioChange}/>
          </InputGroup>
          <Button className="saveChanges" variant="primary" onClick={this.bioUpdate}>Save Changes</Button>
        </Container>
        {mobileNavBottom};
      </>
    );
  }
}

export default accountEdit;