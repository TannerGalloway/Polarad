import React from "react";
import Navbar from "../nav/navbar";
import { Container, Button } from "react-bootstrap";
import "../../css/PageNotFound.css";

function PageNotFound(props) {
    var {loggedin, displayName } = props;
    return (
        <>
        <Navbar loggedin={loggedin} displayName={displayName}/>
        <Container>
        <div className="NotFoundPage">
            <h2 className="bold">Sorry, this page isn't available.</h2>
            <p>The Link you followed may be broken, or the page may have been removed. <Button id="returnLink" variant="link" onClick={() => window.location.pathname = "/login"}>Go back to Polarad.</Button></p>
        </div>
        </Container>
        </>
    )
}

export default PageNotFound;