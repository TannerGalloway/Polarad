import React, { Component } from "react";
import "../../css/accountInfo.css";
import { Container, Row, Col, Image} from "react-bootstrap";
import Desktopview from "../account/desktopView";
import Mobileview from "../account/mobileView";

import postsIconInactive from "../../../Images/posts.png";
import postsIconActive from "../../../Images/posts_active.png";
import bookmarkIconInactive from "../../../Images/bookmark.png";
import bookmarkIconActive from "../../../Images/bookmark_active.png";
import taggedIconInactive from "../../../Images/tagged.png";
import taggedIconActive from "../../../Images/tagged_active.png";

// var postsIcon = postsIconInactive;
// var bookmarkIcon = bookmarkIconInactive;
// var taggedIcon = taggedIconInactive;

const iconImages = {
  posts: postsIconInactive,
  postsActive: postsIconActive,
  bookmark: bookmarkIconInactive,
  bookmarkActive: bookmarkIconActive,
  tagged: taggedIconInactive,
  taggedActive: taggedIconActive
}
class accountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "John Smith",
      posts: 0,
      followers: 0,
      following: 0,
      bio: "Hello, I am here to show you pics of my adventures across america.",
      loggedin: false,
      postsActive: true,
      bookmarkActive: false,
      taggedActive: false
    };
  }
  
  toggleIcon = (event) => {
    switch(event.target.id){
      case "postsIcon":
        if(!this.state.postsActive){
          this.setState((prevState)  => ({postsActive: !prevState.postsActive}));
          this.setState(({bookmarkActive: false}));
          this.setState(({taggedActive: false})); 
        }
        
      // !this.state.postsActive ? this.setState((prevState)  => ({postsActive: !prevState.postsActive})) : this.setState((prevState)  => ({postsActive: !prevState.postsActive})); 
      break;

      case "bookmarkIcon":
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
    }
  }
  

  render() {
    const {
      displayName,
      posts,
      followers,
      following,
      bio,
      loggedin
    } = this.state;
    var accountView,
      viewportSize = window.screen.width;

    if (viewportSize > 768) {
      accountView = (
        <Desktopview displayName={displayName} posts={posts} followers={followers} following={following} bio={bio} />
      );
    } else {
      accountView = (
          <Mobileview displayName={displayName} posts={posts} followers={followers} following={following} bio={bio}/>
        );
    }
    var postsIcon = this.state.postsActive ? postsIconActive : postsIconInactive;
    var bookmarkIcon = this.state.bookmarkActive ? bookmarkIconActive : bookmarkIconInactive;
    var taggedIcon = this.state.taggedActive ? taggedIconActive : taggedIconInactive;

    return (
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
        <Row id="accountIcons">
          <Col>
            <Image
              id="postsIcon"
              src={postsIcon}
              onClick={this.toggleIcon}
            />
          </Col>
          <Col>
            <Image
              id="bookmarkIcon"
              src={bookmarkIcon}
              onClick={this.toggleIcon}
            />
          </Col>
          <Col>
            <Image
              id="taggedIcon"
              src={taggedIcon}
              onClick={this.toggleIcon}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default accountInfo;