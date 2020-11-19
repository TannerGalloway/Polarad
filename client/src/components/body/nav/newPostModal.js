import React, { Component } from "react";
import { Modal, Alert, Button } from "react-bootstrap";
import AddPhoto from "../../../Images/addphoto.png";
import Axios from "axios";
import FileBase64 from "../../react-file-base64.js";
import { PulseLoader } from "react-spinners";
import { css } from "@emotion/core";

class NewPostModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          show: false,
          NewPostImage: "",
          loading: false
        };

        // loading css
        this.loadingCss = css`
        display: block;`;
      }

      handleClose = () => {
        document.getElementById("mobilePostInput").value = "";
        this.setState({ show: false });
      };
    
      handleShow = () => {
        this.setState({ show: true });
      };

      getUser = () => {
        // get user from url
        var urlArr = window.location.pathname.split(""), slashCount = 0, namepostion, userpagename;
        urlArr.map((index) => {if(index === "/"){slashCount++} return slashCount});
        namepostion = window.location.pathname.indexOf("/", window.location.pathname.indexOf("/") + 1) + 1;
        userpagename = window.location.pathname.slice(namepostion).replace(/%20/g, " ");
        return userpagename;
      };

      displayErrorMsg = (message) => {
          document.querySelector(".Error").classList.remove("alert-success");
          document.querySelector(".Error").classList.add("alert-danger"); 
          document.querySelector(".Error").innerHTML = message;
          document.querySelector(".Error").style.display = "block";
          setTimeout(() => {this.resetError()}, 2300);
      };

      resetError = () => {
        this.setState({error: ""})
        document.querySelector(".Error").style.display = "none";
        this.handleClose();
    }

    handleNewPost = (file) => {
      // check file type
      var fileSlicelocationEnd = file.type.indexOf("/");
      var filetype = file.type.slice(0, fileSlicelocationEnd);
  
      if(filetype === "image"){
        if(file.size  < 50000){
          if(document.getElementById("postinputmobile").classList.contains("postPreviewHidden")){
            document.getElementsByClassName("postPreviewHidden")[0].classList.add("postPreview");
            document.getElementsByClassName("postPreviewHidden")[0].classList.remove("postPreviewHidden");
            document.getElementsByClassName("postPreview")[0].setAttribute("src", file.base64);
            document.querySelector(".fileSubmitMobile").style.display = "block";
            this.setState({NewPostImage: file.base64});
          }
          else{
            document.getElementsByClassName("postPreview")[0].setAttribute("src", file.base64);
            document.querySelector(".fileSubmitMobile").style.display = "block";
          }
        }else{
          document.getElementById("mobilePostInput").value = "";
          this.displayErrorMsg("File is to large.");
        }
      }else{
        document.getElementById("mobilePostInput").value = "";
        this.displayErrorMsg("File is not an Image.");
        
      }
    };

    newPostUpload = () => {
      this.setState({loading: true});
      document.getElementsByClassName("fileSubmitMobile")[0].disabled = true;
      Axios.post(`/AddNewPost/${this.getUser()}`, {
        PostPhoto: this.state.NewPostImage
      }).then(() => {
        this.setState({loading: false})
        document.getElementsByClassName("postPreview")[0].classList.add("postPreviewHidden");
        document.getElementsByClassName("postPreview")[0].classList.remove("postPreview");
        document.getElementsByClassName("fileSubmitMobile")[0].disabled = false;
        document.querySelector(".fileSubmitMobile").style.display = "none";
        document.querySelector(".Error").classList.remove("alert-danger");
        document.querySelector(".Error").classList.add("alert-success");
        document.querySelector(".Error").innerHTML = "Post Upload Successful";
        document.querySelector(".Error").style.display = "block";
        setTimeout(() => {this.resetError()}, 2300);
      });
    };

    render() {
        return (
          <>
            <img
              id="addPhotoIcon"
              alt="AddPhoto"
              src={AddPhoto}
              width="60"
              height="60"
              onClick={this.handleShow}
            />
    
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Body>
                <Alert className="Error" variant="success">{this.state.error}</Alert>
                <div className="mobileInputModal">
                  <form className="fileUplaodFormMobile">
                    <label className="newpost" htmlFor="mobilePostInput">Select a File to Upload</label>
                    <FileBase64
                      className={"custom-file-input"}
                      id={"mobilePostInput"}
                      accept={"image/*"}
                      multiple={false}
                      onDone={this.handleNewPost}
                  />
                  </form>
                  <img id="postinputmobile" className="postPreviewHidden" src="" alt="postPreview"/>
                  {this.state.loading ? <Button className="fileSubmit" variant="primary">
                  {
                    <PulseLoader
                      css={this.loadingCss}
                      size={15}
                      color={"#4A90E2"}
                      loading={this.state.loading}
                    />
                  }
                </Button> : <Button className="fileSubmitMobile" variant="primary" onClick={this.newPostUpload}>Upload Image</Button>}
                </div>
              </Modal.Body>
            </Modal>
          </>
        );
      }
};
export default NewPostModal;