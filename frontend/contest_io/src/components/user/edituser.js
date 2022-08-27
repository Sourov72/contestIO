import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

import { uploadfile, deletefile } from "../helperFunctions";
import { storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";

const cookies = new Cookies();

export const EditProfile = () => {
  const token = cookies.get("TOKEN");
  const [user, setuser] = useState({
    username: "",
    nickname: "",
    oldpassword: "",
    reoldpassword: "",
    bio: "",
    facebookhandle: "",
    instagramhandle: "",
    img: "",
  });
  const [imageUpload, setimageUpload] = useState("");
  const [srcimg, setsrc] = useState("");

  useEffect(() => {
    // here id is send simpliflically not as a object
    const id = localStorage.getItem("id");

    axios
      .get("http://localhost:5000/api/user/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setsrc(decodeURIComponent(res.data.user.img));
        console.log(res.data.user.socialhandles.facebookhandle);
        setuser({
          username: res.data.user.username,
          nickname: res.data.user.nickname,
          oldpassword: res.data.user.password,
          bio: res.data.user.bio,
          facebookhandle: res.data.user.socialhandles.facebookhandle,
          instagramhandle: res.data.user.socialhandles.instagramhandle,
          img: decodeURIComponent(res.data.user.img),
        });
      });
  }, []);

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
    setimageUpload(upload_file);
    console.log("uploaded file", upload_file);
    setsrc(URL.createObjectURL(upload_file));
   
  };

  const update = async (e) => {
    e.preventDefault();
    let pictureRef = "";
    console.log("pass", user.oldpassword);
    console.log("repass", user.reoldpassword);
    if (imageUpload !== "") {
      const downloadURL = await uploadfile(imageUpload);
      user.img = downloadURL;
      console.log("user img after", user.img);
      pictureRef = await ref(storage, downloadURL);
      console.log("picture ref", pictureRef);

      // deleteObject(pictureRef);

    }
    user.img = encodeURIComponent(user.img);

    console.log("picref", pictureRef);
    axios
      .post(
        "http://localhost:5000/api/user/update/" + localStorage.getItem("id"),
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        alert(res.data.message);
        window.location = "/profile/" + localStorage.getItem("id");
      })
      .catch((error) => {
        alert(error.response.data.message);
        if (pictureRef !== "") {
          deletefile(pictureRef);
        }
      });

    setuser({
      ...user,
      reoldpassword: "",
    });
  };

  let source = "../../images/" + user.img;

  return (
    <div className="signup container">
      {console.log("user here", user)}
      <h1 className="container text-center">Update</h1>
      <form className="needs-validation" noValidate>
        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="Inputname" className="form-label">
              Name
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
              Profile Pic Change
            </label>
            <input
              className="form-control form-control-sm"
              type="file"
              onChange={fileHandle}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Update
          </button>

          <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Create Contest
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="reoldpassword"
                    onChange={handleChange}
                    value={user.reoldpassword}
                    className="form-control"
                    id="exampleInputPassword1"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={update}
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
