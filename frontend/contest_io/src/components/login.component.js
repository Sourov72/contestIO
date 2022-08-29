import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Login = () => {
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setuser({
      ...user,
      [name]: value,
    });
  };

  const login = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/user/login", user)
      .then((res) => {
        localStorage.setItem("id", res.data.user._id);
        // console.log("hello this is logged in person userid: ", localStorage.getItem('id'));

        // set the cookie
        cookies.set("TOKEN", res.data.token, {
          path: "/",
          sameSite: true,
        });
        // redirect to home
        window.location = "/";
      })
      .catch((error) => {
        // login failure, send an alert
        alert(error.response.data.message);
        setuser({
          email: "",
          password: "",
        });
      });
  };

  return (
    <div className="container">
      {console.log("User", user)}
      <h2 className="text-center fw-bold my-3">Login</h2>
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4 my-5">
          <form>
            <div className="card text-center text-bg-theme-light">
              <div className="card-body">
                <div className="mb-3">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label fw-bold fs-5"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={user.email}
                    placeholder="user@contest.io"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                  />
                  <div id="emailHelp" className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="exampleInputPassword1"
                    className="form-label fw-bold fs-5"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="top secret..."
                    onChange={handleChange}
                    value={user.password}
                    className="form-control"
                    id="exampleInputPassword1"
                  />
                </div>

                <button type="submit" className="btn btn-theme" onClick={login}>
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-4"></div>
      </div>
    </div>
  );
};
