import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { uploadfile, deletefile } from "../helperFunctions";
import { storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";
const cookies = new Cookies();

export const ContestContentAdd = (props) => {
  let contestid = "0";
  const token = cookies.get("TOKEN");
  let navigate = useNavigate();

  const location = useLocation();

  const [contestattr, setcontestattr] = useState({
    contesttype: "",
    contestcategories: "",
  });

  const [choice, setchoice] = useState({
    categoryID: "",
  });

  const [imageUpload, setimageUpload] = useState("");

  const [content, setcontent] = useState({
    userID: "",
    contestID: "",
    type: "",
    title: "",
    description: "",
    link: "",
  });

  useEffect(() => {
    contestid = location.state.contestID;

    console.log("contekjskjf", contestid);

    const type = location.state.contesttype;

    const userid = localStorage.getItem("id");

    setcontent({
      ...content,
      userID: userid,
      contestID: contestid,
      type: type,
    });

    setcontestattr({
      ...contestattr,
      contesttype: type,
    });

    // setchoice({
    //   ...choice,
    //   contestID: contestid,
    // });

    console.log("contestid in useeffect", contestid);

    getallcategories();
  }, []);

  function getallcategories() {
    // console.log(user);
    //path to be corrected
    console.log("contestid in get categoryies", contestid);
    axios
      .get("http://localhost:5000/api/contests/getcatogory/" + contestid, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setcontestattr({
          ...contestattr,
          contestcategories: res.data,
        });

        setchoice({
          ...choice,
          categoryID: res.data[0]._id,
        });
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setcontent({
      ...content,
      [name]: value,
    });

    console.log("contestID in handlechange ", content.contestID);
  };

  const categoryChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    console.log("value", value);

    var foundValue = contestattr.contestcategories.filter(
      (obj) => obj.title === value
    );

    console.log("category id", foundValue[0]._id);

    setchoice({
      ...choice,
      categoryID: foundValue[0]._id,
    });

    console.log("categoryID ", choice.categoryID);
  };

  const fileHandle = (e) => {
    const upload_file = e.target.files[0];
    setimageUpload(upload_file);
    console.log("uploaded file", upload_file);
  };

  const createNewContent = async (e) => {
    e.preventDefault();
    let pictureRef = "";

    if (imageUpload !== "") {
      const downloadURL = await uploadfile(imageUpload);
      content.link = encodeURIComponent(downloadURL);
      console.log("user img after", content.link);
      pictureRef = await ref(storage, downloadURL);
      console.log("picture ref", pictureRef);

      // deleteObject(pictureRef);
    }

    alert("content add form posted");
    axios
      .post(
        "http://localhost:5000/api/contents/create",
        {
          content: content,
          choice: choice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // alert(res.data);
        console.log(res.data);
        if (res.data.msg === "added successfully") {
          console.log("added successfully");
          //   window.location = "/";
          navigate("/contests/" + content.contestID, {
            state: { contestID: content.contestID },
          });
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
        if (pictureRef !== "") {
          deletefile(pictureRef);
        }
      });
    //window.location = "/";
  };

  return (
    <div className="signup container">
      {/* {console.log("content here", content)} */}
      <h1 className="container text-center">content add</h1>
      <form className="needs-validation" noValidate>
        <div className="mb-3">
          <div className="mb-3">
            <div className="mb-3">
              <label htmlFor="inputEmail4" className="form-label fw-bold">
                Choose Category
              </label>
              <select
                className="form-select"
                name="category"
                onChange={categoryChange}
                // value={contest.objective}
                id="category"
              >
                {contestattr.contestcategories.length > 0 ? (
                  <>
                    {contestattr.contestcategories.map((contestcat) => (
                      <option key={contestcat._id}> {contestcat.title}</option>
                    ))}
                  </>
                ) : (
                  <></>
                )}
                {/* <option>Photo Contest</option>
                <option>Video Contest</option>
                <option>Poll</option> */}
              </select>
            </div>

            <label htmlFor="Inputname" className="form-label">
              content Title
            </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={content.title}
              className="form-control"
              id="title"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            content Description
          </label>
          <input
            type="text"
            name="description"
            onChange={handleChange}
            value={content.description}
            className="form-control"
            id="description"
            required
          />
        </div>

        {content.type === "Poll" ? (
          <></>
        ) : (
          <>
            <div className="mb-3">
              <label htmlFor="formFileSm" className="form-label">
                Content Media
              </label>
              <input
                className="form-control form-control-sm"
                type="file"
                onChange={fileHandle}
              />
            </div>
          </>
        )}

        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Create content
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create content
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">Are You Sure?</div>
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
                  className="btn btn-primary "
                  data-bs-dismiss="modal"
                  onClick={createNewContent}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
