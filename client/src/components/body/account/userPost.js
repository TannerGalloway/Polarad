import React, { Component } from "react";
import {Container, Modal, Col, Row, FormControl} from "react-bootstrap";
import "../../css/userPost.css";
import LoginContext from "../../../loginContext";
import Axios from "axios";
import commentIcon from "../../../Images/comment_icon.png";
import bookmarkIcon from "../../../Images/bookmarkDark.png";
import heartInactive from "../../../Images/heart.png";
import heartActive from "../../../Images/active_heart.png";
import heartDisable from "../../../Images/heart_disabled.png";
import shareIcon from "../../../Images/send_icon.png";
import BasicProfilePic from "../../../Images/generic-profile-avatar.png";

class UserPost extends Component {
  constructor(props){
    super(props)
    window.addEventListener("resize", this.imageModelViewportsize);
    this.postID = "";
    this.FollowStatus = "";
    this.clickedImage = "";
    this.likes = 0;
    this.uploadDate = "";
    this.state = {
      imageModellayout: null,
      show: false,
      profilePic: BasicProfilePic,
      favBtnActive: false,
      numofFavs: 0
    };
  }

  componentDidMount(){
    if(this.props.favoritesView === undefined){
      Axios.get(`/posts/${this.getCurrentUser()}`).then((res) => {
        this.displayPosts(res.data.posts);
      });
    }else{
      if(this.context.loginUser.status){
        Axios.get(`/Favorites/${this.context.loginUser.user}`).then((res) => {
          this.setState({numofFavs: res.data.favorites.length});
          this.displayPosts(res.data.favorites);
        }); 
      }
    }
      Axios.get(`/ProfilePic/${this.getCurrentUser()}`).then((res) => {
        if(res.data.profilePic !== undefined){
          this.setState({profilePic: res.data.profilePic});
          this.imageModelViewportsize();
        }
        else{
          this.setState({profilePic: BasicProfilePic});
          this.imageModelViewportsize();
        }
    });
  }

  handleShow = (event) => {
    this.postID = document.getElementsByClassName(event.target.classList[2])[0].classList[1];         
    if(this.postID === "fa-heart"){
      this.postID = document.getElementsByClassName(event.target.classList[2])[0].parentElement.classList[2];
    }
    this.clickedImage = document.getElementsByClassName(this.postID)[0].src;
    if(this.context.loginUser.status){

    // get favorites of logged in user
    Axios.get(`/Favorites/${this.context.loginUser.user}`).then((res) => {
      for(var i = 0; i < res.data.favorites.length; i++){
        if(this.postID === res.data.favorites[i].postID){
          this.setState({favBtnActive:  true},() => {
            document.getElementById("modalFavoriteBtn").setAttribute("src", this.state.favBtnActive ? heartActive : heartInactive);
          });
        }
      }
     });
    }
     // get the amount of likes on selected post
     Axios.get(`/Likes/${this.postID.replace(/\d+/g, "")}/${this.postID}`).then((res) => {
      this.likes = res.data;
      this.imageModelViewportsize();
     });

     // get the amount of comments on selected post
     Axios.get(`/NumOfComments/${this.postID.replace(/\d+/g, "")}/${this.postID}`).then((res) => {
      this.comments = res.data;
     });

     // get upload date of the selected post
     Axios.get(`/UploadDate/${this.postID.replace(/\d+/g, "")}/${this.postID}`).then((res) => {
      this.uploadDate = res.data.substring(3, 15);
      this.imageModelViewportsize();
     });

    // get profile pic of post user
    Axios.get(`/ProfilePic/${this.getPostUser()}`).then((res) => {
      if(res.data.profilePic !== undefined){
        this.setState({profilePic: res.data.profilePic});
        this.imageModelViewportsize();
      }
      else{
        this.setState({profilePic: BasicProfilePic});
        this.imageModelViewportsize();
      }
  });
  

  // update following display for logged in user
      if(this.getPostUser() === this.context.loginUser.user){
        this.FollowStatus = "";
      }else{
        if((this.context.loginUser.status && this.props.favoritesView) || (this.context.loginUser.status)){
          Axios.get(`/following/${this.context.loginUser.user}`).then((res) => {
            var followedUser = res.data.following.find((user) => {
             return user.username === this.getPostUser();
            });
    
            if(followedUser !== undefined){
              this.FollowStatus = "Following";
              this.imageModelViewportsize();
            }else{
              this.FollowStatus = "Follow";
              this.imageModelViewportsize();
            }
          });
        }else{
          this.FollowStatus = "Follow";
          this.imageModelViewportsize();
        } 
      } 
    this.setState({ show: true }, (() => {
      if(this.getPostUser() === this.context.loginUser.user){
        document.getElementById("modalFavoriteBtn").setAttribute("src", heartDisable);
        document.getElementById("modalFavoriteBtn").style.cursor = "default";
      }else{
        document.getElementById("modalFavoriteBtn").addEventListener("click", this.favBtnClick);
      }
      
      document.getElementsByClassName("postUsername")[0].innerHTML = this.getPostUser();
    }));

    if(window.innerWidth >= 992){
      // add new comment
      if(this.context.loginUser.status){
        Axios.get(`/ProfilePic/${this.context.loginUser.user}`).then((res) => {
          document.getElementById("CommentTextBox").addEventListener("keydown", (event) => {
            if(event.key === "Enter"){
              Axios.post(`/AddComment/${this.postID}`, {
                comment: document.getElementById("CommentTextBox").value,
                user: this.context.loginUser.user,
                profilePic: res.data.profilePic
              }).then(() => {
                Axios.get(`/Comments/${this.postID.replace(/\d+/g, "")}/${this.postID}`).then((res) => {
                  this.updateComments(res.data.length - 1, res);
                });
              });
              document.getElementById("CommentTextBox").value = "";
            }
          });
        });
      }
    }

    // show comments of the current viewed post
    Axios.get(`/Comments/${this.postID.replace(/\d+/g, "")}/${this.postID}`).then((res) => {
      this.updateComments(0, res);
    });
  };
  
  updateComments = (commentAmount, responce) => {
    for (var i = commentAmount; i < responce.data.length; i++){
      var commentDiv = document.createElement("div");
      var commentProfilePic = document.createElement("img");
      var comment = document.createElement("p");
      var commentUser = document.createElement("span");

      commentUser.setAttribute("class", "bold");
      comment.setAttribute("class", "comment");
      commentProfilePic.setAttribute("class", "userCommentProfilePic");
      commentProfilePic.setAttribute("alt", "userProfilePic");
      commentProfilePic.setAttribute("src", responce.data[i].profilePic);
      commentUser.textContent = responce.data[i].user + " ";
      comment.textContent = responce.data[i].comment;

      
      commentDiv.appendChild(commentProfilePic);
      comment.prepend(commentUser);
      commentDiv.appendChild(comment);

      document.getElementsByClassName("commentSection")[0].appendChild(commentDiv);
    }
  };

  handleClose = () => {
    if(document.getElementsByClassName("UserPostsContainer").length >= 1){

      var postsContainer = document.getElementsByClassName("UserPostsContainer")[0];
      while (postsContainer.firstChild) {
        postsContainer.removeChild(postsContainer.lastChild);
      }
      Axios.get(`/posts/${this.getCurrentUser()}`).then((res) => {
        this.displayPosts(res.data.posts);
        this.setState({ show: false });
      });
    }
  };

   // get the name of the user of the post that is being viewed.
  getPostUser = () => {
    return this.postID.slice(0, this.postID.length - 1);
  };

  followBtnClick = () => {
    if(this.context.loginUser.status){
      Axios.post("/AddFollowing", {
        username: this.context.loginUser.user,
        newFollowing: this.getPostUser()
    }).then(() => {
      document.getElementById("modelfollowbtn").innerHTML= "Following";
      var followButton = document.getElementsByClassName("nameBtn")[0];
      followButton.classList.remove("btn-primary");
      followButton.classList.add("btn-light");
      followButton.innerHTML = "✓ Following";
    });
    }else{
      window.location.pathname = "/login";
    }
  };

  removePost = () => {
    Axios.post("/RemovePost", {
      user: this.context.loginUser.user,
      postID: this.postID,
    }).then((res) => {
      if(res.data === true){
        Axios.get(`/posts/${this.getCurrentUser()}`).then((res) => {
          this.props.postsUpdate(res.data.posts.length);
          this.handleClose();
        });
      }
    })
  };

  favBtnClick = () => {
      if(this.context.loginUser.status){
        if(this.state.favBtnActive){
          Axios.post(`/RemoveFavorite/${this.context.loginUser.user}`, {
            postID: this.postID
          }).then(() => {
            this.setState({numofFavs: this.state.numofFavs - 1}, () => {
              if(this.props.favoritesView === true){
                document.getElementById(this.postID).remove();
                  if(this.state.numofFavs === 0 ){
                    var favsEmptymessage = document.createElement("p");
                    favsEmptymessage.classList.add("NoFavsMessage");
                    favsEmptymessage.innerHTML = "You haven't favorited any posts yet!";
                    document.getElementsByClassName("container")[0].appendChild(favsEmptymessage);
                  }
                this.handleClose();
              }
            });
            Axios.get(`/Likes/${this.postID.replace(/\d+/g, "")}/${this.postID}`).then((res) => {
              Axios.post(`/UpdateLikes/${this.postID}`, {
                NewLikes: res.data - 1
              });
            });
            this.likes -= 1;
            this.imageModelViewportsize();
          });
        }else{
          
           Axios.post(`/FavoritePost/${this.context.loginUser.user}`, {
            loginUser: this.getCurrentUser(),
            postID: this.postID
          }).then(() => {
            Axios.get(`/Likes/${this.postID.replace(/\d+/g, "")}/${this.postID}`).then((res) => {
              Axios.post(`/UpdateLikes/${this.postID}`, {
                NewLikes: res.data + 1
              });
            });
            this.likes += 1;
            this.imageModelViewportsize();
          });
        }
        this.setState({favBtnActive:  !this.state.favBtnActive},() => {
          document.getElementById("modalFavoriteBtn").setAttribute("src", this.state.favBtnActive ? heartActive : heartInactive);
        });
      }else{
        window.location.pathname = "/login";
      }
  };

  // get the name of the profile the user is looking at
    getCurrentUser = () =>{
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

      displayPosts = (PostArray) => {
        if(document.getElementsByClassName("NoFavsMessage").length > 0){
          if(this.props.favoritesView){
             document.getElementsByClassName("NoFavsMessage")[0].style.display = "block";
          }
          else{
            document.getElementsByClassName("NoFavsMessage")[0].style.display = "none";
          }
        }
        
        for(var i = 0; i < PostArray.length; i++){
          var postDiv = document.createElement("div");
          var overlay = document.createElement("div");
          var overlayLikes = document.createElement("span");
          var overlayComments = document.createElement("span");
          var postImg = document.createElement("img");

          postDiv.setAttribute("class", "post");
          overlay.setAttribute("class", `overlay overlayFade ${PostArray[i].postID}`);
          overlayLikes.setAttribute("class", "fas fa-heart fa-lg");
          overlayComments.setAttribute("class", "fas fa-comment fa-lg");
          
          overlayLikes.innerHTML = (` ${PostArray[i].Likes}`);
          overlayComments.innerHTML = (` ${PostArray[i].comments.length}`);

          postImg.setAttribute("class", `userPost ${PostArray[i].postID}`);
          postImg.setAttribute("src", PostArray[i].PostImg);
          postImg.setAttribute("alt", "userPost");

          overlay.addEventListener("click", this.handleShow);

          overlay.appendChild(overlayLikes);
          overlay.appendChild(overlayComments);
          postDiv.appendChild(postImg);
          postDiv.appendChild(overlay);
          document.getElementsByClassName("UserPostsContainer")[0].appendChild(postDiv);
        }
      };

      addCommentInput = () => {
          if(this.context.loginUser.status){
            this.commentInput = (
                <FormControl
                  id="CommentTextBox"
                  type="text"
                  placeholder={"Add a Comment..."}
                  className="mr-sm-5"
                />
            );
          }else{
            this.commentInput = (
              <>
                <hr className="postModalline"></hr>
                <div className="commentInput">
                  <span className="Color"><a  className="commentLoginLink"  href="/login">Log in</a> to Like or Comment.</span>
                </div>
              </>
            );
          }
      };
      
      imageModelViewportsize = () => {
        if(this.state.show && window.innerWidth < 991 ){
          document.getElementById("userPostImage").style.width = document.getElementsByClassName("modal-body")[0].offsetWidth + "px";
        }
        this.addCommentInput();
        if(window.innerWidth > 991){
          this.imageModelDesign = (
              <Row>
                <Col className="userPostCol">
                  <img  id="userPostImage" src={this.clickedImage} alt="userPost"/>
                </Col>
                <Col>
                  <Row className="userinfoImage imageModelHeader">
                    <Col id="profilePicCol">
                      <img src={this.state.profilePic} id="modalProfilePic" className="userModelHeader" alt="ProfilePic"/>
                    </Col>
                    <Col id="userPostInfoCol">
                      <div className="postModelUser">
                        <p className="modelInfo postUsername"></p>
                        <p id="modelfollowbtn" className="modelInfo" onClick={this.followBtnClick}>{this.FollowStatus}</p>
                      </div>
                    </Col>
                    <Col id="postRemoveCol">
                        {this.context.loginUser.status && (this.context.loginUser.user === this.getCurrentUser()) ? <span className="fas fa-times fa-lg" onClick={this.removePost}></span> : null}
                    </Col>
                  </Row>
                    <hr className="postModalline"></hr>
                    <div className="commentSection">
                    </div>
                    <hr className="postModalline"></hr>
                    <Row>
                      <div className="imagebuttons">
                        <img id="modalFavoriteBtn" className="size" src={heartInactive} alt="favoriteButton"/>
                        <img className="size" src={commentIcon} alt="commentButton"/>
                        <img className="size" src={shareIcon} alt="shareButton"/>
                        <img id="modalBookmarkBtn" className="size" src={bookmarkIcon} alt="bookmarkButton"/>
                      </div>
                    </Row>
                    <Row>
                      <div className="imageInfo">
                        <p className="Color"><strong>{this.likes} likes</strong></p>
                        <p id="imageDate">{this.uploadDate}</p>
                      </div>
                    </Row>
                    {this.commentInput}
                  </Col>
              </Row>
          );
        }else{
          this.imageModelDesign = (
            <Row>
              <Row className="imageModelHeader">
              <Col>
                <img src={this.state.profilePic} id="modalProfilePic" className="userModelHeader" alt="ProfilePic"/>
              </Col>
              <Col>
              <div className="postModelUser">
                <p className="modelInfo postUsername"></p>
                <p id="modelfollowbtn" className="modelInfo" onClick={this.followBtnClick}>{this.FollowStatus}</p>
              </div>
              </Col>
                <Col id="postRemoveCol">
                  {this.context.loginUser.status && (this.context.loginUser.user === this.getCurrentUser()) ? <span className="fas fa-times fa-lg" onClick={this.removePost}></span> : null}
                </Col>
              </Row>
              <Col>
                <img id="userPostImage" src={this.clickedImage} alt="userPost"/>
                </Col>
                <Row className="imageModelfooter">
                  <Col className="modelImageBtns">
                    <img id="modalFavoriteBtn" className="size" src={heartInactive} alt="favoriteButton"/>
                  </Col>
                  <Col className="modelImageBtns">
                    <img src={commentIcon} alt="commentButton"/>
                  </Col>
                  <Col className="modelImageBtns modelShareBtn">
                    <img src={shareIcon} alt="shareButton"/>
                  </Col>
                </Row>
                <Row className="imageModelfooter">
                  <Col className="modelImageBtns">
                    <img className="bookmark" src={bookmarkIcon} alt="bookmarkButton"/>
                  </Col>
                </Row> 
                  <div className="imageInfo">
                    <p id="likes"><strong>{this.likes} likes</strong></p>
                    <p id="imageDate">{this.uploadDate}</p>
                  </div>
            </Row>
          );
        }
        this.setState({imageModellayout: this.imageModelDesign});
      };
      
      render(){
        return(
          <>
          <Modal show={this.state.show} size="lg" onHide={this.handleClose}>
                <Modal.Body id="userModalBody">
                  {this.state.imageModellayout}
                </Modal.Body>
              </Modal>
            <Container className="UserPostsContainer"></Container> 
          </>
        )
      };
};
UserPost.contextType = LoginContext;
export default UserPost;