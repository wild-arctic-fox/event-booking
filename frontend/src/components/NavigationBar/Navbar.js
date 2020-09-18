import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import AuthContext from "../../components/context/authContex";

const MainNavigationBar = (props) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <div className="main-navigation__logo">
              <h1>EasyEvent</h1>
            </div>
            <nav className="main-navigation__items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Sign in/up</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainNavigationBar;
