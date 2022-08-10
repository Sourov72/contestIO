import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ContestBox } from "./contests/contestBox";
import { obj2str } from "./helperFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export const Profileview = (props) => {
  const location = useLocation()
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
    // here id is send simpliflically not as a object
    const uid = location.state.id;
    const myContestsQuery = obj2str([
      { userID: ["eq", uid] },
      
    ]);

    axios.get("http://localhost:5000/api/user/" + uid).then((res) => {
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
      const response = await fetch(`/api/participants/queryContests?${query}`);
      const json = await response.json();

      if (response.ok) {
        var contests = []
        // console.log("received:", json.contests)
        for(let i = 0; i < json.contests.length; i++) {
          contests.push(json.contests[i]['contestID'])
        }
        // console.log('contests:', contests)
        func(contests);
      }
    };
    fetchContests(myContestsQuery, setMyContests);
  }, [location]);

  let source = "../images/" + user.img;
  // console.log("hello vro", source);

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
            <button type="button" className="btn w-100 btn-outline-dark">
              Edit Profile
            </button>
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
          <ContestBox contests={myContests} boxTitle="Your Contests" col={6} />
        </div>
      </form>
    </div>
  );
};
