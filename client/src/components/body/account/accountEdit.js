import React, { Component } from "react";
import LoginContext from "../../../loginContext";
import Navbar from "../nav/navbar";
import Bottomnav from "../nav/mobileNavbar";
import "../../css/accountEdit.css";
import { Container, Button, InputGroup, FormControl, Alert, Row, Col } from "react-bootstrap";
import Axios from "axios";
import FileBase64 from "../../react-file-base64.js";
import { PulseLoader } from "react-spinners";
import { css } from "@emotion/core";

class accountEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {newBio: "", NewPostImage: "",  loading: false};
  }
  

  componentDidMount(){
    Axios.get("/SetPrevURL");
    
    Axios.get(`/bio/${this.getUser()}`).then((res) => {
       document.querySelector("#bioTextArea").value = res.data.bio;
    });

     // loading css
     this.loadingCss = css`
     display: block;
   `;
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
      document.querySelector(".Error").innerHTML = res.data;

    }).catch((err) => {
      if(err.response.status === 401){
        this.msgStyle("error");
        document.querySelector(".Error").innerHTML = "Unable to Update Bio.";
      }
    });
  };

  // error message style
  msgStyle = (error) => {
    switch(error){
      case "error":
        this.displayMsg();
        document.querySelector(".Error").classList.remove("alert-success");
        document.querySelector(".Error").classList.add("alert-danger");
        break;

      case "success":
        this.displayMsg(); 
        document.querySelector(".Error").classList.remove("alert-danger");
        document.querySelector(".Error").classList.add("alert-success");
        break;

        default:
        break;
    }
  };

  displayMsg = () => {
    document.querySelector(".Error").style.display = "block";
    setTimeout(() => {this.resetError()}, 2300);
};

  resetError = () => {
    this.setState({error: ""})
    document.querySelector(".Error").style.display = "none";
}

  bioChange = (event) => {
      this.setState({newBio: event.target.value});
  }

  handleNewPost = (file) => {
    // check file type
    var fileSlicelocationEnd = file.type.indexOf("/");
    var filetype = file.type.slice(0, fileSlicelocationEnd);

    if(filetype === "image"){
      if(file.size  < 50000){
        if(document.getElementById("postinputdesktop").classList.contains("postPreviewHidden")){
          document.getElementsByClassName("postPreviewHidden")[0].classList.add("postPreview");
          document.getElementsByClassName("postPreviewHidden")[0].classList.remove("postPreviewHidden");
          document.getElementsByClassName("postPreview")[0].setAttribute("src", file.base64);
          document.querySelector(".fileSubmit").style.display = "block";
          this.setState({NewPostImage: file.base64});
        }
        else{
          document.getElementsByClassName("postPreview")[0].setAttribute("src", file.base64);
          document.querySelector(".fileSubmit").style.display = "block";
        }
      }else{
        document.getElementById("filePostInput").value = "";
        this.msgStyle("error");
        document.querySelector(".Error").innerHTML = "File is to large.";
      }
    }else{
      document.getElementById("filePostInput").value = "";
      this.msgStyle("error");
      document.querySelector(".Error").innerHTML = "File is not an Image.";
    }
  };

  newPostUpload = () => {
    this.setState({loading: true});
    document.getElementsByClassName("fileSubmit")[0].disabled = true;
    Axios.post(`/AddNewPost/${this.getUser()}`, {
      PostPhoto: this.state.NewPostImage
    }).then(() => {
      this.setState({loading: false})
      document.getElementsByClassName("postPreview")[0].classList.add("postPreviewHidden");
      document.getElementsByClassName("postPreview")[0].classList.remove("postPreview");
      document.getElementsByClassName("fileSubmit")[0].disabled = false;
      document.querySelector(".fileSubmit").style.display = "none";
      this.msgStyle("success");
      document.querySelector(".Error").innerHTML = "Post Upload Successful";
    });
  };

  render() {
    var viewportSize = window.screen.width, mobileNavBottom, editLayout;

    if(viewportSize < 768){
      mobileNavBottom = this.context.loginUser.status ? <Bottomnav favoritesLink={(favoriteValue) => {this.props.favhandle(favoriteValue)}}/> : null;
      editLayout = (
        <Container>
          <div>
            <InputGroup className="inputSettings">
              <InputGroup.Prepend>
                <InputGroup.Text>Edit Bio</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl as="textarea" id="bioTextArea" onChange={this.bioChange}/>
            </InputGroup>
          </div>
          <Button className="saveChanges" variant="primary" onClick={this.bioUpdate}>Update Bio</Button>
        </Container>
      );
    }
    else if(viewportSize > 768){
      editLayout = (
        <Container>
          <Row>
            <Col>
              <div>
                <form className="fileUplaodForm">
                  <label className="newpost" htmlFor="filePostInput">Select a File to Upload</label>
                  <FileBase64
                    className={"custom-file-input"}
                    id={"filePostInput"}
                    accept={"image/*"}
                    multiple={false}
                    onDone={this.handleNewPost}
                  />
                </form>
                <img id="postinputdesktop" className="postPreviewHidden" src="" alt="postPreview"/>
                {this.state.loading ? <Button className="fileSubmit" variant="primary">
                  {
                    <PulseLoader
                      css={this.loadingCss}
                      size={15}
                      color={"#4A90E2"}
                      loading={this.state.loading}
                    />
                  }
                </Button> : <Button className="fileSubmit" variant="primary" onClick={this.newPostUpload}>Upload Image</Button>}
              </div>
            </Col>
            <Col>
            <div>
              <InputGroup className="edit">
                <InputGroup.Prepend>
                  <InputGroup.Text>Edit Bio</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="textarea" id="bioTextArea" onChange={this.bioChange}/>
              </InputGroup>
            </div>
              <Button className="bioSubmit" variant="primary" onClick={this.bioUpdate}>Update Bio</Button>
            </Col>
          </Row>
        </Container>
      );
    }

    return (
      <>
        <Navbar favClick={this.props.favhandle}/>
        <Alert className="Error" variant="success">{this.state.error}</Alert>
        {editLayout}
        {mobileNavBottom}
      </>
    );
  }
}
accountEdit.contextType = LoginContext;
export default accountEdit;