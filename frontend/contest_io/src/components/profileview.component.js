import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ContestBox } from "./contests/contestBox";
import { obj2str } from "./helperFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Profileview = () => {
  const { userID } = useParams();
  const token = cookies.get("TOKEN");
  const location = useLocation();
  const [myContests, setMyContests] = useState([]);
  const [user, setuser] = useState({
    username: "",
    email: "",
    bio: "",
    facebookhandle: "",
    instagramhandle: "",
    img: "",
  });

  useEffect(() => {
    const myContestsQuery = obj2str([{ userID: ["eq", userID] }]);

    axios.get("http://localhost:5000/api/user/" + userID).then((res) => {
      // console.log(res.data.user.socialhandles.facebookhandle);
      setuser({
        username: res.data.user.username,
        email: res.data.user.email,
        bio: res.data.user.bio,
        facebookhandle: res.data.user.socialhandles.facebookhandle,
        instagramhandle: res.data.user.socialhandles.instagramhandle,
        img: decodeURIComponent(res.data.user.img),
      });
    });

    const fetchContests = async (query, func) => {
      // console.log('the query:', query)
      axios
        .get(`http://localhost:5000/api/participants/queryContests?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          var contests = [];
          for (let i = 0; i < res.data.contests.length; i++) {
            contests.push(res.data.contests[i]["contestID"]);
          }
          func(contests);
        });
    };
    fetchContests(myContestsQuery, setMyContests);
  }, [location]);

  let source = "../images/" + user.img;

  var stylingObject = {
    image: {
      width: "100%",
      height: "100%",
      transform: "translate(0px, -10%)",
      borderColor: "purple",
      borderWidth: 3,
      borderRadius: "50%",
    },
  };

  return (
    <div className="signup container">
      <h1 className="text-center my-3">Profile</h1>
      <form className="row">
        <div className="col-3">
          <div className="text-wrap">
            <div className="text-center">
              <img
                src={source}
                className=" img-thumbnail"
                style={stylingObject.image}
                alt={user.username}
              ></img>
            </div>
            <p className="fs-4 fw-bold my-0">{user.username}</p>
            <p>@username</p>
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
              {user.email}
            </p>
            <p className="mb-0">
              <FontAwesomeIcon icon={faFacebook} /> &nbsp;
              {user.facebookhandle}
            </p>
            <p className="mb-0">
              <FontAwesomeIcon icon={faInstagram} /> &nbsp;
              {user.instagramhandle}
            </p>
          </div>
        </div>

        <div className="col-9">
          {console.log(myContests)}
          <ContestBox contests={myContests} boxTitle={(userID === localStorage.getItem("id") ? "Your" : (user.username + "'s")) + " Contests"} col={6} />
        </div>
      </form>
    </div>
  );
};
