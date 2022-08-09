import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const ContestContentAdd = (props) => {
  let contestid = "0";
  let navigate = useNavigate(); 

  const location = useLocation();

  const [contestattr, setcontestattr] = useState({
    contesttype: "",
    contestcategories: "",
  });

  const [choice, setchoice] = useState({
    contestID: "",
    categoryID: "",
  });

  const [content, setcontent] = useState({
    participantID: "",
    type: "",
    title: "",
    description: "",
    link: "",
  });

  useEffect(() => {
    contestid = location.state.contentcontestID;

    const type = location.state.contesttype;

    const userid = localStorage.getItem("id");

    setcontent({
      ...content,
      participantID: userid,
      type: type,
    });

    setcontestattr({
      ...contestattr,
      contesttype: type,
    });

    setchoice({
      ...choice,
      contestID: contestid,
    });

    console.log("contestid in useeffect", choice.contestID);

    getallcategories();
  }, []);

  function getallcategories() {
    // console.log(user);
    //path to be corrected
    console.log("contestid", contestid);
    axios
      .get("http://localhost:5000/api/contests/getcatogory/" + contestid)
      .then((res) => {
        console.log(res);
        setcontestattr({
          ...contestattr,
          contestcategories: res.data,
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

    console.log("contestID ", choice.contestID);
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
    console.log("uploaded file", upload_file);

    setcontent({
      ...content,
      link: upload_file.name,
    });

    console.log("setted file", content.link);
  };

  const createNewCategory = (e) => {
    e.preventDefault();

    alert("content add form posted");
    axios
      .post("http://localhost:5000/api/contents/create", {
        content: content,
        choice: choice,
      })
      .then((res) => {
        alert(res.data);
        console.log(res.data);
        if (res.data.msg === "added successfully") {
          
          console.log("added successfully");
          //   window.location = "/";
          navigate("/contestshow", { state: {contestID : choice.contestID} });
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
                  className="btn btn-primary mb-3"
                  data-bs-dismiss="modal"
                  onClick={createNewCategory}
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
