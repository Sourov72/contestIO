import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { Contentcard } from "./contentcard";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const UploadedContentsShow = (props) => {
  const token = cookies.get("TOKEN");
  var contestid = "";
  var categoryid = "";
  var allcontent = "";

  const [select, setselect] = useState("all");

  const [check, setcheck] = useState(false);

  const [userType, setUserType] = useState("");

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

  const [owndelete, setowndelete] = useState(false);

  const [voteranonymity, setvoteranonymity] = useState(0);

  useEffect(() => {
    contestid = props.contestID;
    setcontestattr({
      ...contestattr,
      userID: localStorage.getItem("id"),
      contestID: contestid,
    });
    setUserType(props.userType);

    const contestidobj = {
      contestID: props.contestID,
    };

    axios
      .get("http://localhost:5000/api/contests/getvoteranonymity", {
        params: contestidobj,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("res body in anonimity get", res.data);
        setvoteranonymity(res.data);
      });

    allcontent = "all";
    setselect("all");

    getallcategories(allcontent);
    getcategorycontent(allcontent);
  }, []);

  function getallcategories() {
    // console.log(user);
    //path to be corrected
    console.log("contestid", contestid);
    axios
      .get("http://localhost:5000/api/contests/getcatogory/" + contestid, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);

        console.log("categories", res.data);
        if (res.data.length > 0) categoryid = res.data[0]._id;

        setcategories({
          ...categories,
          contestcategories: res.data,
        });

        if (res.data.length > 0) {
          setcategoryid({
            ...category,
            categoryID: res.data[0]._id,
          });
        }
      });
  }

  function getcategorycontent(sel_type) {
    var tempcontentdata = "";
    if (sel_type === "all") {
      tempcontentdata = {
        type: "all",
        id: props.contestID,
      };
    } else {
      tempcontentdata = {
        type: "category",
        id: categoryid,
      };
    }

    console.log("category id in get category  content", categoryid);
    axios
      .get("http://localhost:5000/api/contents/getallcontent", {
        params: tempcontentdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        setcontents({
          categorycontents: res.data,
        });
        if (res.data.length > 0) console.log("category contents", res.data[0]);
      });
  }

  function getusercategorycontent(sel_type) {
    console.log("come in the get user category content");

    var tempcontentdata = "";
    if (sel_type === "all") {
      tempcontentdata = {
        type: "all",
        id: props.contestID,
      };
    } else {
      if (categoryid === "") {
        categoryid = category.categoryID;
      }
      tempcontentdata = {
        type: "category",
        id: categoryid,
      };
    }

    // console.log("category id in get category  content", categoryid);
    axios
      .post("http://localhost:5000/api/contents/getusercontent", {
        contest: contestattr,
        category: tempcontentdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    allcontent = "category";

    setselect("category");
    const { name, value } = e.target;

    if (value == "all") {
      allcontent = "all";
      setselect("all");
    }

    // console.log("allcontent", allcontent);

    // console.log("user", contestattr.userID);

    var foundValue = categories.contestcategories.filter(
      (obj) => obj.title === value
    );

    if (allcontent != "all") {
      // console.log("category id", foundValue[0]._id);

      setcategoryid({
        ...category,
        categoryID: foundValue[0]._id,
      });
      categoryid = foundValue[0]._id;
    }
    if (check === false) getcategorycontent(allcontent);
    else getusercategorycontent(allcontent);
  };

  const handleChange = async (e) => {
    // console.log("category id", category.categoryID);
    categoryid = category.categoryID;
    var { name, value } = e.target;

    if (name === "ownuploads") {
      if (e.target.checked) {
        setowndelete(true);
        value = 1;
      } else {
        setowndelete(false);
        value = 0;
      }
    }
    if (value === 1) {
      setcheck(true);
      getusercategorycontent(select);
    } else {
      setcheck(false);
      getcategorycontent(select);
    }
  };

  return (
    <div className="container my-3">
      <h4 className="fw-bold">Choose Category</h4>
      <select
        className="form-select "
        name="category"
        onChange={categoryChange}
        // value={contest.objective}
        id="category"
      >
        <option value="" selected disabled hidden>
          Please select category
        </option>
        <option name="All" value="all">
          {" "}
          All
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

      {userType.includes("CONTESTANT") ? (
        <>
          <div className="form-check my-2">
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
        <div className="container-fluid my-3">
          <div className="row justify-content-center">
            {contents.categorycontents.length > 0 ? (
              <>
                {contents.categorycontents.map((content) => (
                  <Contentcard
                    key={content.contentID[0]}
                    userID={contestattr.userID}
                    contestID={contestattr.contestID}
                    choiceID={content._id}
                    categoryID={content.categoryID}
                    contentID={content.contentID[0]}
                    link={decodeURIComponent(content.link[0])}
                    isResult={false}
                    col={6}
                    title={content.title[0]}
                    description={content.description[0]}
                    anonimity={voteranonymity}
                    deleteshow={owndelete}
                    func={getusercategorycontent}
                    select={select}
                  />
                ))}
              </>
            ) : (
              <>
                <p className="fw-light fst-italic text-center my-3">
                  No contents to show.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
