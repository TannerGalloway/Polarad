import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {Link} from "react-router-dom";
import "../../css/LogSignform.css";

class LogSignform extends Component {
    constructor(props){
        super(props);
        this.state = {username: "", password: ""};
        this.userInput = this.userInput.bind(this);
        this.passwordInput = this.passwordInput.bind(this);
    }

    userInput(event){
        this.setState({username: event.target.value});
    }

    passwordInput(event){
        this.setState({password: event.target.value});
    }

    render() {
            return (
                <div>
                    <div className="LogSignform">
                        <h1 className="title">Polarad</h1>
                        <h3 className="subTitle">{this.props.action} to see photos from your friends.</h3>
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Control type="text" placeholder="Username" onChange={this.userInput} />
                            </Form.Group>
    
                            <Form.Group controlId="formPassword">
                                <Form.Control type="password" placeholder="Password" onChange={this.passwordInput} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {this.props.action}
                            </Button>
                        </Form>
                    </div>
                    <div className="LogformLink">
                <p className="LSQuestion">{this.props.message}<Link to={this.props.link}>{this.props.LinkAction}</Link></p>
                    </div>
                </div>
            )
    }
}

export default LogSignform;