import React, { Component } from "react";
import AuthContext from "../context/authContex";
import Spinner from "../Spinner/Spinner";
import BookingsList from '../Bookings/BookingsList/BookingsList';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  componentDidMount = () => {
    this.fetchBookings();
  };

  fetchBookings = async () => {
    try {
      this.setState({ isLoading: true });
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              createdAt
              event{
                date
                title
              }
            }
          }`,
      };

      const result = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.context.token,
        },
      });
      const res = await result.json();
      const bookings = res.data.bookings;
      this.setState({ bookings, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      throw new Error();
    }
  };

  cancelBookingHandler = async (id) => {
    try {
      this.setState({ isLoading: true });
      const requestBody = {
        query: `
          mutation {
            cancelBooking(bId: "${id}"){
              _id
            }
          }`,
      };

      const result = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.context.token,
        }
      });
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => {
          return booking._id !== id;
        });
        return { bookings: updatedBookings, isLoading: false };
      });
    } catch (e) {
      this.setState({ isLoading: false });
      throw new Error();
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>The Bookings Page</h1>
        {this.state.isLoading?<Spinner/>:(
         <BookingsList bookings={this.state.bookings} onDelete={this.cancelBookingHandler}/>
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
