import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo192.png"
export const Profileview = (props) => {
  let id = "62c5d26ea158b2eb00da68d0";

  const [user, setuser] = useState({
    username: "",
    email: "",
    bio: "",
    facebookhandle: "",
    instagramhandle: "",
    img: "",
  });

;

  useEffect(() => {
    // here id is send simpliflically not as a object
    axios.get("http://localhost:5000/user/" + id).then((res) => {
      setuser({
        username: res.data.user.username,
        email: res.data.user.email,
        bio: res.data.user.bio,
        facebookhandle: res.data.user.socialhandles.facebookhandle,
        instagramhandle: res.data.user.socialhandles.instagramhandle,
        img: res.data.user.img,
      });
    });
  }, []);

  const file_name = user.img

  return (
    <div className="signup container">
      <h1 className="container text-center">Profile</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="InputName" className="form-label">
            Name
          </label>
          <div className="form-control form-control-sm">{user.username}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="InputName" className="form-label">
            Email
          </label>
          <div className="form-control form-control-sm">{user.email}</div>
        </div>
        <div className="mb-3">
          <label className="form-label">bio</label>
          <div className="form-control form-control-sm">{user.bio}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">facebook handle</label>
          <div className="form-control form-control-sm">{user.facebookhandle} {user.img}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">instagram handle</label>
          <div className="form-control form-control-sm">{user.instagramhandle}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="formFileSm" className="form-label">
            Small file input example
          </label>
          {/* <img src={require(`../images/${user.img}`)} className="img-thumbnail" alt="..."></img> */}

          {/* <img src={require("../images/" + file_name)} /> */}
        </div>

        {/* <button type="submit" className="btn btn-primary mb-3" onClick={signup}>
          Signup
        </button> */}
      </form>
    </div>
  );
};
