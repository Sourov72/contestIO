// import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import logo from "./logo192.png"
export const Profileview = (props) => {
  let id = "12";

  const [user, setuser] = useState({
    username: "",
    email: "",
    bio: "",
    facebookhandle: "",
    instagramhandle: "",
    img: "",
  });

  useEffect(() => {
    // here id is send simpliflically not as a object
    console.log("id bef: ", id);

    id = localStorage.getItem("id");

    console.log("id after: ", id);

    axios.get("http://localhost:5000/api/user/" + id).then((res) => {
      console.log(res.data.user.socialhandles.facebookhandle);
      setuser({
        username: res.data.user.username,
        email: res.data.user.email,
        bio: res.data.user.bio,
        facebookhandle: res.data.user.socialhandles.facebookhandle,
        instagramhandle: res.data.user.socialhandles.instagramhandle,
        img: decodeURIComponent(res.data.user.img),
      });
    });
  }, []);

  let source = "../images/" + user.img;
  console.log("hello vro", source);

  var stylingObject = {
    image: {
      width: 150,
      height: 150,
      borderColor: "purple",
      borderWidth: 2,
      borderRadius: 75,
    },
  };

  return (
    <div className="signup container">
      <h1 className="container text-center">Profile</h1>
      <form className="row">
        <div className="col-9">
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
            <div className="form-control form-control-sm">
              {user.facebookhandle}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">instagram handle</label>
            <div className="form-control form-control-sm">
              {user.instagramhandle}
            </div>
          </div>
        </div>
        <div className="col-3">
          {/* <img src={require("../images/" + user.img)} /> */}

          <div className="mb-3">
            {/* <img src={require(`../images/${user.img}`)} className="img-thumbnail" alt="..."></img> */}

            {/* <img src={source} alt="no image"/> */}
            <img
              src={source}
              className=" img-thumbnail"
              style={stylingObject.image}
              alt="..."
            ></img>
            <div htmlFor="formFileSm" className="form-label">
              Profile Picture
            </div>
          </div>
        </div>

        {/* <button type="submit" className="btn btn-primary mb-3" onClick={signup}>
          Signup
        </button> */}
      </form>
    </div>
  );
};
