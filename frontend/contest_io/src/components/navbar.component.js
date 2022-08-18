import React from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

export const Navbar = (props) => {
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
          <ul className="nav navbar-nav mx-auto mb-2">
            <li className="nav-item">
              <Link to="/" className="nav-link active fw-bold">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contests" className="nav-link fw-bold">
                Contests
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link fw-bold">
                About
              </Link>
            </li>

            {(() => {
              if (props.id !== "") {
                return (
                  <>
                    <li className="nav-item">
                      <Link
                        to={"/profile/" + localStorage.getItem("id")}
                        className="nav-link fw-bold"
                      >
                        Profile
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/contests/create" className="nav-link fw-bold">
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
                    <button className="btn btn-theme px-4">Login</button>
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
                    <button className="btn btn-theme px-4">Logout</button>
                  </Link>
                </>
              );
            }
          })()}
        </div>
      </div>
    </nav>
  );
};
