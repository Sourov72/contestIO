import React from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

export const Navbar = (props) => {
  function login_logout() {
    if (props.id === "") {
      return () => {
        return (
          <>
            <Link className="d-flex" to="/login">
              <button className="btn btn-success px-4">Login</button>
            </Link>
            <Link className="d-flex" to="/signup">
              <button className="btn btn-warning px-4 mx-2">Signup</button>
            </Link>
          </>
        );
      };
    } else {
      return () => {
        return (
          <>
            <Link className="d-flex" to="/logout">
              <button className="btn btn-success px-4">Logout</button>
            </Link>
          </>
        );
      };
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
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
              <Link to="/" className="nav-link active fw-bold">
                Home
                {/* hello
                {props.id}
                bello */}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contests" className="nav-link fw-bold">
                Contests
              </Link>
            </li>
            <li className="nav-item">
                <Link to='/about' className="nav-link fw-bold">
                  About
                </Link>
              </li>
              

            {(() => {
            if (props.id !== "") {
              return (
                <>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link fw-bold">
                      Profile
                    </Link>              
                  </li>
              
                  <li className="nav-item">
                    <Link to='/createcontest' className="nav-link fw-bold">
                      Create
                    </Link>
                  </li>
                </>
              );
            } 
          })()}

                

          </ul>

          {(() => {
            if (props.id === "") {
              return (
                <>
                  <Link className="d-flex" to="/login">
                    <button className="btn btn-success px-4">Login</button>
                  </Link>
                  <Link className="d-flex" to="/signup">
                    <button className="btn btn-warning px-4 mx-2">
                      Signup
                    </button>
                  </Link>
                </>
              );
            } else {
              return (
                <>

                  <Link className="d-flex" to="/logout">
                    <button className="btn btn-success px-4">Logout</button>
                  </Link>
                </>
              );
            }
          })()}

          {/* {login_logout()} */}

          {/* <Link className="d-flex" to='/login'>
              <button className="btn btn-success px-4">
                Login
              </button>
            </Link>
            <Link className="d-flex justify-content-end" to='/signup'>
              <button className="btn btn-warning px-4 py-3 mx-2">
                Signup
              </button>
            </Link> */}
        </div>
      </div>
    </nav>
  );
};
