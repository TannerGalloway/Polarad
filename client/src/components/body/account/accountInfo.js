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
import Posts from "./userPost";

import postsIconInactive from "../../../Images/posts.png";
import postsIconActive from "../../../Images/posts_active.png";
import bookmarkIconInactive from "../../../Images/bookmark.png";
import bookmarkIconActive from "../../../Images/bookmark_active.png";
import taggedIconInactive from "../../../Images/tagged.png";
import taggedIconActive from "../../../Images/tagged_active.png";
import cameraIcon  from "../../../Images/camera.png";
import heartIcon  from "../../../Images/heart.png";

class accountInfo extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.favClick = this.props.favClickReturn;
    this.displayname = this.getUser();
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
      UploadLoading: false,
      postsLoading: false,
      favorites: 0
    }

    // loading css
    this.loadingCss = css`
      display: block;
    `;
  };

  componentDidMount() {
    this._isMounted = true;
    
    // check if user is in database
      Axios.get(`/validUser/${this.getUser()}`,).then((res) => {
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
            if(this.getUser() === loggeduser.data.userSession.user){
              this.setState({nonLoggeduserView: true});
            }else{
              this.setState({nonLoggeduserView: false});
            }
          }
        }
      });

      // get profile Pic
      Axios.get(`/ProfilePic/${this.getUser()}`).then((res) => {
        if(this._isMounted){
          if(res.data.profilePic !== undefined)
          this.setState({profilePicSrc: res.data.profilePic});
        }
      });

      // get user post count
      Axios.get(`/posts/${this.getUser()}`).then((res) => {
        this.setState({posts: res.data.posts.length});
    });

    // set following count
      Axios.get(`/following/${this.getUser()}`).then((res) => {
        if(this._isMounted){
          this.setState({following: res.data.following.length});
        }
       });

    //  set followers count
      Axios.get(`/followers/${this.getUser()}`).then((res) => {
        if(this._isMounted){
          this.setState({followers: res.data.length});
        }
       });

       // get user bio
      Axios.get(`/bio/${this.getUser()}`).then((res) => {
        if(this._isMounted){
          if(res.data.bio === undefined){
            this.setState({bio: ""});
        }else{
          this.setState({bio: res.data.bio});
          }
        }
      });

      // get user favorites
      if(this.context.loginUser.status){
        Axios.get(`/Favorites/${this.context.loginUser.user}`).then((res) => {
          this.setState({favorites: res.data.favorites.length});
        });
      }
      
      // get the number of posts a user has
      Axios.get(`/posts/${this.getUser()}`).then((res) => {
        this.setState({posts:  res.data.posts.length});
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
        // prevents icon from being toggled on or off if click again
        else if(this.state.bookmarkActive){
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
         // prevents icon from being toggled on or off if click again
        else if(this.state.taggedActive){
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

// shows the current user their favorited posts
  showfavorites = () => {
    if(sessionStorage.getItem("favbtnClicked") === "true"){
      this.favClick = true;
    }else{
      this.favClick = false;
    }
    this.forceUpdate();
  };

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
   Axios.get(`/ProfilePic/${this.getUser()}`).then((res) => {
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
  this.setState({UploadLoading: true});
  document.getElementsByClassName("saveChangesBtn")[0].remove();
  document.getElementById("discardChangesBtn").disabled = true;
  document.getElementById("saveChangesBtnLoading").disabled = true;
  Axios.post(`/updateProfilePic/${this.getUser()}`, {
      profilePic: this.state.preview
    }).then((res) => {
      this.setState({UploadLoading: res.data});
      this.modalClose();
    });
};

 getUser = () =>{
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
    var accountView, mobileNavBottom, postPageContent, profilePicSize, viewportSize = window.screen.width;
    var postsIcon = this.state.postsActive ? postsIconActive : postsIconInactive;
    var bookmarkIcon = this.state.bookmarkActive ? bookmarkIconActive : bookmarkIconInactive;
    var taggedIcon = this.state.taggedActive ? taggedIconActive : taggedIconInactive;

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
        mobileNavBottom = this.context.loginUser.status ? <MobileNav favoriteClicked={(favValue) => {
          this.favClick = favValue;
          this.forceUpdate();
        }}/> : null;
    }

    if(sessionStorage.getItem("favbtnClicked") === "true"){
      this.favClick = true;
    }else{
      this.favClick = false;
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
      if(!this.state.UploadLoading && document.getElementsByClassName("saveChangesBtn").length !== 0){
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
        if(!this.state.UploadLoading && document.getElementsByClassName("saveChangesBtn").length !== 0){
          document.getElementById("cropPreview").src = this.state.preview;
          document.getElementsByClassName("saveChangesBtn")[0].disabled = false;
        }
      }
    }
    if((this.state.bookmarkActive && !this.favClick) || (this.state.taggedActive && !this.favClick)){
      postPageContent = 
      (
        <Row className="postsRow">
          <Col className="accountIcons">
            <Image
              id="postsIcon"
              src={postsIcon}
              onClick={this.toggleIcon}
            />
            <h6 className="iconTitle">POSTS</h6>
          </Col>
          <Col className="accountIcons">
          <Image
            id="bookmarkIcon"
            src={bookmarkIcon}
            onClick={this.toggleIcon}
          />
          <h6 className="iconTitle">BOOKMARKED</h6>
        </Col>
        <Col className="accountIcons">
          <Image
            id="taggedIcon"
            src={taggedIcon}
            onClick={this.toggleIcon}
          />
          <h6 className="iconTitle">TAGGED</h6>
        </Col>
        <div className="container"> 
          <p className="EmptyContent">Feature Coming Soon!</p>
        </div>
      </Row>
      )
    }else if(!this.favClick){ 
        postPageContent = 
      (
        <Row className="postsRow">
          <Col className="accountIcons">
            <Image
              id="postsIcon"
              src={postsIcon}
              onClick={this.toggleIcon}
            />
            <h6 className="iconTitle">POSTS</h6>
          </Col>
          <Col className="accountIcons">
          <Image
            id="bookmarkIcon"
            src={bookmarkIcon}
            onClick={this.toggleIcon}
          />
          <h6 className="iconTitle">BOOKMARKED</h6>
        </Col>
        <Col className="accountIcons">
          <Image
            id="taggedIcon"
            src={taggedIcon}
            onClick={this.toggleIcon}
          />
          <h6 className="iconTitle">TAGGED</h6>
        </Col>
            <div className="container" id="EmptyMessage">{this.state.posts <= 0 ? 
            <>
              <Image
                id="EmptyContentIcon"
                src={cameraIcon}
              />
              <p className="EmptyContent">No Posts Yet!</p>
            </>: null}</div> 
            <Posts postsUpdate={(postValue) => {this.setState({posts: postValue})}}/>
      </Row>
      )
    }else{
      if(this.state.favorites <= 0){
        if(this.getUser() === this.context.loginUser.user){
          postPageContent = (
            <>
              <Image
                id="EmptyContentIcon"
                src={heartIcon}
              />
              <p className="EmptyContent">No Favorited Posts!</p>
            </>
          );
        }
      }else{
        postPageContent = (
            <Posts favoritesView={this.favClick}/>
        );
      }
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
                {!this.state.UploadLoading ? 
                <Avatar
                  width={0}
                  height={0}
                  onCrop={this.editCrop}
                  onClose={this.editClose}
                  imageWidth={profilePicSize}
                /> : <h4 className="AlignText">Can't Edit While Uploading Image.</h4>}
                </Col>
                <Col id="previewCol">
                </Col>
            </Modal.Body>
            <Modal.Footer>
              <Col xs={6}>
                <Button id="discardChangesBtn" variant="secondary" onClick={this.modalClose}>Discard Changes</Button>
              </Col>
              <Col id="changesBtnCol">
                {this.state.UploadLoading ? <Button id="saveChangesBtnLoading" variant="primary">
                  {
                    <PulseLoader
                      css={this.loadingCss}
                      size={15}
                      color={"#4A90E2"}
                      loading={this.state.UploadLoading}
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
          {postPageContent}
        </Container>
        {mobileNavBottom}
        </>
      );
  }
}
accountInfo.contextType = LoginContext;
export default accountInfo;