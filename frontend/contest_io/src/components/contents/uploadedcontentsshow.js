import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { Contentcard } from "./contentcard";

export const UploadedContentsShow = () => {
  var contestid = "0";
  var categoryid = "0";
  // var check = false;
  var col = 12;

  var participant_type = "uploader";

  const userid = localStorage.getItem("id");

  const location = useLocation();

  const [check, setcheck] = useState(false);

  const [contestattr, setcontestattr] = useState({
    userID: "",
    contestID: "",
  });

  const [category, setcategoryid] = useState({
    categoryID: "",
  });

  const [categories, setcategories] = useState({
    contestcategories: "",
  });

  const [contents, setcontents] = useState({
    categorycontents: "",
  });

  useEffect(() => {
    contestid = location.state.contestID;
    // contestid = "62d50baa66f2e7694652ff74";

    console.log("userid", localStorage.getItem("id"));

    setcontestattr({
      ...contestattr,
      userID: localStorage.getItem("id"),
      contestID: contestid,
    });

    getallcategories();
    //getcategorycontent();
  }, []);

  function getallcategories() {
    // console.log(user);
    //path to be corrected
    console.log("contestid", contestid);
    axios
      .get("http://localhost:5000/api/contests/getcatogory/" + contestid)
      .then((res) => {
        // console.log(res);
        categoryid = res.data[0]._id;
        console.log("categories", res.data);

        setcategories({
          ...categories,
          contestcategories: res.data,
        });

        setcategoryid({
          ...category,
          categoryID: res.data[0]._id,
        });
      });
  }

  function getcategorycontent() {
    console.log("category id in get category  content", categoryid);
    axios
      .get("http://localhost:5000/api/contents/getallcontent/" + categoryid)
      .then((res) => {
        // console.log(res);
        setcontents({
          categorycontents: res.data,
        });
        if (res.data.length > 0) console.log("category contents", res.data[0]);
      });
  }

  function getusercategorycontent() {
    const categorytemp = {
      categoryID: categoryid,
    };

    console.log("category id in get category  content", categoryid);
    axios
      .post("http://localhost:5000/api/contents/getusercontent", {
        contest: contestattr,
        category: categorytemp,
      })
      .then((res) => {
        // console.log(res);
        setcontents({
          categorycontents: res.data,
        });
        if (res.data.length > 0)
          console.log("category user contents", res.data[0].link);
      });
  }

  const categoryChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    console.log("value", value);

    console.log("user", contestattr.userID);

    var foundValue = categories.contestcategories.filter(
      (obj) => obj.title === value
    );

    console.log("category id", foundValue[0]._id);

    setcategoryid({
      ...category,
      categoryID: foundValue[0]._id,
    });
    categoryid = foundValue[0]._id;

    console.log("categoryID from change ", category.categoryID);
    console.log("user id from change", contestattr.userID);
    console.log("contest id from change", contestattr.contestID);
    console.log("check value", check);
    if (check === false) getcategorycontent();
    else getusercategorycontent();
  };

  const handleChange = async (e) => {
    console.log("category id", category.categoryID);
    categoryid = category.categoryID;
    var { name, value } = e.target;

    if (name === "ownuploads") {
      if (e.target.checked) {
        value = 1;
      } else {
        value = 0;
      }
    }
    if (value === 1) {
      setcheck(true);
      getusercategorycontent();
    } else {
      setcheck(false);
      getcategorycontent();
    }
  };

  var stylingObject = {
    image: {
      width: "30%",
      height: "30%",
      transform: "translate(0px, 10%)",
      borderColor: "purple",
      borderWidth: 3,
      borderRadius: "50%",
    },
  };

  return (
    <div className="container">
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
        <option value="" selected disabled hidden>
          Please select category
        </option>
        {categories.contestcategories.length > 0 ? (
          <>
            {categories.contestcategories.map((contestcat) => (
              <option key={contestcat._id}> {contestcat.title}</option>
            ))}
          </>
        ) : (
          <></>
        )}
      </select>

      {participant_type === "uploader" ? (
        <>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="ownuploads"
              onChange={handleChange}
              id="ownuploads"
            />
            <label className="form-check-label" htmlFor="ownuploads">
              Your Uploaded Contents
            </label>
          </div>
        </>
      ) : (
        <></>
      )}

      <div className="text-center">
        <div className="container text-center">
          <div className="row justify-content-center">
            {console.log("contentssss", contents.categorycontents)}
            {contents.categorycontents.length > 0 ? (
              <>
                {contents.categorycontents.map(
                  (content) => (
                    // <img
                    //   key={content.contentID[0]}
                    //   src={"../images/" + content.link[0]}
                    //   className=" img-thumbnail"
                    //   style={stylingObject.image}
                    // // alt={user.username}
                    // ></img>
                    (col = 12 - col),
                    (
                      // console.log("col", col),

                      <Contentcard
                        key={content.contentID[0]}
                        userID={contestattr.userID}
                        contestID={contestattr.contestID}
                        choiceID={content._id}
                        categoryID={content.categoryID}
                        contentID={content.contentID[0]}
                        link={content.link[0]}
                        col={col}
                        title={content.title[0]}
                        description={content.description[0]}
                      />
                    )
                  )
                )}
              </>
            ) : (
              <>
                <div>no contents to show</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
