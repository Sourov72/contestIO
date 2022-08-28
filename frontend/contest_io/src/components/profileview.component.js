import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ContestBox } from "./contests/contestBox";
import { obj2str } from "./helperFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import nullSource from "../images/null-user.png"
import {
  faFacebook,
  faInstagram,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Profileview = () => {
  const { userID } = useParams();
  const token = cookies.get("TOKEN");
  const location = useLocation();
  const [result, setResult] = useState({
    count: "",
    contests: [],
  });
  const [skip, setskip] = useState(0);
  var limit = 4;
  const [user, setuser] = useState({
    username: "",
    nickname: "",
    email: "",
    bio: "",
    facebookhandle: "",
    instagramhandle: "",
    img: "",
  });
  const handleChange = async (e) => {
    e.preventDefault();
    var { value } = e.target;
    console.log("skip's value: ", value);
    fetchContests(value);
  };
  const fetchContests = async (skip) => {
    let query = obj2str([
      { userID: ["eq", userID] },
      { skip: ["skip", skip] },
      { limit: ["limit", limit] },
    ]);
    // console.log("the query:", query);
    axios
      .get(`http://localhost:5000/api/participants/queryContests?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("res: ". res.data)
        var contests = [];
        for (let i = 0; i < res.data.contests.length; i++) {
          contests.push(res.data.contests[i]["contestID"]);
        }
        setResult({
          count: res.data.count,
          contests: contests,
        });
      });
  };
  useEffect(() => {
    axios.get("http://localhost:5000/api/user/" + userID).then((res) => {
      // console.log(res.data.user.socialhandles.facebookhandle);
      setuser({
        username: res.data.user.username,
        nickname: res.data.user.nickname,
        email: res.data.user.email,
        bio: res.data.user.bio,
        facebookhandle: res.data.user.socialhandles.facebookhandle,
        instagramhandle: res.data.user.socialhandles.instagramhandle,
        img: decodeURIComponent(res.data.user.img),
      });
    });
    fetchContests();
  }, [location]);

  var stylingObject = {
    image: {
      width: "250px",
      height: "250px",
      objectFit: "cover",
      transform: "translate(0px, -10%)",
      borderColor: "purple",
      borderWidth: 3,
      borderRadius: "50%",
    },
  };

  function pagination() {
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          {skip !== 0 && (
            <>
              <li className="page-item">
                <button
                  className="page-link"
                  name="skip"
                  value={(skip - 1) * limit}
                  onClick={(e) => {
                    setskip(skip - 1);
                    handleChange(e);
                  }}
                >
                  Previous
                </button>
              </li>
            </>
          )}
          <li className="page-item">
            <button
              className="page-link"
              name="skip"
              value={skip * limit}
              onClick={handleChange}
            >
              {skip + 1}
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              name="skip"
              value={(skip + 1) * limit}
              onClick={handleChange}
            >
              {skip + 2}
            </button>
          </li>
          {(skip + 2) * limit < result.count && (
            <>
              <li className="page-item">
                <button
                  className="page-link"
                  name="skip"
                  value={(skip + 2) * limit}
                  onClick={(e) => {
                    setskip(skip + 1);
                    handleChange(e);
                  }}
                >
                  Next
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
  }

  // let nullSource = "../images/null-user.png";

  return (
    <div className="signup container">
      <h1 className="text-center my-3 fw-bold">Profile</h1>
      <form className="row">
        <div className="col-3">
          <div className="text-wrap">
            <div className="text-center">
              <PhotoProvider maskOpacity={0.8} bannerVisible={false}>
                <PhotoView src={user.img ? user.img : nullSource}>
                  <img
                    src={user.img ? user.img : nullSource}
                    className=" img-thumbnail"
                    style={stylingObject.image}
                    alt={user.username}
                  ></img>
                </PhotoView>
              </PhotoProvider>
            </div>
            <p className="fs-4 fw-bold my-0">{user.username}</p>
            <p className="mb-0">
              <FontAwesomeIcon icon={faSnapchat} /> &nbsp;
              {user.nickname ? user.nickname : "username"}
            </p>
            <p>{user.bio}</p>

            {userID === localStorage.getItem("id") && (
              <Link to="/profile/edit/">
                <button type="button" className="btn w-100 btn-outline-dark">
                  Edit Profile
                </button>
              </Link>
            )}

            <p className="mb-0 mt-2">
              <FontAwesomeIcon icon={faEnvelope} /> &nbsp;
              {user.email ? user.email : "Not provided"}
            </p>
            <p className="mb-0">
              <FontAwesomeIcon icon={faFacebook} /> &nbsp;
              {user.facebookhandle ? user.facebookhandle : "Not provided"}
            </p>
            <p className="mb-0">
              <FontAwesomeIcon icon={faInstagram} /> &nbsp;
              {user.instagramhandle ? user.instagramhandle : "Not provided"}
            </p>
          </div>
        </div>

        <div className="col-9">
          <div className="col-6 fw-light fst-italic text-muted fs-6 mb-2">
            Showing {result.contests.length} out of {result.count} contests{" "}
          </div>
          <ContestBox
            contests={result.contests}
            boxTitle={
              (userID === localStorage.getItem("id")
                ? "Your"
                : user.username + "'s") + " Contests"
            }
            col={6}
          />
          {result.count > limit && pagination()}
        </div>
      </form>
    </div>
  );
};
