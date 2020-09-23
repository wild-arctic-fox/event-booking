import React, { Component, Fragment } from "react";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import AuthContext from "../context/authContex";
import EventList from '../Events/EventList';
import Spinner from '../Spinner/Spinner';
import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  static contextType = AuthContext;

  constructor() {
    super();
    this.titleElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
    this.priceElRef = React.createRef();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  cancelModel = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  confirmModel = async () => {
    try {
      this.setState({ creating: false });
      const title = this.titleElRef.current.value;
      const description = this.descriptionElRef.current.value;
      const price = +this.priceElRef.current.value;
      const date = this.dateElRef.current.value;

      if (
        title.trim().length === 0 ||
        description.trim().length === 0 ||
        price <= 0 ||
        date.trim().length === 0
      ) {
        return;
      }

      const event = { title, description, price, date };

      const requestBody = {
        query: `
          mutation {
            createEvent(eInput:{title:"${title}"  description:"${description}" price:${price} date:"${date}"}) {
              _id
              title
              description
              price
              date
            }
          }`,
      };

      const token = this.context.token;

      const result = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const res = await result.json();
      this.fetchEvents();
    } catch (e) {
      throw new Error("Something went wrong!");
    }
  };

  componentDidMount(){
    this.fetchEvents();
  }


  fetchEvents = async () => {
    try{
      this.setState({isLoading:true});
      const requestBody = {
        query: `
          query {
            events {
              _id
              title
              description
              price
              date
              creator {
                _id 
                email
              }
            }
          }`,
      };

      const result = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        },
      });
      const res = await result.json();
      const events = res.data.events;
      this.setState({events,isLoading:false});
    } catch (e) {
      this.setState({isLoading:false});
      console.log(e.message);
      throw new Error();
    }
  }

  viewDetailHandler = (eventId) => {
    this.setState(prev=>{
      const selectedEvent = prev.events.find(item=>item._id===eventId);
      return {
        selectedEvent
      }
    });
  }

  bookEventHandler = async ( ) => {
    this.cancelModel();
    if(!this.context.token){
      return;
    }
    const requestBody = {
      query: `
        mutation {
          bookEvent(eId:"${this.state.selectedEvent._id}") {
            _id
            createdAt
            updatedAt
          }
        }`,
    };

    const token = this.context.token;

    const user = await fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const res = await user.json();
  }

  render() {
    return (
      <Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onConfirm={this.confirmModel}
            onCancel={this.cancelModel}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.cancelModel}
            onConfirm={this.bookEventHandler}
            confirmText="Book"
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} - {' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
            <p>{this.state.selectedEvent.creator.email}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button onClick={this.startCreateEventHandler} className="btn">
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading?<Spinner/>:<EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.viewDetailHandler}
          />}
      </Fragment>
    );
  }
}

export default EventsPage;
