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
        .then((res) => console.log(res));
        window.location = "/";
    } else {
      alert("Invalid input");
    }
  };

  return (
    <div className="signup container">
      {console.log("user here", user)}
      <h1 className="container text-center">SignUP</h1>
      <form>
        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="InputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              value={user.username}
              className="form-control"
              id="InputName"
            />
          </div>
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={user.email}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={user.password}
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reexampleInputPassword1" className="form-label">
            Re-enter your Password
          </label>
          <input
            type="password"
            name="rePassword"
            onChange={handleChange}
            value={user.rePassword}
            className="form-control"
            id="reexampleInputPassword1"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            bio
          </label>
          <input
            type="text"
            name="bio"
            onChange={handleChange}
            value={user.bio}
            className="form-control"
            id="bio"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            facebookhandle
          </label>
          <input
            type="text"
            name="facebookhandle"
            onChange={handleChange}
            value={user.facebookhandle}
            className="form-control"
            id="facebookhandle"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            instagramhandle
          </label>
          <input
            type="text"
            name="instagramhandle"
            onChange={handleChange}
            value={user.instagramhandle}
            className="form-control"
            id="instagramhandle"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="formFileSm" className="form-label">
            Profile Pic Upload
          </label>
          <input
            className="form-control form-control-sm"
            type="file"
            
            onChange={fileHandle}
          />
        </div>

        <button type="submit" className="btn btn-primary mb-3" onClick={signup}>
          Signup
        </button>
      </form>
    </div>
  );
};
