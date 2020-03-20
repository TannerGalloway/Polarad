import React, { Component } from "react";
import { Button, Modal, Form, FormControl } from "react-bootstrap";
import "../../css/modalStyle.css";

import Search from "../../../Images/search.png";

class SearchModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false, searchTerm: ""
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  onChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    return (
      <>
        <img
          id="searchIcon"
          alt="Search"
          src={Search}
          width="60"
          height="60"
          onClick={this.handleShow}
        />

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Search</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search"
              onChange={this.onChange}
              className="mr-sm-2"
            />
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="modalstyle">Search</Button>
          </Modal.Footer>
        </Modal>
        </>
    );
  }
}

  export default SearchModal;