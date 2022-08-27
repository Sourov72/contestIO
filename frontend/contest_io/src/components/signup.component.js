import React, { useState } from "react";
import axios from "axios";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import {
  participantValueToType,
  obj2str,
  participantTypeToValue,
  uploadfile,
  deletefile,
} from "./helperFunctions";

export const Signup = () => {
  const [user, setuser] = useState({
    username: "",
    password: "",
    rePassword: "",
    nickname: "",
    email: "",
    bio: "",
    facebookhandle: "",
    instagramhandle: "",
    img: "",
  });
  const [srcimg, setsrc] = useState("");

  const [imageUpload, setimageUpload] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setuser({
      ...user,
      [name]: value,
    });
  };

  const fileHandle = async (e) => {
    const upload_file = e.target.files[0];
    setimageUpload(upload_file);
    setsrc(URL.createObjectURL(upload_file));
    console.log("uploaded file", upload_file);

    // console.log("setted file image ref", imageRef);
  };

  const signup = async (e) => {
    e.preventDefault();
    let pictureRef = "";
    console.log("img in isgnfdsf", imageUpload);
    const { username, password, rePassword, email, bio } = user;
    if (username && email && bio && password === rePassword) {
      alert("Signup form posted");

      if (imageUpload !== "") {
        const downloadURL = await uploadfile(imageUpload);
        user.img = encodeURIComponent(downloadURL);
        console.log("user img after", user.img);
        pictureRef = await ref(storage, downloadURL);
      }

      console.log("picref", pictureRef);

      axios
        .post("http://localhost:5000/api/user/add", user)
        .then((res) => {
          alert("signup successful");

          window.location = "/login";
        })
        .catch((err) => {
          // signup failure, send an alert
          alert(err.response.data.message);
          if (pictureRef !== "") {
            deletefile(pictureRef);
          }
        });
    } else {
      alert(
        "Make sure you have provided proper username, email, password and bio"
      );
      if (pictureRef !== "") {
        deletefile(pictureRef);
      }
    }
  };

  return (
    <div className="signup container">
      {console.log("user here", user)}
      <h1 className="container text-center">SignUP</h1>
      <form className="needs-validation" noValidate>
        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="Inputname" className="form-label">
              User Name
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              value={user.username}
              className="form-control"
              id="Inputname"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Inputname" className="form-label">
              Nick Name
            </label>
            <input
              type="text"
              name="nickname"
              onChange={handleChange}
              value={user.nickname}
              className="form-control"
              id="Inputnickname"
              required
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
            required
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
            required
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
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Bio.
          </label>
          <input
            type="text"
            name="bio"
            onChange={handleChange}
            value={user.bio}
            className="form-control"
            id="bio"
            required
          />
          <div className="invalid-feedback">Please provide a bio.</div>
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
        <img
              src={srcimg}
              className=" img-thumbnail"
              // style={stylingObject.image}
              // alt={user.username}
            ></img>
          <label htmlFor="formFileSm" className="form-label">
            Profile Pic Upload
          </label>
          <input
            className="form-control form-control-sm"
            type="file"
            onChange={fileHandle}
          />
        </div>

        <button type="submit" className="btn btn-theme mb-3" onClick={signup}>
          Signup
        </button>
      </form>
    </div>
  );
};
