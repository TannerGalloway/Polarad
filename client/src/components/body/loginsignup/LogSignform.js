import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {Link} from "react-router-dom";
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
        this.state = {username: "", password: ""};
    }

    userInput = (event) => {
        this.setState({username: event.target.value});
    }

    passwordInput = (event) => {
        this.setState({password: event.target.value});
    }

    render() {
        var phones;
        if(window.screen.width > 768){
            phones =  ( 
            <div className="homephones">
                <img src={homephone} alt="phone display"></img>
                    <img id="image-slide1" src={screenShot1} alt="screenShot1"></img>
                    <img id="image-slide2" src={screenShot2} alt="screenShot2"></img>
                    <img id="image-slide3" src={screenShot3} alt="screenShot3"></img>
                    <img id="image-slide4" src={screenShot4} alt="screenShot4"></img>
                    <img id="image-slide5" src={screenShot5} alt="screenShot5"></img>
            </div>
            )
        }
            return (
                <>
                    {phones}
                    <div className="LogSignform">
                        <h1 className="title">Polarad</h1>
                        <h3 className="subTitle">{this.props.action} to see photos from your friends.</h3>
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Control className="userPasstextbox" type="text" placeholder="Username" onChange={this.userInput}/>
                            </Form.Group>
    
                            <Form.Group controlId="formPassword">
                                <Form.Control className="userPasstextbox" type="password" placeholder="Password" onChange={this.passwordInput}/>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {this.props.action}
                            </Button>
                        </Form>
                    </div>
                    <div className="LogformLink">
                <p className="LSQuestion">{this.props.message}<Link to={this.props.link}>{this.props.LinkAction}</Link></p>
                    </div>
                </>
            )
    }
}

export default LogSignform;