import React, { Component } from 'react';
import {Form, Button, Alert, Container, Row, Col, Popover, OverlayTrigger} from 'react-bootstrap';
import {Link} from "react-router-dom";
import axios from "axios";
import "../../css/LogSignform.css";

import homephone from "../../../Images/phone_photos/homescreen_phones.png";
import screenShot1 from "../../../Images/phone_photos/screenshot1.jpg";
import screenShot2 from "../../../Images/phone_photos/screenshot2.jpg";
import screenShot3 from "../../../Images/phone_photos/screenshot3.jpg";
import screenShot4 from "../../../Images/phone_photos/screenshot4.jpg";
import screenShot5 from "../../../Images/phone_photos/screenshot5.jpg";

class LogSignform extends Component {
    constructor(props){
        super(props);
        this.state = {username: "", password: "", error: ""};
    }

    loginSignup = () => {
        var usernameChecker = this.state.username.search(/^[a-zA-Z0-9_-]{3,20}$/);
        var passwordChecker = this.state.password.search(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{6,32})$/);

        // check for incorrect data in username or password field
        if(usernameChecker === -1){
            this.errorhandle("username")
        }
        else if(passwordChecker === -1){
            this.errorhandle("password")
        }
        else {
            // send data to server await responce for success or fail.
                axios.post(window.location.pathname, {
                    username: this.state.username,
                    password: this.state.password
                }).then((res) => {if(res.data === "success" && res.config.url === "/"){
                        window.location.pathname = "/login"
                }else if(res.config.url === "/login"){
                    window.location.pathname = `/profile/${res.data}`;
                }
                else{
                    this.errorhandle(res.data)
                }
                }).catch(err => {if(err.response.status === 401){
                    this.errorhandle("Invalid Username or Password");
                }else {console.log(err.response)}});
        }
    }

    // reset the error style after a period of time.
    resetError = () => {
        this.setState({error: ""})
        document.querySelector(".logsignError").style.display = "none";
    }

    // update username state.
    userInput = (event) => {
        this.setState({username: event.target.value});
    }

     // update password state.
    passwordInput = (event) => {
        this.setState({password: event.target.value});
    }

    // handle errors based on data submitted
    errorhandle = (errorStatus) => {
        switch(errorStatus){
            case "username":
            this.setState({error: "Please enter a valid username", username: ""});
            this.errorstyle();
            break;

            case "password":
            this.setState({error: "Please enter a valid password", password: ""});
            this.errorstyle();
            break;

            default:
            this.setState({error: errorStatus, username: "", password: ""});
            this.errorstyle();
            document.querySelector("#formUsername").value = "";
            document.querySelector("#formPassword").value = "";
            break;
        }
    };

    // style the errors
    errorstyle = () => {
        document.querySelector(".logsignError").style.display = "block";
        setTimeout(() => {this.resetError()}, 2500);
    };

    render() {
        var phones, usernameTips, passwordTips, passwordHelp
        if(window.screen.width > 768){
            phones =  ( 
                <Col id="phonesCol">
                    <div className="homephones">
                        <img src={homephone} alt="phone display"></img>
                        <img id="image-slide1" src={screenShot1} alt="screenShot1"></img>
                        <img id="image-slide2" src={screenShot2} alt="screenShot2"></img>
                        <img id="image-slide3" src={screenShot3} alt="screenShot3"></img>
                        <img id="image-slide4" src={screenShot4} alt="screenShot4"></img>
                        <img id="image-slide5" src={screenShot5} alt="screenShot5"></img>
                    </div>
                </Col>
            )
        }

        if(window.location.pathname === "/"){
            usernameTips = (<Form.Text className="text-muted userPasstextbox">Must contain between 3-20 characters.</Form.Text>);
            passwordTips = (<Form.Text className="text-muted userPasstextbox">Passwords must be at least 6 characters.</Form.Text>);
            passwordHelp = (
                <OverlayTrigger
                    trigger="click"
                    key={"top"}
                    placement={"top"}
                    overlay={
                    <Popover id={"popover-positioned-top"}>
                        <Popover.Title as="h3">{"Password Requirments"}</Popover.Title>
                        <Popover.Content>
                            <li>Contains at least 6 characters.</li>
                            <li>Contains at least 1 upercase letter.</li>
                            <li>Contains at least 1 lowercase letter.</li>
                            <li>Contains at least 1 number.</li>
                            <li>Contains at least 1 special character.</li>
                        </Popover.Content>
                    </Popover>}>
                    <span className="helpCircle">?</span>
                    </OverlayTrigger>
                );
        }
            return (
                <Container>
                    <Row>
                            {phones}
                        <Col>
                            <div className="LogSignform">
                                <h1 className="title">Polarad</h1>
                                <h3 className="subTitle">{this.props.action} to see photos from your friends.</h3>
                                <Alert className="logsignError" variant="danger">{this.state.error}</Alert>
                                <Form>
                                    <Form.Group controlId="formUsername">
                                        <Form.Control className="userPasstextbox" type="text" placeholder="Username"  name="username" required onChange={this.userInput}/>
                                        {usernameTips}
                                    </Form.Group>
    
                                    <Form.Group controlId="formPassword">
                                        <Form.Control className="userPasstextbox" type="password" placeholder="Password" name="password" required onChange={this.passwordInput}/>
                                        {passwordTips}
                                        {passwordHelp}
                                    </Form.Group>
                                    <Button variant="primary" onClick={this.loginSignup}>
                                        {this.props.action}
                                    </Button>
                                </Form>
                            </div>
                            <div className="LogformLink">
                                <p className="LSQuestion">{this.props.message}<Link to={this.props.link}>{this.props.LinkAction}</Link></p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )
    }
}

export default LogSignform;