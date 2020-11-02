import React, { Component } from "react";
import "../../css/accountInfo.css";
import LoginContext from "../../../loginContext";
import {Container, Row, Col, Image, Modal, Button} from "react-bootstrap";
import Avatar from "react-avatar-edit";
import Desktopview from "./desktopView"
import Mobileview from "./mobileView";
import MobileNav from "../nav/mobileNavbar";
import BasicProfilePic from "../../../Images/generic-profile-avatar.png";
import { PulseLoader } from "react-spinners";
import { css } from "@emotion/core";
import Axios from "axios";

import postsIconInactive from "../../../Images/posts.png";
import postsIconActive from "../../../Images/posts_active.png";
import bookmarkIconInactive from "../../../Images/bookmark.png";
import bookmarkIconActive from "../../../Images/bookmark_active.png";
import taggedIconInactive from "../../../Images/tagged.png";
import taggedIconActive from "../../../Images/tagged_active.png";

class accountInfo extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.favClick = false;
    this.displayname = this.getuser();
    this.overlay = null;
    this.state = {
      posts: 0,
      followers: 0,
      following: 0,
      bio: "",
      postsActive: true,
      bookmarkActive: false,
      taggedActive: false,
      nonLoggeduserView: false,
      modalShow: false,
      preview: null,
      profilePicSrc: BasicProfilePic,
      loading: false
    }

    // loading css
    this.loadingCss = css`
      display: block;
    `;
  };

  componentDidMount() {
    this._isMounted = true;

    // check if user is in database
      Axios.get(`/validUser/${this.getuser()}`,).then((res) => {
        if(this._isMounted){
          if(res.data === ""){
            window.location.pathname = "/404";
          }
        };
      })

    // get loggedin user
      Axios.get("/userSession").then((loggeduser) => {
        if(this._isMounted){
          if(loggeduser.data.userSession !== undefined){
            if(this.getuser() === loggeduser.data.userSession.user){
              this.setState({nonLoggeduserView: true});
            }else{
              this.setState({nonLoggeduserView: false});
            }
          }
        }
      });

      // get profile Pic
      Axios.get(`/ProfilePic/${this.getuser()}`).then((res) => {
        if(this._isMounted){
          if(res.data.profilePic !== undefined)
          this.setState({profilePicSrc: res.data.profilePic});
        }
      });

    // get user bio
      Axios.get(`/bio/${this.getuser()}`).then((res) => {
        if(this._isMounted){
          if(res.data.bio === undefined){
            this.setState({bio: ""});
        }else{
          this.setState({bio: res.data.bio});
          }
        }
      });

    // set following count
      Axios.get(`/following/${this.getuser()}`).then((res) => {
        if(this._isMounted){
          this.setState({following: res.data.following.length});
        }
       });

    //  set followers count
      Axios.get(`/followers/${this.getuser()}`).then((res) => {
        if(this._isMounted){
          this.setState({followers: res.data.length});
        }
       });
  }

  toggleIcon = (event) => {
    switch(event.target.id){
      case "postsIcon":
        if(!this.state.postsActive){
          this.setState((prevState)  => ({postsActive: !prevState.postsActive}));
          this.setState(({bookmarkActive: false}));
          this.setState(({taggedActive: false})); 
        }
      break;

      case "bookmarkIcon":
        if(!this.context.loginUser.status){
          window.location.pathname = "/login";
        }
        if(this.state.bookmarkActive){
          this.setState(({postsActive: false}));
          this.setState(({taggedActive: false}));
        }
        else{
          this.setState((prevState)  => ({bookmarkActive: !prevState.bookmarkActive}));
          this.setState(({postsActive: false}));
          this.setState(({taggedActive: false}));
        }

       break;

      case "taggedIcon":
        if(!this.context.loginUser.status){
          window.location.pathname = "/login";
        }
        if(this.state.taggedActive){
          this.setState(({postsActive: false}));
          this.setState(({bookmarkActive: false}));
        }
        else{
          this.setState((prevState)  => ({taggedActive: !prevState.taggedActive}));
          this.setState(({postsActive: false}));
          this.setState(({bookmarkActive: false}));
        }
      break;

      default:
      break;
    }
  }
 
  componentWillUnmount() {
    this._isMounted = false;
 }

// shows the profile pic upload modal
 modalShow = () => {
   this.setState({modalShow: true})
   if(this.state.preview === null){
    setTimeout(() => {
      if(document.getElementById("saveChangesBtnLoading") !== null){
     document.getElementById("saveChangesBtnLoading").remove();
   };
      if(document.getElementsByClassName("saveChangesBtn").length === 0){
         var saveChangesBtn = document.createElement("button");
         saveChangesBtn.setAttribute("class", "btn btn-primary saveChangesBtn");
         saveChangesBtn.innerText = "Save Changes";
         saveChangesBtn.addEventListener("click", this.profilePicUpload);
         saveChangesBtn.disabled = true;
         document.getElementById("changesBtnCol").appendChild(saveChangesBtn);
      }
     }, 100);
    }
  };

  // closes the profile pic modal
 modalClose = () => {
   if(document.getElementById("cropPreview") !== null){
     document.getElementById("cropPreview").remove();
   }
   
   // get profile Pic
   Axios.get(`/ProfilePic/${this.getuser()}`).then((res) => {
    if(this._isMounted){
      if(res.data.profilePic !== undefined)
      this.setState({profilePicSrc: res.data.profilePic});
    }
  });
    this.setState({modalShow: false})
    this.setState({preview: null})
  };

  // closes the profile pic editor
 editClose = () => {
  this.setState({preview: null});
  document.getElementById("cropPreview").remove();
  document.getElementsByClassName("saveChangesBtn")[0].disabled = true;
}

// profile pic crop function
editCrop = (preview) => {
  this.setState({preview});
}

// profile pic upload function
profilePicUpload = () => {
  this.setState({loading: true});
  document.getElementsByClassName("saveChangesBtn")[0].remove();
  document.getElementById("discardChangesBtn").disabled = true;
  document.getElementById("saveChangesBtnLoading").disabled = true;
  Axios.post("/updateProfilePic", {
      username: this.getuser(),
      profilePic: this.state.preview
    }).then((res) => {
      this.setState({loading: res.data});
      this.modalClose();
    });
};

 getuser = () =>{
  var urlArr = window.location.pathname.split(""), slashCount = 0, namepostion, userpagename;
  urlArr.map((index) => {if(index === "/"){slashCount++} return slashCount});
  if(slashCount === 2){
    namepostion = window.location.pathname.indexOf("/", window.location.pathname.indexOf("/") + 1) + 1;
    userpagename = window.location.pathname.slice(namepostion, window.location.pathname.length).replace(/%20/g, " ");
  }
  return userpagename.toLowerCase().split(" ").map(function(user) {
    return (user.charAt(0).toUpperCase() + user.slice(1));
  }).join(" ");
 };
  
  render() {
    var {
      posts,
      followers,
      following,
      bio,
      nonLoggeduserView
    } = this.state;
    var {favClickReturn} = this.props;
    var accountView, mobileNavBottom, favoritesPageContent, profilePicSize,
      viewportSize = window.screen.width;
    if(viewportSize > 768){
      profilePicSize = 150;
      accountView = (
          <Desktopview displayName={this.displayname} posts={posts} followers={followers} following={following} bio={bio} accountpageView={nonLoggeduserView} />
      );
    }else{
      profilePicSize = 120;
      accountView = (
          <Mobileview displayName={this.displayname} posts={posts} followers={followers} following={following} bio={bio} accountpageView={nonLoggeduserView} />
      );
        mobileNavBottom = this.context.loginUser.status ? <MobileNav favoritesLink={(favoriteValue) => {this.props.favClick(favoriteValue)}} favoritesLinkReturn={favClickReturn} /> : null;
    }

    if(this.state.nonLoggeduserView){
      this.overlay = (
        <div className="imageOverlay" onClick={this.modalShow}>
          <div className="overlayText">
            <span className="fas fa-camera imageText"> Change Image</span>
          </div>
        </div>
      );
    }
    
    if(this.state.preview !== null){
      if(!this.state.loading && document.getElementsByClassName("saveChangesBtn").length !== 0){
        document.getElementsByClassName("saveChangesBtn")[0].disabled = false;
      }
      if(!document.getElementById("cropPreview")){
        var preview = document.createElement("img");
        preview.setAttribute("id", "cropPreview");
        preview.setAttribute("src", this.state.preview);
        preview.setAttribute("alt", "preview");
        if(document.querySelector("#previewCol") !== null){
          document.querySelector("#previewCol").appendChild(preview);
        }
      }else{
        if(!this.state.loading && document.getElementsByClassName("saveChangesBtn").length !== 0){
          document.getElementById("cropPreview").src = this.state.preview;
          document.getElementsByClassName("saveChangesBtn")[0].disabled = false;
        }
      }
    }

    if(!favClickReturn){
      var postsIcon = this.state.postsActive ? postsIconActive : postsIconInactive;
      var bookmarkIcon = this.state.bookmarkActive ? bookmarkIconActive : bookmarkIconInactive;
      var taggedIcon = this.state.taggedActive ? taggedIconActive : taggedIconInactive;

      favoritesPageContent = 
    (
      <Row id="accountIcons">
        <Col>
          <Image
            id="postsIcon"
            src={postsIcon}
            onClick={this.toggleIcon}
          />
          <h6 className="iconTitle">POSTS</h6>
        </Col>
        <Col>
        <Image
          id="bookmarkIcon"
          src={bookmarkIcon}
          onClick={this.toggleIcon}
        />
        <h6 className="iconTitle">BOOKMARKED</h6>
      </Col>
      <Col>
        <Image
          id="taggedIcon"
          src={taggedIcon}
          onClick={this.toggleIcon}
        />
        <h6 className="iconTitle">TAGGED</h6>
      </Col>
    </Row>
    )
    }

      return (
        <>
          <Modal
            show={this.state.modalShow}
            onHide={this.modalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Col>
                <Modal.Title>Edit</Modal.Title>
              </Col>
              <Col>
                <Modal.Title>Preview</Modal.Title>
              </Col>
            </Modal.Header>
            <Modal.Body id="modalBody">
                <Col id="editCol">
                {!this.state.loading ? 
                <Avatar
                  width={0}
                  height={0}
                  onCrop={this.editCrop}
                  onClose={this.editClose}
                  imageWidth={profilePicSize}
                /> : <h4 id="picEditorText">Can't Edit While Uploading Image.</h4>}
                </Col>
                <Col id="previewCol">
                </Col>
            </Modal.Body>
            <Modal.Footer>
              <Col xs={6}>
                <Button id="discardChangesBtn" variant="secondary" onClick={this.modalClose}>Discard Changes</Button>
              </Col>
              <Col id="changesBtnCol">
                {this.state.loading ? <Button id="saveChangesBtnLoading" variant="primary">
                  {
                    <PulseLoader
                      css={this.loadingCss}
                      size={15}
                      color={"#4A90E2"}
                      loading={this.state.loading}
                    />
                  }
                </Button> : null}
              </Col>
          </Modal.Footer>
        </Modal>
        <Container>
          <Row>
            <Col xs={3}>
              <div id="profile-container">
                <img src={this.state.profilePicSrc} alt="profile pic"/>
                {this.overlay}
              </div>
            </Col>
              {accountView}
          </Row>
          {favoritesPageContent}
        </Container>
        {mobileNavBottom}
        </>
      );
  }
}
accountInfo.contextType = LoginContext;
export default accountInfo;