import React, { Component, Fragment } from "react";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false,
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  cancelModel = () => {
    this.setState({ creating: false });
  };

  confirmModel = () => {
    this.setState({ creating: false });
    // TODO
  }

  render() {
    return (
      <Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal title="Add Event" canCancel canConfirm onConfirm={this.confirmModel} onCancel={this.cancelModel}>
            <p>Title</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button onClick={this.startCreateEventHandler} className="btn">
            Create Event
          </button>
        </div>
      </Fragment>
    );
  }
}

export default EventsPage;
