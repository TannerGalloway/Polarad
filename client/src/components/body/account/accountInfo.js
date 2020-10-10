import React, { Component } from "react";
import "../../css/accountInfo.css";
import LoginContext from "../../../loginContext";
import {Container, Row, Col, Image} from "react-bootstrap";
import Desktopview from "./desktopView"
import Mobileview from "./mobileView";
import MobileNav from "../nav/mobileNavbar";
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
    this.displayname = "";
    this.state = {
      posts: 0,
      followers: 0,
      following: 0,
      bio: "",
      postsActive: true,
      bookmarkActive: false,
      taggedActive: false,
      nonLoggeduserView: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // get user from url
    var urlArr = window.location.pathname.split(""), slashCount = 0, namepostion, userpagename;
    urlArr.map((index) => {if(index === "/"){slashCount++} return slashCount});
    if(slashCount === 2){
      namepostion = window.location.pathname.indexOf("/", window.location.pathname.indexOf("/") + 1) + 1;
      userpagename = window.location.pathname.slice(namepostion, window.location.pathname.length).replace(/%20/g, " ");
    }

    // check if user is in database
      Axios.get(`/validUser/${userpagename}`,).then((res) => {
        if(this._isMounted){
          if(res.data === ""){
            window.location.pathname = "/404";
          }else{
            this.displayname = res.data;
          }
        };
      });
    
    // get loggedin user
      Axios.get("/userSession").then((loggeduser) => {
        if(this._isMounted){
          if(loggeduser.data.userSession !== undefined){
            if(userpagename === loggeduser.data.userSession.user){
              this.setState({nonLoggeduserView: true});
            }else{
              this.setState({nonLoggeduserView: false});
            }
          }
        }
      });

    // get user bio
      Axios.get(`/bio/${userpagename}`).then((res) => {
        if(this._isMounted){
          if(res.data.bio === undefined){
            this.setState({bio: ""});
        }else{
          this.setState({bio: res.data.bio});
          }
        }
      });

    // set following count
      Axios.get(`/following/${userpagename}`).then((res) => {
        if(this._isMounted){
          this.setState({following: res.data.following.length});
        }
       });

     // set followers count
      Axios.get(`/followers/${userpagename}`).then((res) => {
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
  
  render() {
    var {
      posts,
      followers,
      following,
      bio,
      nonLoggeduserView
    } = this.state;
    var {favClickReturn} = this.props;
    var accountView, mobileNavBottom, favoritesPageContent,
      viewportSize = window.screen.width;
    if(viewportSize > 768){
      accountView = (
          <Desktopview displayName={this.displayname} posts={posts} followers={followers} following={following} bio={bio} accountpageView={nonLoggeduserView} />
      );
    }else{
      accountView = (
          <Mobileview displayName={this.displayname} posts={posts} followers={followers} following={following} bio={bio} accountpageView={nonLoggeduserView} />
      );
        mobileNavBottom = this.context.loginUser.status ? <MobileNav favoritesLink={(favoriteValue) => {this.props.favClick(favoriteValue)}} favoritesLinkReturn={favClickReturn} /> : null;
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
        <Container>
          <Row>
            <Col xs={3}>
              <Image
                id="profilepic"
                src="https://via.placeholder.com/120"
                roundedCircle
              />
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