import React, { Component } from "react";
import "./Auth.css";
import AuthContext from "../context/authContex";

class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;

  constructor() {
    super();
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  changehandler = () => {
    this.setState((prevState) => {
      return {
        isLogin: !prevState.isLogin,
      };
    });
  };

  submithandler = async (event) => {
    event.preventDefault();
    try {
      const email = this.emailEl.current.value;
      const password = this.passwordEl.current.value;

      if (email.trim().length === 0 || password.trim().length === 0) {
        return;
      }

      let requestBody = {
        query: `
          query {
          login(email:"${email}"  password:"${password}") {
            userId
            token
            tokenExpiration
          }
        }`,
      };

      console.log(this.state.isLogin);

      if (!this.state.isLogin) {
        console.log("qwerty");
        requestBody = {
          query: `
            mutation {
              createUser(uInput:{email:"${email}"  password:"${password}"}) {
                _id
                email
              }
            }`,
        };
      }

      const user = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await user.json();
      console.log(res);
      if (this.state.isLogin && res.data.login.token) {
        const {token, tokenExpiration, userId} = res.data.login;
        this.context.login(token, tokenExpiration, userId)
      }
    } catch (e) {
      throw new Error('Something went wrong!')
    }
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submithandler}>
        <div className="form-control">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.changehandler}>
            Switch to {this.state.isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
