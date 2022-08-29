import React, { useState } from "react";

import logo from "../images/logo.png";
import { Link } from "react-router-dom";

export const Navbar = (props) => {
  const [selected, setSelected] = useState("home");
  const isSelected = (name) => {
    let x = name === selected ? true : false;
    // console.log("name, ", name, x)
    return x
  };
  const handleClick = async (e) => {
    var { name } = e.target;
    // console.log("now selected, ", name)
    setSelected(name);
  };
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
            <li className='nav-item'>
              <Link to="/" className={isSelected('home') ? 'nav-link fw-bold active' : 'nav-link fw-bold'} name="home" onClick={handleClick}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/contests" className={isSelected('contests') ? 'nav-link fw-bold active' : 'nav-link fw-bold'} name="contests" onClick={handleClick}>
                Contests
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/about" className={isSelected('about') ? 'nav-link fw-bold active' : 'nav-link fw-bold'} name="about" onClick={handleClick}>
                About
              </Link>
            </li>

            {(() => {
              if (props.id !== "") {
                return (
                  <>
                    <li className='nav-item'>
                      <Link
                        to={"/profile/" + localStorage.getItem("id")}
                        className={isSelected('profile') ? 'nav-link fw-bold active' : 'nav-link fw-bold'}
                        name="profile"
                        onClick={handleClick}
                      >
                        Profile
                      </Link>
                    </li>

                    <li className='nav-item'>
                      <Link
                        to="/contests/create"
                        className={isSelected('create') ? 'nav-link fw-bold active' : 'nav-link fw-bold'}
                        name="create"
                        onClick={handleClick}
                      >
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
