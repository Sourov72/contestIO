import React, { Component } from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link to='/' className="navbar-brand">
            <img
              src={logo}
              alt=""
              width="30"
              height="30"
              className="d-inline-block align-text-top"
            />
            Contest.io
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to='/' className="nav-link active">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/contests' className="nav-link">
                  Contests
                </Link>
              </li>
              
            </ul>
            <Link className="d-flex" to='/login'>
              <button className="btn btn-success px-4">
                Login
              </button>
            </Link>
            <Link className="d-flex" to='/signup'>
              <button className="btn btn-warning px-4 mx-2">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}
