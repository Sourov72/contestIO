import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const ContestCategoryAdd = (props) => {
  let contestid = "0";

  const location = useLocation();

  const [category, setcategory] = useState({
    contestID: "",
    title: "",
    description: "",
    maxvoteperUser: "",
    maxchoices: "",
  });

  useEffect(() => {
    contestid = location.state.catcontestID;

    setcategory({
      ...category,
      contestID: contestid,
    });

    console.log("contestid in useeffect", category.contestID);
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setcategory({
      ...category,
      [name]: value,
    });

    console.log("contestID ", category.contestID);
  };

  const createNewCategory = (e) => {
    e.preventDefault();

    // alert("Category add form posted");
    axios
      .post("http://localhost:5000/api/contests/category", category)
      .then((res) => {
        // alert(res.data);
        console.log(res.data);
        if (res.data.msg === "added successfully") {

          console.log("category added successfully");
            // window.location = "/contestshow";

            setcategory({
              title: "",
              description: "",
              maxvoteperUser: "",
              maxchoices: "",
            });
        }
      });
    //window.location = "/";
  };

  return (
    <div className="signup container">
      {/* {console.log("category here", category)} */}
      <h1 className="container text-center">Category add</h1>
      <form className="needs-validation" noValidate>
        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="Inputname" className="form-label">
              Category Title
            </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={category.title}
              className="form-control"
              id="title"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Category Description
          </label>
          <input
            type="text"
            name="description"
            onChange={handleChange}
            value={category.description}
            className="form-control"
            id="description"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Max Vote For Each User
          </label>
          <input
            type="Number"
            min="1"
            name="maxvoteperUser"
            onChange={handleChange}
            value={category.maxvoteperUser}
            className="form-control"
            id="maxvoteperUser"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Max Choices for each Category
          </label>
          <input
            type="Number"
            min="1"
            name="maxchoices"
            onChange={handleChange}
            value={category.maxchoices}
            className="form-control"
            id="maxchoices"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Create Category
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
                  Create Category
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
