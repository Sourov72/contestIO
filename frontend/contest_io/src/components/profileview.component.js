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
      <h1 className="text-center my-3">Profile</h1>
      <form className="row">
        <div className="col-2"></div>
        <div className="col-5">
          <div className="mb-3">
            <label htmlFor="InputName" className="form-label fw-bold">
              Name
            </label>
            <div className="form-control form-control-sm">{user.username}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="InputName" className="form-label fw-bold">
              Email
            </label>
            <div className="form-control form-control-sm">{user.email}</div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Bio</label>
            <div className="form-control form-control-sm">{user.bio}</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Facebook</label>
            <div className="form-control form-control-sm">
              {user.facebookhandle}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Instagram</label>
            <div className="form-control form-control-sm">
              {user.instagramhandle}
            </div>
          </div>
        </div>
        <div className="col-2">
          <div className="text-center text-wrap my-2">
            <img
              src={source}
              className=" img-thumbnail"
              style={stylingObject.image}
              alt={user.username}
            ></img>
            <p>{user.username}</p>
          </div>
        </div>

        {/* <button type="submit" className="btn btn-primary mb-3" onClick={signup}>
          Signup
        </button> */}
      </form>
    </div>
  );
};
