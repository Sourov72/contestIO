import React, { Component } from "react";
// import logo from ;
import { Link } from "react-router-dom";

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg bg-light py-4">
        <div className="container-fluid">
          <div className="align-middle ">
            <Link to='/' className="navbar-brand fs-2">
              <img
                src={require("../images/logo.png")}
                alt="contest.io"
                width="70"
                height="60"
                className="d-inline-block align-text-top pe-2"
              />
              Contest.io
            </Link>
          </div>
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
            <ul className="navbar-nav justify-content-lg-center me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to='/' className="nav-link fw-bold active">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/contests' className="nav-link fw-bold">
                  Contests
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/about' className="nav-link fw-bold">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/create' className="nav-link fw-bold">
                  Create
                </Link>
              </li>
              
            </ul>
            <Link className="d-flex justify-content-end" to='/login'>
              <button className="btn btn-success px-4 py-3">
                Login
              </button>
            </Link>
            <Link className="d-flex justify-content-end" to='/signup'>
              <button className="btn btn-warning px-4 py-3 mx-2">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}
