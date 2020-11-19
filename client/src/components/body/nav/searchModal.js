import React, { Component } from "react";
import {Modal, Form, FormControl, Col, OverlayTrigger, Popover} from "react-bootstrap";
import LoginContext from "../../../loginContext.js";
import BasicProfilePic from "../../../Images/generic-profile-avatar.png";
import Axios from "axios";
import "../../css/modalStyle.css";

import Search from "../../../Images/search.png";

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };
  
  // searchbar error
  userSearchError = () => {
    for (var e = 0; e < document.getElementsByClassName("popover-body")[0].childNodes.length;  e++) {
      document.getElementsByClassName("popover-body")[0].removeChild(document.getElementsByClassName("popover-body")[0].childNodes[e]);
    }
    var searchError = document.createElement("div");
    searchError.className = "row resultsRow";

    var errorMessage = document.createElement("p");
    errorMessage.setAttribute("id", "userError");
    errorMessage.innerHTML = "No results found.";

    searchError.appendChild(errorMessage);
    document.getElementsByClassName("popover-body")[0].appendChild(searchError);
  };

  userSearch = (searchTerm) => {
    if(searchTerm.target.value === ""){
      this.userSearchError();
    }
   else if (searchTerm.target.value !== "") {
      Axios.get(`/userSearch/${searchTerm.target.value}`).then((user) => {
        if(user.data.userSearch.length === 0){
          this.userSearchError();
        }
        else{
          var rowContainer = document.createElement("div");
          rowContainer.setAttribute("class", "resultsContainer");
          
          for(var s = 0; s < document.getElementsByClassName("popover-body")[0].childNodes.length; s++){
            document.getElementsByClassName("popover-body")[0].removeChild(document.getElementsByClassName("popover-body")[0].childNodes[s]);
          }
  
          for( var i = 0; i < user.data.userSearch.length; i++){
            var userLink = document.createElement("a");
            userLink.className = "row resultsRow";
            userLink.setAttribute("href", `/profile/${user.data.userSearch[i].userInfo.username}`);
  
            var colDivImage = document.createElement("div");
            colDivImage.setAttribute("class", "col");
            
            var colDivUser = document.createElement("div");
            colDivUser.setAttribute("class", "col");
  
            var profileImg = document.createElement("img");
            profileImg.setAttribute("id", "searchPic");
            profileImg.setAttribute("src", user.data.userSearch[i].userInfo.profilePic ? user.data.userSearch[i].userInfo.profilePic : BasicProfilePic);
            profileImg.setAttribute("class", "rounded-circle");
  
            var usernameText = document.createElement("p");
            usernameText.setAttribute("id", "user");
            usernameText.innerHTML = user.data.userSearch[i].userInfo.username;

            colDivImage.appendChild(profileImg);
            colDivUser.appendChild(usernameText);
            userLink.appendChild(colDivImage);
            userLink.appendChild(colDivUser);
            rowContainer.appendChild(userLink);

            if(i !== user.data.userSearch.length -1){
              userLink.style.removeProperty("border-bottom");
            }

            document.getElementsByClassName("popover-body")[0].appendChild(rowContainer);
          }
        }
      });
    }
  };

  render() {
    return (
      <>
        <img
          id="searchIcon"
          alt="Search"
          src={Search}
          width="60"
          height="60"
          onClick={this.handleShow}
        />

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Body>
            <Col>
              <OverlayTrigger
                trigger="focus"
                key={"bottom"}
                placement={"bottom"}
                overlay={
                  <Popover id={"popover-positioned-bottom"}>
                    <Popover.Content>
                      <div className="row resultsRow">
                        <p id="userError">No results found.</p>
                      </div>
                    </Popover.Content>
                  </Popover>
                }>
                <Form inline>
                  <FormControl
                    type="text"
                    placeholder="Search"
                    onChange={this.userSearch}
                    className="mr-sm-2"
                  />
                </Form>
              </OverlayTrigger>
            </Col>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
SearchModal.contextType = LoginContext;
export default SearchModal;