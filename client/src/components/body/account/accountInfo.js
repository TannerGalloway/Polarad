import React, { Component } from "react";
import "../../css/accountInfo.css";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import Desktopview from "../account/desktopView";
import Mobileview from "../account/mobileView";

import postsIcon from "../../../Images/posts.png";
import postsIconActive from "../../../Images/posts_active.png";
import bookmarkIcon from "../../../Images/bookmark.png";
import bookmarkIconActive from "../../../Images/bookmark_active.png";
import taggedIcon from "../../../Images/tagged.png";
import taggedIconActive from "../../../Images/tagged_active.png";

class accountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "John Smith",
      posts: "0",
      followers: "0",
      following: "0",
      bio:
        "Hello, I am here to show you pics of my adventures across america.",
      loggedin: false
    };
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
        console.log(Desktopview);
    }
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
        <Row>
          <Col>
            <Image
              id="postsIcon"
              src={postsIcon}
            />
          </Col>
          <Col>
            <Image
              id="bookmarkIcon"
              src={bookmarkIcon}
            />
          </Col>
          <Col>
            <Image
              id="taggedIcon"
              src={taggedIcon}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default accountInfo;