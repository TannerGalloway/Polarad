import React, { Component } from "react";
import "../../css/accountInfo.css";
import { Container, Row, Col, Image} from "react-bootstrap";
import Desktopview from "../account/desktopView";
import Mobileview from "../account/mobileView";
import MobileNav from "../nav/accountNavbar";

import postsIconInactive from "../../../Images/posts.png";
import postsIconActive from "../../../Images/posts_active.png";
import bookmarkIconInactive from "../../../Images/bookmark.png";
import bookmarkIconActive from "../../../Images/bookmark_active.png";
import taggedIconInactive from "../../../Images/tagged.png";
import taggedIconActive from "../../../Images/tagged_active.png";

class accountInfo extends Component {
  constructor(props) {
    super(props);
    this.favClick = false;
    this.state = {
      posts: 0,
      followers: 0,
      following: 0,
      bio: "Hello, I am here to show you pics of my adventures across america.",
      postsActive: true,
      bookmarkActive: false,
      taggedActive: false,
    };
  }

  componentDidMount() {
    if(sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/settings` && sessionStorage.getItem("userMenuClicked")){
      sessionStorage.removeItem("prevURL");
      sessionStorage.removeItem("userMenuClicked");
    }
    else if(sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/edit` && sessionStorage.getItem("userMenuClicked")){
      sessionStorage.removeItem("prevURL");
      sessionStorage.removeItem("userMenuClicked");
    }
    else if(sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/settings` || sessionStorage.getItem("prevURL") === `/profile/${this.props.displayName}/edit`){
      this.favClick = !this.favClick;
      this.favsClickedOtherPage(this.favClick);
      setTimeout(() => {
        sessionStorage.removeItem("prevURL");
        sessionStorage.removeItem("userMenuClicked");
      }, 250);
    }
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
        if(!this.props.loggedin){
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
        if(!this.props.loggedin){
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
 
  favsClickedOtherPage = (favoriteValue) => {   
      this.props.favClickAccountInfo(favoriteValue);
  }
  
  render() {
    const {
      posts,
      followers,
      following,
      bio
    } = this.state;
    var {loggedin, displayName, favoritesPage} = this.props;
    var accountView, mobileNavBottom, favoritesPageContent,
      viewportSize = window.screen.width;
      if(viewportSize > 768){
        accountView = (
          <Desktopview loggedin={loggedin} displayName={displayName} posts={posts} followers={followers} following={following} bio={bio} />
        );
      }else{
        accountView = (
          <Mobileview loggedin={loggedin} displayName={displayName} posts={posts} followers={followers} following={following} bio={bio}/>
        );
          mobileNavBottom = loggedin ? <MobileNav displayName={displayName} favoritesLink={this.favsClickedOtherPage} favoritesLinkReturn={favoritesPage}/> : null;
      }

      if(!favoritesPage){
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
              src="https://via.placeholder.com/92"
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

export default accountInfo;