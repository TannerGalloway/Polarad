import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../css/expiredSessionModal.css";
import Axios from "axios";

function ExpiredSessionModal() {
  setInterval(handleModalShow, 10000);

    const [modal_show, setmodal_show] = React.useState(false);

     // check user log in session and show modal
    function handleModalShow(){                   
      if(window.location.pathname === "/" || window.location.pathname === "/login"){
        return;
      }
      else{
         if(getCookie("connect.sid") === undefined){
          Axios.get("/userSession").then((session) => {
            if(session.data.userSession.status){
              Axios.get("/updateUserSession");
              console.log("expired");
              setmodal_show(true);
            }
          }).catch((err) => {console.log(err.response)});
        }
      }
    };

    // check if user session is expired
    function getCookie(name){
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    return (
        <>
          <Modal show={modal_show} onHide={() => {window.location.pathname = "/login"}} animation={false}>
            <Modal.Header>
              <Modal.Title>Session Expired!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Oh no! Looks like your session expired.</p>
              <p>Please login to continue.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" className="sessionModalBtn" href="/login">
                Login
              </Button>
            </Modal.Footer>
          </Modal>
        </>
    )
}
export default ExpiredSessionModal;