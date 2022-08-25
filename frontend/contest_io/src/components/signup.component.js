import React, { useState } from "react";
import axios from "axios";

export const Signup = () => {
  const [user, setuser] = useState({
    username: "",
    password: "",
    rePassword: "",
    email: "",
    bio: "",
    facebookhandle: "",
    instagramhandle: "",
    img: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setuser({
      ...user,
      [name]: value,
    });
  };

  const fileHandle = (e) => {
    const upload_file = e.target.files[0];
    console.log("uploaded file", upload_file);

    setuser({
      ...user,
      img: upload_file.name,
    });

    console.log("setted file", user.img);
  };

  const signup = (e) => {
    e.preventDefault();
    const { username, password, rePassword, email, bio } = user;
    if (username && email && bio && password === rePassword) {
      alert("Signup form posted");
      axios
        .post("http://localhost:5000/api/user/add", user)
        .then((res) => {
          alert("signup successful");
          window.location = "/login";
        })
        .catch((err) => {
          // signup failure, send an alert
          alert(err.response.data.message);
        });
    } else {
      alert(
        "Make sure you have provided proper username, email, password and bio"
      );
    }
  };

  return (
    <div className="container">
      <h2 className="text-center fw-bold my-3">Sign Up</h2>
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4 mt-4">
          <div className="card text-center text-bg-theme-light">
            <div className="card-body">
              <form className="needs-validation" noValidate>
                <div className="mb-2">
                  <label htmlFor="Inputname" className="form-label fw-bold fs-5">
                    Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    value={user.username}
                    placeholder="Your Full Name..."
                    className="form-control"
                    id="Inputname"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="exampleInputEmail1" className="form-label fw-bold fs-5">
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
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="exampleInputPassword1" className="form-label fw-bold fs-5">
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
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="reexampleInputPassword1"
                    className="form-label fw-bold fs-5"
                  >
                    Re-enter your Password
                  </label>
                  <input
                    type="password"
                    name="rePassword"
                    onChange={handleChange}
                    value={user.rePassword}
                    placeholder="repeat previous password"
                    className="form-control"
                    id="reexampleInputPassword1"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-theme my-2" onClick={signup}>
          Signup
        </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
      
    </div>
  );
};
